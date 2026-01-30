import { prisma } from '@/lib/prisma';
import { AppointmentModal } from '@/lib/appointment-modal';
import { Heart, Activity, User, Stethoscope, Baby, Pill } from "lucide-react";

export default async function DashboardPage() {
  const gynecologists = await prisma.professional.findMany({
    where: { specialty: "Ginecologista" },
    include: { user: true },
  });

  const specialists = await prisma.professional.findMany({
    where: { specialty: "Especialista" },
    include: { user: true },
  });

  const supplies = await prisma.supply.findMany({
    orderBy: { quantity: 'asc' },
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#00a3e0]/10 rounded-2xl">
              <Heart className="h-8 w-8 text-[#00a3e0]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#00a3e0] tracking-tight">Colibri 2.0</h1>
              <p className="text-slate-500 text-sm font-medium">Rede de Acolhimento Life Clinic</p>
            </div>
          </div>
          <AppointmentModal />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Coluna Principal */}
        <div className="lg:col-span-2 space-y-12">

          {/* Pré-Concepção */}
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                <Stethoscope className="h-6 w-6 text-[#00a3e0]" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Pré-Concepção</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {gynecologists.map((doc) => (
                <div key={doc.id} className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-50 group">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center overflow-hidden border-4 border-slate-50 shadow-sm group-hover:border-[#00a3e0]/20 transition-colors">
                      {doc.user.image ? <img src={doc.user.image} alt={doc.user.name || "Médico"} className="w-full h-full object-cover" /> : <User className="h-8 w-8 text-[#00a3e0]" />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-lg">{doc.user.name}</p>
                      <p className="text-sm text-[#00a3e0] font-medium">Ginecologista</p>
                      <p className="text-xs text-slate-400 mt-2 bg-slate-50 px-3 py-1 rounded-full inline-block font-medium">CRM: {doc.crm || "N/A"}</p>
                    </div>
                  </div>
                </div>
              ))}
               {gynecologists.length === 0 && <p className="text-slate-500 italic pl-2">Nenhum profissional disponível.</p>}
            </div>
          </section>

          {/* Concepção */}
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                <Baby className="h-6 w-6 text-rose-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Concepção</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {specialists.map((doc) => (
                <div key={doc.id} className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-50 group">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-rose-50 flex items-center justify-center overflow-hidden border-4 border-rose-50 shadow-sm group-hover:border-rose-100 transition-colors">
                      {doc.user.image ? <img src={doc.user.image} alt={doc.user.name || "Médico"} className="w-full h-full object-cover" /> : <User className="h-8 w-8 text-rose-400" />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-lg">{doc.user.name}</p>
                      <p className="text-sm text-rose-600 font-medium">Especialista em Reprodução</p>
                      <p className="text-xs text-slate-400 mt-2 bg-slate-50 px-3 py-1 rounded-full inline-block font-medium">CRM: {doc.crm || "N/A"}</p>
                    </div>
                  </div>
                </div>
              ))}
               {specialists.length === 0 && <p className="text-slate-500 italic pl-2">Nenhum profissional disponível.</p>}
            </div>
          </section>
        </div>

        {/* Coluna Lateral: Smart Insumos */}
        <aside className="space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-50 relative overflow-hidden">
            {/* Elemento decorativo de fundo */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#00a3e0]/5 rounded-bl-[4rem] -mr-8 -mt-8"></div>
            
            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="p-3 bg-[#00a3e0]/10 rounded-2xl">
                <Activity className="h-6 w-6 text-[#00a3e0]" />
              </div>
              <h3 className="font-bold text-xl text-slate-800">Smart Insumos</h3>
            </div>

            <div className="space-y-4 relative z-10">
              {(supplies.length > 0 ? supplies : [
                { id: 991, name: 'Ácido Fólico', quantity: 30, unit: 'caps', minQuantity: 10 },
                { id: 992, name: 'Vitaminas', quantity: 5, unit: 'caps', minQuantity: 10 }
              ]).map((item) => (
                 <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-[#00a3e0]/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl shadow-sm">
                        <Pill className="h-5 w-5 text-[#00a3e0]" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.quantity} {item.unit}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.quantity <= item.minQuantity ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    {item.quantity <= item.minQuantity ? 'Repor' : 'Em Estoque'}
                  </span>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-8 py-4 text-sm text-white font-bold bg-[#00a3e0] hover:bg-[#008bbd] rounded-2xl transition-colors shadow-md shadow-[#00a3e0]/20">
              Gerenciar Estoque
            </button>
          </div>
        </aside>

      </main>
    </div>
  );
}