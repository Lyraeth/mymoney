import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { LogoutIcon } from "@/components/ui/logout";

export function SignOut() {
    return (
        <form
            action={async () => {
                "use server";
                await signOut();
            }}
        >
            <Button type="submit" variant={"secondary"}>
                <LogoutIcon /> Sign out
            </Button>
        </form>
    );
}
