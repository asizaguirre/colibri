"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  UserCircle, 
  Menu, 
  X, 
  Heart 
} from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Rede de Acolhimento", href: "/rede", icon: Users },
    { name: "Smart Insumos", href: "/insumos", icon: Package },
    { name: "Perfil do Usuário", href: "/perfil", icon: UserCircle },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-sky-100 rounded-full">
            <Heart className="w-5 h-5 text-sky-500 fill-sky-500" />
          </div>
          <span className="font-bold text-slate-800">Colibri</span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-100 shadow-sm transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}>
        <div className="flex flex-col h-full p-6">
          {/* Logo Desktop */}
          <div className="hidden lg:flex items-center gap-3 mb-10 px-2">
            <div className="p-2.5 bg-sky-50 rounded-full">
              <Heart className="w-6 h-6 text-sky-500 fill-sky-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">Colibri</h1>
              <p className="text-xs text-slate-400 font-medium">Rede de Acolhimento</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2 flex-1 mt-16 lg:mt-0">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3.5 rounded-full transition-all duration-200 font-medium text-sm group
                    ${isActive 
                      ? "bg-sky-50 text-sky-600 shadow-sm" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 transition-colors ${isActive ? "text-sky-500" : "text-slate-400 group-hover:text-slate-600"}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Profile Card */}
          <div className="mt-auto pt-6 border-t border-slate-100">
            <button className="w-full flex items-center gap-3 p-3 rounded-3xl hover:bg-slate-50 transition-colors text-left group">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 font-bold shadow-sm group-hover:bg-indigo-100 transition-colors">
                U
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">Paciente</p>
                <p className="text-xs text-slate-500 truncate">Ver perfil</p>
              </div>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}