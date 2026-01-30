import { getDashboardData } from "../actions";
import { AppointmentModal } from "@/lib/appointment-modal";
import { 
  Heart, 
  Activity, 
  User, 
  Stethoscope, 
  Pill, 
  CheckCircle2,
  ArrowRight,
  ShieldAlert
} from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-md bg-white rounded-[2rem] shadow-xl shadow-blue-500/5 p-8 text-center space-y-6 border border-slate-100">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8 text-rose-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Acesso Restrito</h1>
            <p className="text-slate-500 mt-2">Faça login para acessar sua jornada de cuidado.</p>
          </div>
          <Link 
            href="/" 
            className="block w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
          >
            Ir para Login
          </Link>
        </div>
      </div>
    );
  }

  const { gynecologists, specialists, supplies } = await getDashboardData();

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10 space-y-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-sky-100 rounded-xl">
              <Heart className="w-5 h-5 text-sky-600 fill-sky-600" />
            </div>
            <span className="text-sm font-bold text-sky-600 tracking-wide uppercase">Life Clinic</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
            Olá, {session.user?.name?.split(' ')[0]}
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            Sua saúde está em dia. Vamos cuidar de você hoje?
          </p>
        </div>
        <div className="flex items-center gap-4">
           <div className="hidden md:flex flex-col items-end">
             <span className="text-sm font-bold text-slate-700">{session.user?.name}</span>
             <span className="text-xs text-sky-500 font-medium">Paciente Premium</span>
           </div>
           <div className="w-12 h-12 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
             {session.user?.image ? (
               <img src={session.user.image} alt="Avatar" className="w-full h-full object-cover" />
             ) : (
               <div className="w-full h-full flex items-center justify-center text-slate-400"><User /></div>
             )}
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Rede de Acolhimento (Médicos) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <div className="p-2 bg-white rounded-xl shadow-sm"><Stethoscope className="w-6 h-6 text-sky-500" /></div>
              Rede de Acolhimento
            </h2>
            <AppointmentModal />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {[...gynecologists, ...specialists].map((doc) => (
              <div key={doc.id} className="bg-white p-6 rounded-[2rem] shadow-xl shadow-blue-500/5 border border-slate-100 hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 rounded-2xl bg-slate-50 overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
                    {doc.user.image ? (
                      <img src={doc.user.image} alt={doc.user.name || "Médico"} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300"><User className="w-8 h-8" /></div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-lg text-slate-800 truncate">{doc.user.name}</h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold mt-1 ${
                      doc.specialty === 'Ginecologista' ? 'bg-pink-50 text-pink-600' : 'bg-indigo-50 text-indigo-600'
                    }`}>
                      {doc.specialty}
                    </span>
                  </div>
                </div>
                <button className="mt-6 w-full py-4 bg-slate-50 text-slate-600 font-bold text-sm rounded-2xl group-hover:bg-slate-900 group-hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
                  Agendar <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Smart Insumos */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl shadow-sm"><Activity className="w-6 h-6 text-indigo-500" /></div>
            Smart Insumos
          </h2>
          
          <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-blue-500/5 border border-slate-100">
            <div className="space-y-4">
              {supplies.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${
                      item.quantity > item.minQuantity ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      <Pill className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">{item.name}</p>
                      <p className="text-xs text-slate-400">{item.quantity} {item.unit}</p>
                    </div>
                  </div>
                  {item.quantity > item.minQuantity ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">Atenção</span>
                  )}
                </div>
              ))}
            </div>
            
            <button className="w-full mt-6 py-4 border-2 border-slate-100 text-slate-600 font-bold text-sm rounded-2xl hover:border-slate-200 hover:bg-slate-50 transition-all">
              Gerenciar Estoque
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}