"use client";

import { signOut } from "next-auth/react";
import { Home, Calendar, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: "Início", href: "/dashboard" },
    { icon: Calendar, label: "Agenda", href: "/schedule" },
    { icon: Settings, label: "Ajustes", href: "/settings" },
  ];

  return (
    <aside className="fixed left-4 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4 p-3 bg-white/80 backdrop-blur-md border border-slate-200/50 rounded-[2rem] shadow-xl shadow-slate-200/50">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`p-3 rounded-2xl transition-all duration-300 ${
              isActive
                ? "bg-sky-500 text-white shadow-lg shadow-sky-500/30"
                : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
            }`}
          >
            <item.icon className="w-6 h-6" />
          </Link>
        );
      })}
      
      <div className="h-px w-full bg-slate-100 my-1" />
      
      <button
        onClick={() => signOut()}
        className="p-3 rounded-2xl text-rose-400 hover:bg-rose-50 hover:text-rose-500 transition-all duration-300"
      >
        <LogOut className="w-6 h-6" />
      </button>
    </aside>
  );
}