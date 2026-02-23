import Link from "next/link";

const COLS = [
    {
        heading: "product",
        links: [
            { label: "Features", href: "#features" },
            { label: "How it works", href: "#how" },
            { label: "Changelog", href: "#changelog" },
        ],
    },
    {
        heading: "open source",
        links: [
            { label: "GitHub", href: "https://github.com/yuricommits/vault" },
            {
                label: "Contributing",
                href: "https://github.com/yuricommits/vault/blob/main/README.md",
            },
            {
                label: "MIT License",
                href: "https://github.com/yuricommits/vault/blob/main/LICENSE",
            },
        ],
    },
    {
        heading: "app",
        links: [
            { label: "Sign up", href: "/register" },
            { label: "Sign in", href: "/login" },
            { label: "Dashboard", href: "/dashboard" },
        ],
    },
];

export default function Footer() {
    return (
        <footer className="border-t border-border pt-[52px] pb-[28px]">
            <div className="container">
                <div className="grid grid-cols-[1.8fr_1fr_1fr] gap-[40px] mb-[40px] max-[820px]:grid-cols-2 max-[520px]:grid-cols-1">
                    <div className="flex flex-col gap-[12px] max-[820px]:col-span-2 max-[520px]:col-[auto]">
                        <Link
                            href="/"
                            className="flex items-center gap-[7px] text-[13px] font-semibold text-text-1 w-fit"
                        >
                            <span className="text-[16px] text-text-4">◈</span>
                            vault
                        </Link>
                        <p className="text-[11.5px] text-text-4 leading-[1.65]">
                            Personal code snippet manager.
                            <br />
                            Powered by Claude AI.
                        </p>
                    </div>

                    {COLS.map((col) => (
                        <div
                            key={col.heading}
                            className="flex flex-col gap-[10px]"
                        >
                            <p className="text-[10.5px] text-text-4 tracking-[0.5px] mb-[4px]">
                                # {col.heading}
                            </p>
                            <ul className="flex flex-col gap-[7px]">
                                {col.links.map((l) => (
                                    <li key={l.label}>
                                        <Link
                                            href={l.href}
                                            className="text-[12px] text-text-3 transition-colors duration-[0.18s] hover:text-text-1"
                                        >
                                            {l.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-between pt-[20px] border-t border-border max-[520px]:flex-col max-[520px]:gap-[10px] max-[520px]:items-start">
                    <span className="text-[11px] text-text-4">
                        © {new Date().getFullYear()} vault
                    </span>
                    <span className="text-[11px] text-text-4">
                        built with Next.js · deployed on Vercel · AI by Claude
                    </span>
                </div>
            </div>
        </footer>
    );
}
