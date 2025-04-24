import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { transferAmount, walletId1, walletId2 } = body;
    const session = await auth();

    try {
        await prisma.$transaction(async (txTransfer) => {
            const wallet1 = await txTransfer.wallet.findUnique({
                where: {
                    id: walletId1,
                },
                select: {
                    id: true,
                    name: true,
                    balance: true,
                },
            });

            const wallet2 = await txTransfer.wallet.findUnique({
                where: {
                    id: walletId2,
                },
                select: {
                    id: true,
                    name: true,
                    balance: true,
                },
            });

            const balanceWallet1 = wallet1?.balance || new Prisma.Decimal(0);
            const balanceWallet2 = wallet2?.balance || new Prisma.Decimal(0);

            if (balanceWallet1.lessThan(transferAmount)) {
                throw new Error("Insufficient funds");
            }

            if (wallet1?.id === wallet2?.id) {
                throw new Error("Cannot transfer on same wallet");
            }

            await txTransfer.wallet.update({
                where: {
                    id: wallet1?.id,
                },
                data: {
                    balance: balanceWallet1.minus(transferAmount),
                },
            });

            await txTransfer.wallet.update({
                where: {
                    id: wallet2?.id,
                },
                data: {
                    balance: balanceWallet2.plus(transferAmount),
                },
            });

            await txTransfer.transaction.create({
                data: {
                    name: "Transfer Balance",
                    user: {
                        connect: {
                            id: session?.user?.id,
                        },
                    },
                    type: "transfer",
                    amount: transferAmount,
                    wallet: {
                        connect: {
                            id: walletId1,
                        },
                    },
                    note: `Moving money from ${wallet1?.name} to ${wallet2?.name}`,
                    date: new Date(),
                },
            });
        });

        return NextResponse.json("Transfer success!");
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";

        const statusCode = errorMessage === "Insufficient funds" ? 400 : 500;

        return NextResponse.json(
            { error: "Transaction failed", details: errorMessage },
            { status: statusCode }
        );
    }
}
