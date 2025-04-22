import { Tag } from "@/lib/type/Tags";
import { User } from "@/lib/type/User";
import { Wallet } from "@/lib/type/Wallet";

export interface Transaction {
    id: string;
    name: string;
    userId: string;
    user: User;
    type: "income" | "expanses";
    amount: Float32Array;
    walletId: string;
    wallet: Wallet;
    tags: Tag[];
    note?: string | null;
    date: Date;
}
