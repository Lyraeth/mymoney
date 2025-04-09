import { User } from "@/type/User";

export interface Session {
    id: string;
    sessionToken: string;
    userId: string;
    expires: Date;
    user: User;
}
