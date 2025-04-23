import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, LoaderCircle, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function TransactionDeleteDialog({ id }: { id: string }) {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);

    const { mutate, isPending } = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/transaction/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete transaction");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            toast.success("Transaction delete!");
            setOpen(false);
        },
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={"outline"}>
                    <Trash2 className="size-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                    This action cannot be undone. This will permanently delete
                    the transaction.
                </p>
                <DialogFooter className="flex flex-row gap-2 justify-end">
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={isPending}
                    >
                        <X />
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => mutate(id)}
                        disabled={isPending}
                    >
                        {isPending ? (
                            <LoaderCircle className="animate-spin" />
                        ) : (
                            <Check />
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
