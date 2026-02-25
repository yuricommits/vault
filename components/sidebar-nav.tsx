"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Hash, Settings, User, BookOpen } from "lucide-react";

const navItems = [
    { href: "/dashboard", icon: LayoutGrid, label: "snippets", exact: true },
    { href: "/dashboard/tags", icon: Hash, label: "tags", exact: false },
];

const bottomItems = [
    { href: "/dashboard/settings", icon: Settings, label: "settings", exact: false },
    { href: "/dashboard/profile", icon: User, label: "profile", exact: false },
];

function NavItem({
    href,
    icon: Icon,
    label,
    exact,
}: {
    href: string;
    icon: React.ElementType;
    label: string;
    exact: boolean;
}) {
    const pathname = usePathname();
    const isActive = exact ? pathname === href : pathname.startsWith(href);

    return (
        <Link
            href={href}
            className={[
                "flex items-center gap-[10px] px-[10px] py-[8px] text-[12px] font-mono rounded-sm transition-all duration-[0.18s] border-l-[2px]",
                isActive
                    ? "text-text-1 bg-white/5 border-l-white"
                    : "text-text-4 hover:text-text-1 hover:bg-white/5 border-l-transparent",
            ].join(" ")}
        >
            <Icon size={14} className={isActive ? "text-text-1" : "text-text-4"} />
            <span>{label}</span>
        </Link>
    );
}

export default function SidebarNav() {
    const pathname = usePathname();

    return (
        <div className="flex flex-col justify-between h-full py-[20px] px-[12px]">
            <nav className="flex flex-col gap-[2px]">
                {navItems.map((item) => (
                    <NavItem key={item.href} {...item} />
                ))}
            </nav>
            <div className="flex flex-col gap-[2px]">
                
                    <a href="/docs"
                    className={[
                        "flex items-center gap-[10px] px-[10px] py-[8px] text-[12px] font-mono rounded-sm transition-all duration-[0.18s] border-l-[2px]",
                        pathname === "/docs"
                            ? "text-text-1 bg-white/5 border-l-white"
                            : "text-text-4 hover:text-text-1 hover:bg-white/5 border-l-transparent",
                    ].join(" ")}
                >
                    <BookOpen size={14} className={pathname === "/docs" ? "text-text-1" : "text-text-4"} />
                    <span>cli docs</span>
                </a>
                {bottomItems.map((item) => (
                    <NavItem key={item.href} {...item} />
                ))}
            </div>
        </div>
    );
}
