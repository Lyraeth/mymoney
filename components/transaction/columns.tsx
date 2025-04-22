"use client";

import { Button } from "@/components/ui/button";
import { Transaction } from "@/lib/type/Transaction";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export const columns: ColumnDef<Transaction>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant={"ghost"}
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: "type",
        header: ({ column }) => {
            return (
                <Button
                    variant={"ghost"}
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Type
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: "amount",
        header: ({ column }) => {
            return (
                <Button
                    variant={"ghost"}
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Amount
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const money = row.original.amount;
            return `Rp. ${money}`;
        },
    },
    {
        accessorKey: "wallet.name",
        header: ({ column }) => {
            return (
                <Button
                    variant={"ghost"}
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Wallet
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: "date",
        header: ({ column }) => {
            return (
                <Button
                    variant={"ghost"}
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const input = row.original.date;
            const date = new Date(input);
            const formattedDate = date.toLocaleDateString("id-ID");

            return formattedDate;
        },
    },
    {
        accessorKey: "note",
        header: "Note",
    },
];
