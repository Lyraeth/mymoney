import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
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

    await prisma.wallet.delete({
        where: {
            id: id,
        },
    });

    return NextResponse.json("Delete wallet success!");
}
