"use client";

import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { AddWalletCard } from "@/components/wallet/wallet-card-add";
import { Wallet } from "@/lib/type/Wallet";
import { useQuery } from "@tanstack/react-query";
import { MoreHorizontal, TrendingUpIcon } from "lucide-react";

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
            <Card className="@container/card hover:scale-102 transition">
                <AddWalletCard />
            </Card>

            {isLoading ? (
                <div className="flex items-center h-full text-muted-foreground">
                    Loading wallets...
                </div>
            ) : (
                wallets.map((wallet) => (
                    <Card
                        key={wallet.id}
                        className="@container/card hover:scale-102 transition"
                    >
                        <CardHeader className="relative">
                            <CardDescription>{wallet.name}</CardDescription>
                            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                                Rp.{wallet.balance}
                            </CardTitle>
                            <div className="absolute right-4">
                                <Badge
                                    variant="outline"
                                    className="flex gap-1 rounded-lg text-xs"
                                >
                                    <MoreHorizontal className="size-3" />
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardFooter className="flex-col items-start gap-1 text-sm">
                            <div className="line-clamp-1 flex gap-2 font-medium">
                                Trending up this month{" "}
                                <TrendingUpIcon className="size-4" />
                            </div>
                            <div className="text-muted-foreground">
                                Visitors for the last 6 months
                            </div>
                        </CardFooter>
                    </Card>
                ))
            )}
        </>
    );
}
