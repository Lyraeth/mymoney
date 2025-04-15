import { ModeToggle } from "@/components/theme-changer";
import { ArrowLeftIcon } from "@/components/ui/arrow-left";
import { Button } from "@/components/ui/button";
import CardWallet from "@/components/wallet/wallet-card";
import { auth } from "@/lib/auth";
import Link from "next/link";

export default async function Dashboard() {
    const session = await auth();

    if (!session)
        return (
            <main className="flex justify-center items-center min-h-dvh w-full">
                <h1>Not Authenticated</h1>
            </main>
        );

    return (
        <main>
            <header className="p-5 border-b">
                <nav className="grid grid-cols-3 items-center">
                    <div className="flex justify-start">
                        <Button asChild>
                            <Link href={"/"}>
                                <ArrowLeftIcon />
                            </Link>
                        </Button>
                    </div>
                    <div className="flex justify-center">
                        <h1 className="text-teal-400 text-sm md:text-xl xl:text-xl">
                            MyMoney
                        </h1>
                    </div>
                    <div className="flex justify-end">
                        <ModeToggle />
                    </div>
                </nav>
            </header>
            <div className="flex flex-col border-b">
                <div className="flex flex-row px-5 py-3 justify-between items-center w-full border-b">
                    <p>Your Wallet</p>
                </div>
                <div className="flex h-6 items-end font-mono text-xs/6 whitespace-pre-line break-words text-black/50 max-sm:px-4 sm:h-10 dark:text-white/35 px-5 pt-1 border-b mt-15 md:mt-5 lg:mt-0">
                    These are your wallets. Add a new one via the ➕ below, or
                    click a more on top-right card to view, edit, or delete your
                    wallet.
                </div>
                <CardWallet />
            </div>
        </main>
    );
}
