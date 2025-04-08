import { Heart } from "lucide-react";
import Link from "next/link";

export default function Home() {
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-mono">
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start ">
                <h1>
                    Welcome to{" "}
                    <p className="inline-flex text-teal-400">MyMoney</p>
                </h1>
            </main>
            <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
                <h1>
                    Created with{" "}
                    <Heart className="h-4 w-4 fill-red-400 inline-flex" /> by{" "}
                    <Link
                        href={"https://github.com/lyraeth"}
                        className="inline-flex font-medium text-yellow-300"
                    >
                        Lyraeth
                    </Link>
                </h1>
            </footer>
        </div>
    );
}
