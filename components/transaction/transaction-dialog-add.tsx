"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Wallet } from "@/lib/type/Wallet";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
    CalendarIcon,
    Check,
    ChevronsUpDown,
    LoaderCircle,
    Plus,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const typeEnum = [
    {
        label: "income",
        value: "income",
    },
    {
        label: "expanses",
        value: "expanses",
    },
] as const;

const formSchema = z.object({
    name: z.string(),
    type: z.string(),
    amount: z.preprocess(
        (val) => parseFloat(String(val)),
        z.number({
            message: "Balance must be a Number",
        })
    ),
    walletId: z.string(),
    note: z.string().optional(),
    date: z.date(),
}) as z.ZodType<{
    name: string;
    type: string;
    amount: number;
    walletId: string;
    note: string;
    date: Date;
}>;

async function fetchWallets(): Promise<Wallet[]> {
    const res = await fetch("/api/wallet");
    if (!res.ok) throw new Error("Failed to fetch wallets");
    return res.json();
}

export function AddTransactionDialog() {
    const queryClient = useQueryClient();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const { data: wallets = [] } = useQuery({
        queryKey: ["wallets"],
        queryFn: fetchWallets,
    });

    const { mutate, isPending } = useMutation({
        mutationFn: async (values: z.infer<typeof formSchema>) => {
            const res = await fetch("/api/transaction", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });
            if (!res.ok) throw new Error("Failed to create transaction");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transaction"] });
            toast.success("Transaction success!");
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
            <DialogTrigger asChild>
                <Button>
                    <Plus />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Transaction</DialogTitle>
                    <DialogDescription>
                        Enter transaction details
                    </DialogDescription>
                </DialogHeader>
                <Separator />
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col space-y-4 md:flex-row md:space-x-4"
                    >
                        <div className="flex flex-col space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="what's your transaction?"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Type</FormLabel>
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
                                                            ? typeEnum.find(
                                                                  (type) =>
                                                                      type.value ===
                                                                      field.value
                                                              )?.label
                                                            : "Select type"}
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
                                                            {typeEnum.map(
                                                                (type) => (
                                                                    <CommandItem
                                                                        value={
                                                                            type.label
                                                                        }
                                                                        key={
                                                                            type.value
                                                                        }
                                                                        onSelect={() => {
                                                                            form.setValue(
                                                                                "type",
                                                                                type.value
                                                                            );
                                                                        }}
                                                                    >
                                                                        {
                                                                            type.label
                                                                        }
                                                                        <Check
                                                                            className={cn(
                                                                                "ml-auto",
                                                                                type.value ===
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
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Amount</FormLabel>
                                        <FormControl>
                                            <Input placeholder="0" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/*  */}

                        <div className="flex flex-col space-y-4">
                            <FormField
                                control={form.control}
                                name="walletId"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Wallet</FormLabel>
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
                                                            No wallet found.
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
                                                                                "walletId",
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
                                name="note"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Note</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="any note?"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>
                                            Date of transaction
                                        </FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "md:w-[226px] pl-3 text-left font-normal",
                                                            !field.value &&
                                                                "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(
                                                                field.value,
                                                                "PPP"
                                                            )
                                                        ) : (
                                                            <span>
                                                                Pick a date
                                                            </span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent>
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date > new Date() ||
                                                        date <
                                                            new Date(
                                                                "1900-01-01"
                                                            )
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
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
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
