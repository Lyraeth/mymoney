import { User } from "@/type/User";

export interface Wallet {
    id: string;
    name: string;
    balance: Float32Array;
    userId: User;
}
