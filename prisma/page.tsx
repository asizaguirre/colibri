"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 hidden md:block">
        <h2 className="text-xl font-bold text-indigo-600 mb-6">Colibri 🕊️</h2>
        <nav className="space-y-4">
          <Link href="/dashboard" className="block text-gray-700 hover:text-indigo-600 font-medium">
            📊 Dashboard
          </Link>
          <Link href="/rede" className="block text-gray-700 hover:text-indigo-600 font-medium">
            👥 Rede
          </Link>
          <Link href="/consultas" className="block text-gray-700 hover:text-indigo-600 font-medium">
            🗓️ Consultas
          </Link>
          <Link href="/insumos" className="block text-gray-700 hover:text-indigo-600 font-medium">
            📦 Insumos
          </Link>
        </nav>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 p-8">
        {/* Navbar */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 font-medium">
              {session?.user?.name || "Usuário"}
            </span>
            <img
              src={session?.user?.image || "https://via.placeholder.com/40"}
              alt="Avatar"
              className="w-10 h-10 rounded-full border border-gray-200"
            />
          </div>
        </header>

        {/* Cards de estatísticas */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-indigo-500">
            <h2 className="text-sm font-medium text-gray-500">Pacientes</h2>
            <p className="text-2xl font-bold text-indigo-600">128</p>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-emerald-500">
            <h2 className="text-sm font-medium text-gray-500">Consultas</h2>
            <p className="text-2xl font-bold text-emerald-600">42</p>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-amber-500">
            <h2 className="text-sm font-medium text-gray-500">Insumos</h2>
            <p className="text-2xl font-bold text-amber-600">15</p>
          </div>
        </section>
      </main>
    </div>
  );
}