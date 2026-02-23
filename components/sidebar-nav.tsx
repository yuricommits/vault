"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", icon: "⊞", label: "snippets", exact: true },
  { href: "/dashboard/tags", icon: "#", label: "tags", exact: false },
];

const bottomItems = [
  { href: "/dashboard/settings", icon: "⚙", label: "settings", exact: false },
  { href: "/dashboard/profile", icon: "◯", label: "profile", exact: false },
];

function NavItem({ href, icon, label, exact }: { href: string; icon: string; label: string; exact: boolean }) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 text-xs transition-all duration-150 ${
        isActive
          ? "text-white bg-white/5 border-l border-white"
          : "text-white/50 hover:text-white hover:bg-white/5 border-l border-transparent"
      }`}
    >
      <span className={isActive ? "text-white" : "text-white/50"}>{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

export default function SidebarNav() {
  return (
    <div className="flex flex-col justify-between h-full py-6 px-3">
      <nav className="flex flex-col gap-0.5">
        {navItems.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </nav>
      <div className="flex flex-col gap-0.5">
        {bottomItems.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </div>
    </div>
  );
}
