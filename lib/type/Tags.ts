interface TransactionTag {
    transactionId: string;
    tagId: string;
}
export interface Tag {
    id: string;
    name: string;
    transaction: TransactionTag[];
}
