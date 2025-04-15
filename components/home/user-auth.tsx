import { SignIn } from "@/components/auth/signin-button";
import { SignOut } from "@/components/auth/signout-button";
import DashboardButton from "@/components/dashboard/dashboard-button";
import { auth } from "@/lib/auth";

export default async function UserAuth() {
    const session = await auth();
    return (
        <>
            {!session ? (
                <SignIn />
            ) : (
                <div className="flex flex-col gap-8 justify-center items-center w-full">
                    <p>{session.user?.name}</p>
                    <div className="flex flex-row gap-4 justify-between">
                        <DashboardButton />
                        <SignOut />
                    </div>
                </div>
            )}
        </>
    );
}
