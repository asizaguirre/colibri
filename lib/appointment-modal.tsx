"use client";

import { useState } from "react";
import { createAppointment } from "../actions";
import { PlusCircle, X } from "lucide-react";

export function AppointmentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    await createAppointment(formData);
    setIsPending(false);
    setIsOpen(false);
    alert("Solicitação enviada! Entraremos em contato.");
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
      >
        <PlusCircle className="w-5 h-5" />
        Novo Agendamento
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md relative shadow-xl">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-xl font-bold text-gray-800 mb-4">Agendamento Rápido</h2>
            
            <form action={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <input name="name" required className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <input name="email" type="email" required className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Especialidade</label>
                <select name="category" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="Ginecologista">Ginecologista (Pré-Concepção)</option>
                  <option value="Especialista">Especialista em Reprodução</option>
                </select>
              </div>

              <button disabled={isPending} type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50">
                {isPending ? "Enviando..." : "Confirmar Solicitação"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}