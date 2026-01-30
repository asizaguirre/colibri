import { prisma } from "@/lib/prisma";
import { AppointmentModal } from "@/lib/appointment-modal";
import { 
  Heart, 
  Activity, 
  User, 
  Stethoscope, 
  Pill, 
  CheckCircle2,
  Calendar,
  ArrowRight
} from "lucide-react";

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
    take: 5
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Olá, Paciente
          </h1>
          <p className="text-slate-500 mt-1">
            Bem-vindo(a) de volta à sua jornada de cuidado.
          </p>
        </div>
        <div className="hidden md:block">
           <span className="px-4 py-2 bg-sky-50 text-sky-600 rounded-full text-sm font-bold border border-sky-100">
             Plano Premium
           </span>
        </div>
      </div>

      {/* Card Jornada do Cuidado */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:scale-[1.01] transition-transform duration-300 ease-out">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-indigo-50 rounded-full">
            <Heart className="w-6 h-6 text-indigo-500 fill-indigo-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Jornada do Cuidado</h2>
        </div>
        
        <div className="relative pt-2">
          <div className="flex mb-3 items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span className="text-sky-600">Pré-Concepção</span>
            <span className="text-sky-600">Tratamento</span>
            <span>Gestação</span>
          </div>
          <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-slate-100">
            <div style={{ width: "60%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full"></div>
          </div>
          <p className="text-sm text-slate-600">
            Você completou a fase de <span className="font-bold text-sky-600">Diagnóstico Inicial</span>. Próximo passo: Consulta com Especialista.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Grid de Especialistas */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-sky-500" />
              Rede de Especialistas
            </h2>
            <AppointmentModal />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {[...gynecologists, ...specialists].map((doc) => (
              <div key={doc.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 overflow-hidden flex-shrink-0 border border-slate-100">
                    {doc.user.image ? (
                      <img src={doc.user.image} alt={doc.user.name || "Médico"} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <User className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-800 truncate">{doc.user.name}</h3>
                    <p className="text-sm text-sky-600 font-medium mb-1 truncate">{doc.specialty}</p>
                    <p className="text-xs text-slate-400 bg-slate-50 inline-block px-2 py-0.5 rounded-md">CRM: {doc.crm}</p>
                  </div>
                </div>
                <button className="mt-5 w-full py-3 bg-slate-50 text-slate-600 font-bold text-sm rounded-full group-hover:bg-sky-500 group-hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
                  Agendar <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
            {[...gynecologists, ...specialists].length === 0 && (
               <div className="col-span-2 p-10 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                 <p className="text-slate-500">Nenhum especialista disponível no momento.</p>
               </div>
            )}
          </div>
        </div>

        {/* Painel Smart Insumos */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-500" />
            Smart Insumos
          </h2>
          
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:scale-[1.02] transition-all duration-300">
            <div className="space-y-2">
              {supplies.length > 0 ? supplies.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full transition-colors ${item.quantity > item.minQuantity ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100' : 'bg-rose-50 text-rose-600 group-hover:bg-rose-100'}`}>
                      <Pill className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">{item.name}</p>
                      <p className="text-xs text-slate-400">{item.quantity} {item.unit}</p>
                    </div>
                  </div>
                  {item.quantity > item.minQuantity ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-1 rounded-full border border-rose-100">Repor</span>
                  )}
                </div>
              )) : (
                <p className="text-sm text-slate-400 text-center py-4">Estoque vazio.</p>
              )}
            </div>
            
            <button className="w-full mt-6 py-3 border border-slate-200 text-slate-600 font-bold text-sm rounded-full hover:bg-slate-50 hover:text-slate-900 transition-colors">
              Gerenciar Estoque
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}