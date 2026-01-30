import { prisma } from "../../lib/prisma";
import { Heart, Baby, Pill, Stethoscope, Activity, User } from "lucide-react";

export default async function DashboardPage() {
  // Buscando dados reais do banco de dados
  const gynecologists = await prisma.professional.findMany({
    where: { specialty: 'GYNECOLOGIST' },
    include: { user: true },
  });

  const specialists = await prisma.professional.findMany({
    where: { specialty: 'REPRODUCTION_SPECIALIST' },
    include: { user: true },
  });

  const supplies = await prisma.supply.findMany({
    orderBy: { quantity: 'asc' },
  });

  return (
    <div className="min-h-screen bg-rose-50/30">
      {/* Header */}
      <header className="bg-white border-b border-rose-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3">
          <div className="p-2 bg-rose-100 rounded-lg">
            <Heart className="h-6 w-6 text-rose-500" />
          </div>
          <h1 className="text-xl font-semibold text-gray-800">
            Colibri 2.0 <span className="text-gray-400 font-normal">| Rede de Acolhimento</span>
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* Seção 1: Pré-Concepção (Ginecologistas) */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Stethoscope className="h-5 w-5 text-teal-600" />
            <h2 className="text-lg font-bold text-gray-800">Pré-Concepção: Ginecologia</h2>
          </div>
          
          {gynecologists.length === 0 ? (
            <p className="text-gray-500 text-sm italic">Nenhum ginecologista disponível no momento.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gynecologists.map((pro) => (
                <div key={pro.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-teal-50 flex items-center justify-center border border-teal-100">
                      {pro.user.image ? (
                        <img src={pro.user.image} alt={pro.user.name || "Médico"} className="h-12 w-12 rounded-full object-cover" />
                      ) : (
                        <User className="h-6 w-6 text-teal-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{pro.user.name || "Dr(a)."}</h3>
                      <p className="text-sm text-teal-600 font-medium">CRM: {pro.crm || "N/A"}</p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{pro.bio || "Sem descrição."}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Seção 2: Concepção (Especialistas) */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Baby className="h-5 w-5 text-rose-500" />
            <h2 className="text-lg font-bold text-gray-800">Concepção: Reprodução Assistida</h2>
          </div>

          {specialists.length === 0 ? (
            <p className="text-gray-500 text-sm italic">Nenhum especialista disponível no momento.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {specialists.map((pro) => (
                <div key={pro.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-rose-50 flex items-center justify-center border border-rose-100">
                      {pro.user.image ? (
                        <img src={pro.user.image} alt={pro.user.name || "Médico"} className="h-12 w-12 rounded-full object-cover" />
                      ) : (
                        <User className="h-6 w-6 text-rose-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{pro.user.name || "Dr(a)."}</h3>
                      <p className="text-sm text-rose-500 font-medium">CRM: {pro.crm || "N/A"}</p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{pro.bio || "Sem descrição."}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Seção 3: Smart Insumos */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-indigo-500" />
            <h2 className="text-lg font-bold text-gray-800">Smart Insumos</h2>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
              {supplies.map((item) => (
                <div key={item.id} className="p-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{item.name}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{item.quantity} <span className="text-xs font-normal text-gray-400">{item.unit}</span></p>
                  </div>
                  <div className={`p-2 rounded-full ${item.quantity <= item.minQuantity ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                    <Pill className="h-5 w-5" />
                  </div>
                </div>
              ))}
              {supplies.length === 0 && <div className="p-5 text-gray-500 text-sm">Estoque vazio.</div>}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}