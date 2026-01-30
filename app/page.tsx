export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold text-blue-600">Colibri 2.0</h1>
      <p className="mt-4 text-xl">Rede de Acolhimento Inteligente - Life Clinic</p>
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="p-6 border rounded-lg">Agendamento Online</div>
        <div className="p-6 border rounded-lg">Prontuário Digital</div>
        <div className="p-6 border rounded-lg">Smart Insumos</div>
      </div>
    </main>
  );
}
