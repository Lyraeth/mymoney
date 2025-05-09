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

    const wallets = await prisma.wallet.findMany({
        where: {
            userId: session?.user?.id,
        },
    });

    const response = wallets.map((wallet) => ({
        ...wallet,
        balance: wallet.balance.toNumber(),
    }));

    return NextResponse.json(response);
}

export async function POST(request: NextRequest) {
    const session = await auth();
    const body = await request.json();
    const { name, balance } = body;

    if (!session) {
        return NextResponse.json(
            { error: "Not Authenticated" },
            { status: 401 }
        );
    }

    await prisma.wallet.create({
        data: {
            name: name,
            balance: balance,
            user: {
                connect: {
                    id: session.user?.id,
                },
            },
        },
    });

    return NextResponse.json({ message: "Create wallet success" });
}
