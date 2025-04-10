import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

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
