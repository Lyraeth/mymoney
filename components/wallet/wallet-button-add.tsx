"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CirclePlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useMediaQuery } from "usehooks-ts";
import { z } from "zod";

const formSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Name wallet must be at least 2 characters." })
        .max(50, { message: "Name wallet maximal 50 characters." }),
    balance: z.coerce.number({ message: "balance must be a number" }),
});

export function DrawerDialogAddWallet() {
    const [open, setOpen] = useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px");

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline">
                        <CirclePlus />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add Wallet</DialogTitle>
                        <DialogDescription>
                            {` Add wallet to your profile here. Click submit when
                            you're done.`}
                        </DialogDescription>
                    </DialogHeader>
                    <ProfileForm />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="outline">
                    <CirclePlus />
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Add Wallet</DrawerTitle>
                    <DrawerDescription>
                        {`Add wallet to your profile here. Click submit when
                        you're done.`}
                    </DrawerDescription>
                </DrawerHeader>
                <ProfileForm className="px-4" />
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}

function ProfileForm({ className }: React.ComponentProps<"form">) {
    const [submit, setSubmit] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            balance: 0,
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setSubmit(true);
        try {
            const response = await fetch("/api/wallet", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Something went wrong");
            }

            toast("Add Wallet successfully!");
            setSubmit(false);
            form.reset();
        } catch (error) {
            console.error("Error creating wallet:", error);
        }
    };

    return (
        <Form {...form}>
            <form
                className={cn("grid items-start gap-4", className)}
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <div className="grid gap-2">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name Wallet</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Bank name or whatever you like"
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
                                    <Input {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>
                <Button
                    type="submit"
                    disabled={submit}
                    onClick={form.handleSubmit(onSubmit)}
                >
                    {submit ? "Submitting..." : "Submit"}
                </Button>
            </form>
        </Form>
    );
}
