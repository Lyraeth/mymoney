import { Button } from "@/components/ui/button";
import { HomeIcon } from "@/components/ui/home";
import Link from "next/link";

export default function DashboardButton() {
    return (
        <Button asChild>
            <Link href={"/dashboard"}>
                <HomeIcon /> Dashboard
            </Link>
        </Button>
    );
}
