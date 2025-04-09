import { Account } from "@/type/Account";
import { Session } from "@/type/Session";
import { Wallet } from "@/type/Wallet";

export interface User {
    id: string;
    name?: string;
    email?: string;
    emailVerified?: Date;
    image?: string;
    accounts: Account[];
    sessions: Session[];
    Wallet: Wallet;
}
