import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export function SignIn() {
    return (
        <form
            action={async () => {
                "use server";
                await signIn();
                // "github",
                // { redirectTo: "/dashboard" }
            }}
            className="flex w-full justify-center"
        >
            <Button type="submit">
                <LogIn /> Sign in
            </Button>
        </form>
    );
}
