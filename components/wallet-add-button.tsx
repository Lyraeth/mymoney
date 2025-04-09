import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import Link from "next/link";

export default function AddWalletButton() {
    return (
        <Button asChild>
            <Link href={"#"}>
                <CirclePlus />
            </Link>
        </Button>
    );
}
