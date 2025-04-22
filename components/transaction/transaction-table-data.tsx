"use client";

import { columns } from "@/components/transaction/columns";
import { DataTable } from "@/components/transaction/data-table";
import { Transaction } from "@/lib/type/Transaction";
import { useQuery } from "@tanstack/react-query";

async function fetchTransaction(): Promise<Transaction[]> {
    const res = await fetch("/api/transaction");
    if (!res.ok) throw new Error("Failed to fetch Transaction");
    return res.json();
}

export default function TableTransactionData() {
    const { data: transactions = [], isLoading } = useQuery({
        queryKey: ["transactions"],
        queryFn: fetchTransaction,
    });

    return (
        <>
            {isLoading ? (
                <div className="p-5">
                    <div className="flex items-center h-full text-muted-foreground">
                        Loading transaction...
                    </div>
                </div>
            ) : (
                <DataTable columns={columns} data={transactions} />
            )}
        </>
    );
}
