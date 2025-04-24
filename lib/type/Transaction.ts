import { User } from "@/lib/type/User";
import { Wallet } from "@/lib/type/Wallet";
export interface Transaction {
    id: string;
    name: string;
    userId: string;
    user: User;
    type: "income" | "expanses" | "transfer";
    amount: number;
    walletId: string;
    wallet: Wallet;
    note?: string | null;
    date: Date;
}
