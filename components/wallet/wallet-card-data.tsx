"use client";

import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteWalletDialog } from "@/components/wallet/wallet-dialog-delete";
import { Wallet } from "@/lib/type/Wallet";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";

async function fetchWallets(): Promise<Wallet[]> {
    const res = await fetch("/api/wallet");
    if (!res.ok) throw new Error("Failed to fetch wallets");
    return res.json();
}

export default function WalletCardData() {
    const { data: wallets = [], isLoading } = useQuery({
        queryKey: ["wallets"],
        queryFn: fetchWallets,
    });

    return (
        <>
            {isLoading ? (
                <div className="flex items-center h-full text-muted-foreground">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
                        <Skeleton className="@container/card w-[390px] h-[111px] md:w-[360px] xl:w-[366px]" />
                    </div>
                </div>
            ) : (
                <AnimatePresence>
                    {wallets.map((wallet) => (
                        <Card
                            className="@container/card hover:scale-102 transition"
                            key={wallet.id}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                transition={{
                                    duration: 0.3,
                                    ease: "easeInOut",
                                }}
                            >
                                <CardHeader className="relative">
                                    <CardDescription>
                                        {wallet.name}
                                    </CardDescription>
                                    <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                                        {new Intl.NumberFormat("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                            maximumFractionDigits: 0,
                                        }).format(wallet.balance)}
                                    </CardTitle>
                                    <div className="absolute right-4">
                                        <DeleteWalletDialog id={wallet.id} />
                                    </div>
                                </CardHeader>
                            </motion.div>
                        </Card>
                    ))}
                </AnimatePresence>
            )}
        </>
    );
}
