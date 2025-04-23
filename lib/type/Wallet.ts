import { User } from "@/type/User";
export interface Wallet {
    id: string;
    name: string;
    balance: number;
    userId: User;
}
