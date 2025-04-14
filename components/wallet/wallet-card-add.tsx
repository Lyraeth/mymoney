"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Name wallet must be at least 2 characters." })
        .max(50, { message: "Name wallet maximal 50 characters." }),
    balance: z.preprocess((val) => parseFloat(String(val)), z.number()),
}) as z.ZodType<{
    name: string;
    balance: number;
}>;

export function AddWalletCard() {
    const queryClient = useQueryClient();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            balance: 0,
        },
    });

    const { mutate, isPending } = useMutation({
        mutationFn: async (values: z.infer<typeof formSchema>) => {
            const res = await fetch("/api/wallet", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });
            if (!res.ok) throw new Error("Failed to create wallet");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["wallets"] });
            toast.success("Wallet added!");
            form.reset();
        },
        onError: (e) => {
            toast.error(e.message || "Error adding wallet");
        },
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        mutate(data);
    };

    return (
        <Dialog>
            <DialogTrigger className="flex flex-row justify-center items-center h-full text-muted-foreground gap-2">
                <Plus />
                Add Wallet
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Wallet</DialogTitle>
                    <DialogDescription>Enter wallet details</DialogDescription>
                </DialogHeader>
                <Separator />
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name wallet</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Banks name or whatever u want"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="balance"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Balance</FormLabel>
                                    <FormControl>
                                        <Input placeholder="0" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Submitting..." : "Submit"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
