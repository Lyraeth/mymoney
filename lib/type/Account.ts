import { User } from "@/type/User";

export interface Account {
    id: string;
    userId: string;
    type: string;
    provider: string;
    providerAccountId: string;
    refresh_token?: string;
    access_token?: string;
    expired_at?: Int32Array;
    token_type?: string;
    scope?: string;
    id_token?: string;
    session_state?: string;
    user: User;
}
