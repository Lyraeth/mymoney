"use client";

import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
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
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Wallet } from "@/lib/type/Wallet";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    ArrowLeftRight,
    Check,
    ChevronsUpDown,
    LoaderCircle,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
    walletId1: z.string(),
    walletId2: z.string(),
    transferAmount: z.preprocess(
        (val) => parseFloat(String(val)),
        z.number({
            message: "Balance must be a Number",
        })
    ),
}) as z.ZodType<{
    walletId1: string;
    walletId2: string;
    transferAmount: number;
}>;

async function fetchWallets(): Promise<Wallet[]> {
    const res = await fetch("/api/wallet");
    if (!res.ok) throw new Error("Failed to fetch wallets");
    return res.json();
}

export function TransferWalletDialog() {
    const queryClient = useQueryClient();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            walletId1: "",
            walletId2: "",
        },
    });

    const { data: wallets = [] } = useQuery({
        queryKey: ["wallets"],
        queryFn: fetchWallets,
    });

    const { mutate, isPending } = useMutation({
        mutationFn: async (values: z.infer<typeof formSchema>) => {
            const res = await fetch("/api/wallet/transfer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });
            if (!res.ok) throw new Error("Check your wallet or balance");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["wallets"] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            toast.success("Transfer success!");
            form.reset();
        },
        onError: (e) => {
            toast.error(e.message || "Error transfer balance");
        },
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        mutate(data);
    };

    return (
        <Dialog>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                            <Button>
                                <ArrowLeftRight />
                            </Button>
                        </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Transfer Balance</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Transfer Balance</DialogTitle>
                    <DialogDescription>Enter transfer detail</DialogDescription>
                </DialogHeader>
                <Separator />
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <div className="flex flex-row space-x-4">
                            <FormField
                                control={form.control}
                                name="walletId1"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>From Wallet</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className={cn(
                                                            "md:w-[226px] justify-between",
                                                            !field.value &&
                                                                "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value
                                                            ? wallets.find(
                                                                  (wallet) =>
                                                                      wallet.id ===
                                                                      field.value
                                                              )?.name
                                                            : "Select wallet"}
                                                        <ChevronsUpDown className="opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent>
                                                <Command>
                                                    <CommandInput
                                                        placeholder="search type..."
                                                        className="h-9"
                                                    />
                                                    <CommandList>
                                                        <CommandEmpty>
                                                            No type found.
                                                        </CommandEmpty>
                                                        <CommandGroup>
                                                            {wallets.map(
                                                                (wallet) => (
                                                                    <CommandItem
                                                                        value={
                                                                            wallet.name
                                                                        }
                                                                        key={
                                                                            wallet.id
                                                                        }
                                                                        onSelect={() => {
                                                                            form.setValue(
                                                                                "walletId1",
                                                                                wallet.id
                                                                            );
                                                                        }}
                                                                    >
                                                                        {
                                                                            wallet.name
                                                                        }
                                                                        <Check
                                                                            className={cn(
                                                                                "ml-auto",
                                                                                wallet.id ===
                                                                                    field.value
                                                                                    ? "opacity-100"
                                                                                    : "opacity-0"
                                                                            )}
                                                                        />
                                                                    </CommandItem>
                                                                )
                                                            )}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="walletId2"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>To Wallet</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className={cn(
                                                            "md:w-[226px] justify-between",
                                                            !field.value &&
                                                                "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value
                                                            ? wallets.find(
                                                                  (wallet) =>
                                                                      wallet.id ===
                                                                      field.value
                                                              )?.name
                                                            : "Select wallet"}
                                                        <ChevronsUpDown className="opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent>
                                                <Command>
                                                    <CommandInput
                                                        placeholder="search type..."
                                                        className="h-9"
                                                    />
                                                    <CommandList>
                                                        <CommandEmpty>
                                                            No type found.
                                                        </CommandEmpty>
                                                        <CommandGroup>
                                                            {wallets.map(
                                                                (wallet) => (
                                                                    <CommandItem
                                                                        value={
                                                                            wallet.name
                                                                        }
                                                                        key={
                                                                            wallet.id
                                                                        }
                                                                        onSelect={() => {
                                                                            form.setValue(
                                                                                "walletId2",
                                                                                wallet.id
                                                                            );
                                                                        }}
                                                                    >
                                                                        {
                                                                            wallet.name
                                                                        }
                                                                        <Check
                                                                            className={cn(
                                                                                "ml-auto",
                                                                                wallet.id ===
                                                                                    field.value
                                                                                    ? "opacity-100"
                                                                                    : "opacity-0"
                                                                            )}
                                                                        />
                                                                    </CommandItem>
                                                                )
                                                            )}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="transferAmount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        <Input placeholder="0" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? (
                                    <LoaderCircle className="animate-spin" />
                                ) : (
                                    "Submit"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
