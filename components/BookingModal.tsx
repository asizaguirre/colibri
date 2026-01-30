"use client";

import { useState, useTransition } from "react";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  X,
  Stethoscope,
  Sparkles
} from "lucide-react";
import { scheduleAppointment } from "@/actions";

type Professional = {
  id: string;
  user: {
    name: string | null;
    image: string | null;
  };
  specialty: string;
};

interface BookingModalProps {
  professionals: Professional[];
}

export function BookingModal({ professionals }: BookingModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedDoc, setSelectedDoc] = useState<Professional | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);

  // Mock de datas disponíveis (próximos 3 dias)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 3; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push(d);
    }
    return dates;
  };

  const timeSlots = ["09:00", "10:30", "14:00", "16:30"];

  async function handleConfirm(formData: FormData) {
    if (!selectedDoc || !selectedDate || !selectedTime) return;

    // Combina data e hora
    const dateTime = new Date(`${selectedDate}T${selectedTime}`);
    formData.set("professionalId", selectedDoc.id);
    formData.set("date", dateTime.toISOString());

    startTransition(async () => {
      const result = await scheduleAppointment(formData);
      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsOpen(false);
          resetFlow();
        }, 3000);
      } else {
        alert("Erro ao agendar. Tente novamente.");
      }
    });
  }

  const resetFlow = () => {
    setStep(1);
    setSelectedDoc(null);
    setSelectedDate("");
    setSelectedTime("");
    setIsSuccess(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-5 py-2.5 rounded-full font-bold transition-all shadow-sm hover:shadow-md active:scale-95"
      >
        <CalendarIcon className="w-4 h-4" />
        Agendar Consulta
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop com Blur */}
          <div 
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-md transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-sky-100 rounded-full text-sky-600">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-bold text-slate-700">Novo Agendamento</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto">
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-4 animate-in fade-in zoom-in duration-300">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
                    <Check className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800">Agendado!</h3>
                  <p className="text-slate-500 text-center">
                    Sua consulta foi confirmada com sucesso.<br/>Enviamos os detalhes para seu e-mail.
                  </p>
                </div>
              ) : (
                <>
                  {/* Progress Steps */}
                  <div className="flex items-center justify-between mb-8 px-2">
                    {[1, 2, 3].map((s) => (
                      <div key={s} className={`flex items-center gap-2 ${step >= s ? "text-sky-600" : "text-slate-300"}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 ${step >= s ? "border-sky-600 bg-sky-50" : "border-slate-200"}`}>
                          {s}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Step 1: Select Doctor */}
                  {step === 1 && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-bold text-slate-800 mb-4">Escolha o Especialista</h3>
                      {professionals.map((doc) => (
                        <button
                          key={doc.id}
                          onClick={() => { setSelectedDoc(doc); setStep(2); }}
                          className="w-full flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-sky-200 hover:bg-sky-50 transition-all group text-left"
                        >
                          <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                            {doc.user.image ? (
                              <img src={doc.user.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-full h-full p-2 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 group-hover:text-sky-700">{doc.user.name}</p>
                            <p className="text-xs text-slate-500">{doc.specialty}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-300 ml-auto group-hover:text-sky-400" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Step 2: Date & Time */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-bold text-slate-800">Data e Horário</h3>
                      
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {getAvailableDates().map((date) => {
                          const dateStr = date.toISOString().split('T')[0];
                          const isSelected = selectedDate === dateStr;
                          return (
                            <button
                              key={dateStr}
                              onClick={() => setSelectedDate(dateStr)}
                              className={`flex-shrink-0 w-24 p-3 rounded-2xl border transition-all text-center ${isSelected ? "border-sky-500 bg-sky-50 text-sky-700" : "border-slate-200 hover:border-sky-200"}`}
                            >
                              <p className="text-xs font-bold uppercase text-slate-400">{date.toLocaleDateString('pt-BR', { weekday: 'short' })}</p>
                              <p className="text-xl font-bold">{date.getDate()}</p>
                            </button>
                          );
                        })}
                      </div>

                      {selectedDate && (
                        <div className="grid grid-cols-2 gap-3 animate-in slide-in-from-top-2">
                          {timeSlots.map((time) => (
                            <button
                              key={time}
                              onClick={() => setSelectedTime(time)}
                              className={`p-3 rounded-xl border text-sm font-bold transition-all ${selectedTime === time ? "bg-indigo-50 border-indigo-500 text-indigo-700" : "border-slate-200 hover:border-indigo-200"}`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-3 mt-4">
                        <button onClick={() => setStep(1)} className="px-4 py-2 text-slate-500 hover:bg-slate-50 rounded-full font-medium">Voltar</button>
                        <button 
                          disabled={!selectedDate || !selectedTime}
                          onClick={() => setStep(3)}
                          className="flex-1 bg-sky-500 text-white py-2 rounded-full font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-sky-600 transition-colors"
                        >
                          Continuar
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Confirm */}
                  {step === 3 && (
                    <form action={handleConfirm} className="space-y-4">
                      <h3 className="text-lg font-bold text-slate-800">Confirmar Agendamento</h3>
                      
                      <div className="bg-slate-50 p-4 rounded-2xl space-y-2 border border-slate-100">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Stethoscope className="w-4 h-4 text-sky-500" />
                          <span className="font-bold">{selectedDoc?.user.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <CalendarIcon className="w-4 h-4 text-indigo-500" />
                          <span>{new Date(selectedDate).toLocaleDateString('pt-BR')} às {selectedTime}</span>
                        </div>
                      </div>

                      <div className="space-y-3 pt-2">
                        <input name="name" placeholder="Seu Nome Completo" required className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none transition-all" />
                        <input name="email" type="email" placeholder="Seu E-mail" required className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 outline-none transition-all" />
                      </div>

                      <div className="flex gap-3 mt-6">
                        <button type="button" onClick={() => setStep(2)} className="px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-full font-medium">Voltar</button>
                        <button 
                          type="submit" 
                          disabled={isPending}
                          className="flex-1 bg-indigo-600 text-white py-3 rounded-full font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                          {isPending ? "Confirmando..." : "Confirmar Agendamento"}
                        </button>
                      </div>
                    </form>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}