import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const session = await auth();

    if (!session) {
        return NextResponse.json(
            { error: "Not Authenticated" },
            { status: 401 }
        );
    }

    const transactions = await prisma.transaction.findMany({
        where: {
            user: {
                email: session?.user?.email,
            },
        },
        include: {
            wallet: {
                select: {
                    name: true,
                },
            },
        },
    });

    const response = transactions.map((tx) => ({
        ...tx,
        amount: tx.amount.toNumber(),
    }));

    return NextResponse.json(response);
}

export async function POST(request: NextRequest) {
    const session = await auth();
    const body = await request.json();
    const { name, type, amount, note, date, walletId } = body;

    if (!session) {
        return NextResponse.json(
            { error: "Not Authenticated" },
            { status: 401 }
        );
    }

    try {
        await prisma.$transaction(async (txClient) => {
            const tx = await txClient.transaction.create({
                data: {
                    name,
                    user: {
                        connect: {
                            id: session.user?.id,
                        },
                    },
                    type,
                    amount,
                    wallet: {
                        connect: {
                            id: walletId,
                        },
                    },
                    note,
                    date,
                },
            });

            const wallet = await txClient.wallet.findUnique({
                where: {
                    id: walletId,
                },
                select: {
                    balance: true,
                },
            });

            let balanceNow = wallet?.balance || new Prisma.Decimal(0);

            if (tx.type === "income") {
                balanceNow = balanceNow.plus(tx.amount);
            } else {
                balanceNow = balanceNow.minus(tx.amount);
            }

            await txClient.wallet.update({
                where: { id: walletId },
                data: { balance: balanceNow },
            });
        });
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { error: "Failed to create transaction", details: errorMessage },
            { status: 500 }
        );
    }

    return NextResponse.json({
        message: "Create wallet success!",
    });
}
