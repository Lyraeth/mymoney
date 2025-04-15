import { Button } from "@/components/ui/button";
import { CircleMinus } from "lucide-react";
import Link from "next/link";

export default function DeleteWalletButton() {
    return (
        <Button asChild>
            <Link href={"#"}>
                <CircleMinus />
            </Link>
        </Button>
    );
}
