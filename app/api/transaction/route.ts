import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const session = await auth();

    if (!session) {
        return NextResponse.json(
            { error: "Not Authenticated" },
            { status: 401 }
        );
    }

    const response = await prisma.transaction.findMany({
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
        await prisma.transaction.create({
            data: {
                name: name,
                user: {
                    connect: {
                        id: session.user?.id,
                    },
                },
                type: type,
                amount: amount,
                wallet: {
                    connect: {
                        id: walletId,
                    },
                },
                note: note,
                date: date,
            },
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
