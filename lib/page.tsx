import { prisma } from "@/lib/prisma";
import { AppointmentModal } from "./appointment-modal";
import { Heart, Activity, User, Stethoscope, Baby, Pill } from "lucide-react";

export default async function DashboardPage() {
  const gynecologists = await prisma.professional.findMany({
    where: { specialty: "GYNECOLOGIST" },
    include: { user: true },
  });

  const specialists = await prisma.professional.findMany({
    where: { specialty: "REPRODUCTION_SPECIALIST" },
    include: { user: true },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Heart className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">
              Colibri 2.0 <span className="text-slate-400 font-normal">| Rede de Acolhimento</span>
            </h1>
          </div>
          <AppointmentModal />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Coluna Principal: Médicos */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Pré-Concepção */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Stethoscope className="h-5 w-5 text-teal-600" />
              <h2 className="text-lg font-bold text-slate-800">Pré-Concepção: Ginecologia</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {gynecologists.map((doc) => (
                <div key={doc.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                      {doc.user.image ? <img src={doc.user.image} className="rounded-full" /> : <User className="text-slate-400" />}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{doc.user.name}</p>
                      <p className="text-xs text-slate-500">CRM: {doc.crm}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Concepção */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Baby className="h-5 w-5 text-rose-500" />
              <h2 className="text-lg font-bold text-slate-800">Concepção: Especialistas</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {specialists.map((doc) => (
                <div key={doc.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-rose-300 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                      {doc.user.image ? <img src={doc.user.image} className="rounded-full" /> : <User className="text-slate-400" />}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{doc.user.name}</p>
                      <p className="text-xs text-slate-500">CRM: {doc.crm}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Coluna Lateral: Smart Insumos */}
        <aside className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-indigo-600">
              <Activity className="h-5 w-5" />
              <h3 className="font-bold">Smart Insumos</h3>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 text-green-700 rounded-lg border border-green-100">
              <Pill className="h-5 w-5" />
              <div>
                <p className="font-bold text-sm">Status: Em dia</p>
                <p className="text-xs opacity-80">Seus medicamentos estão controlados.</p>
              </div>
            </div>
            <button className="w-full mt-4 text-sm text-indigo-600 font-medium hover:underline">Ver estoque completo</button>
          </div>
        </aside>

      </main>
    </div>
  );
}