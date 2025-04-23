import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const id = (await params).id;
    const session = await auth();

    if (!session) {
        return NextResponse.json(
            { message: "Not Authenticated" },
            { status: 401 }
        );
    }

    try {
        await prisma.$transaction(async (txClient) => {
            const tx = await prisma.transaction.delete({
                where: {
                    id: id,
                },
                select: {
                    amount: true,
                    walletId: true,
                },
            });

            const wallet = await txClient.wallet.findUnique({
                where: {
                    id: tx.walletId,
                },
                select: {
                    balance: true,
                },
            });

            let balanceNow = wallet?.balance || new Prisma.Decimal(0);

            balanceNow = balanceNow.plus(tx.amount);

            await txClient.wallet.update({
                where: { id: tx.walletId },
                data: { balance: balanceNow },
            });
        });
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { error: "Failed to delete transaction", details: errorMessage },
            { status: 500 }
        );
    }

    return NextResponse.json("Transaction deleted!");
}
