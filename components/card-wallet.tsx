"use client";

import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Wallet } from "@/lib/type/Wallet";
import { useEffect, useState } from "react";

export default function CardWallet() {
    const [wallets, setWallets] = useState([]);

    useEffect(() => {
        const fetchWallet = async () => {
            try {
                const response = await fetch("/api/wallet");
                if (!response.ok) {
                    throw new Error("Failed to fetch wallets");
                }
                const data = await response.json();
                setWallets(data);
            } catch (error) {
                console.error("Error fetching wallets:", error);
            }
        };
        fetchWallet();
    }, []);

    return (
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
                        {wallets.map((wallet: Wallet) => (
                            <Card
                                className="@container/card hover:scale-102"
                                key={wallet.id}
                            >
                                <ContextMenu>
                                    <ContextMenuTrigger>
                                        <CardHeader className="relative">
                                            <CardDescription>
                                                {wallet.name}
                                            </CardDescription>
                                            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                                                Rp.{wallet.balance}
                                            </CardTitle>
                                            {/* <div className="absolute right-4 top-4">
                                        <Badge
                                            variant="outline"
                                            className="flex gap-1 rounded-lg text-xs"
                                        >
                                            <TrendingUpIcon className="size-3" />
                                            +12.5%
                                        </Badge>
                                    </div> */}
                                        </CardHeader>
                                        {/* <CardFooter className="flex-col items-start gap-1 text-sm">
                                    <div className="line-clamp-1 flex gap-2 font-medium">
                                        Trending up this month{" "}
                                        <TrendingUpIcon className="size-4" />
                                    </div>
                                    <div className="text-muted-foreground">
                                        Visitors for the last 6 months
                                    </div>
                                </CardFooter> */}
                                        <ContextMenuContent>
                                            <ContextMenuItem>
                                                View
                                            </ContextMenuItem>
                                            <ContextMenuItem>
                                                Edit
                                            </ContextMenuItem>
                                            <ContextMenuItem>
                                                Delete
                                            </ContextMenuItem>
                                        </ContextMenuContent>
                                    </ContextMenuTrigger>
                                </ContextMenu>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
