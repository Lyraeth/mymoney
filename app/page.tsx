import UserAuth from "@/components/home/user-auth";
import { ModeToggle } from "@/components/theme-changer";
import { GithubIcon } from "@/components/ui/github";
import { ArrowUpRight, Heart } from "lucide-react";
import Link from "next/link";

export default function Home() {
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-mono">
            <header className="absolute top-4 right-4">
                <div className="flex gap-4 items-center">
                    <ModeToggle />
                    <Link
                        href={"https://github.com/Lyraeth/mymoney"}
                        target="_blank"
                    >
                        <div className="gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background shadow-none hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 min-w-[150px] flex items-center justify-between">
                            <GithubIcon />
                            <div className="flex items-center gap-1">
                                Github
                            </div>
                            <ArrowUpRight />
                        </div>
                    </Link>
                </div>
            </header>
            <main className="flex flex-col justify-center gap-[32px] row-start-2 items-center sm:items-start">
                <div className="flex justify-center w-full text-3xl">
                    <h1>
                        Welcome to{" "}
                        <p className="inline-flex text-teal-400 hover:underline">
                            MyMoney
                        </p>{" "}
                    </h1>
                </div>
                <UserAuth />
            </main>
            <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
                <h1>
                    Created with{" "}
                    <Heart className="h-4 w-4 fill-red-400 inline-flex" /> by{" "}
                    <Link
                        href={"https://github.com/lyraeth"}
                        target="_blank"
                        className="inline-flex font-medium text-yellow-300 hover:underline hover:underline-offset-2"
                    >
                        Lyraeth
                    </Link>
                </h1>
            </footer>
        </div>
    );
}
