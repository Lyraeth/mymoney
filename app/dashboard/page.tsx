import CardWallet from "@/components/card-wallet";
import SkeletonCard from "@/components/card-wallet-skeleton";
import { ModeToggle } from "@/components/theme-changer";
import { ArrowLeftIcon } from "@/components/ui/arrow-left";
import { Button } from "@/components/ui/button";
import AddWalletButton from "@/components/wallet-add-button";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { Suspense } from "react";

export default async function Dashboard() {
    const session = await auth();

    if (!session)
        return (
            <main className="flex justify-center items-center min-h-dvh w-full">
                <h1>Not Authenticated</h1>
            </main>
        );

    return (
        <main className="w-full min-h-dvh">
            <header className="p-5 border-b">
                <nav className="flex flex-row gap-2 justify-between items-center">
                    <Button asChild>
                        <Link href={"/"}>
                            <ArrowLeftIcon />
                        </Link>
                    </Button>
                    <div className="flex text-sm md:text-xl xl:text-xl text-center">
                        <h1 className="text-teal-400">MyMoney</h1>
                    </div>
                    <ModeToggle />
                </nav>
            </header>
            <div className="flex flex-col border-b">
                <div className="flex flex-row px-5 py-2 justify-between items-center w-full border-b">
                    <p>Your Wallet</p>
                    <AddWalletButton />
                </div>
                <Suspense fallback={<SkeletonCard />}>
                    <CardWallet />
                </Suspense>
            </div>
        </main>
    );
}
