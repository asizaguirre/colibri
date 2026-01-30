import { Navbar } from "../components/Navbar";
import "./globals.css";

export const metadata = {
  title: "Colibri 2.0 | Rede de Acolhimento",
  description: "Jornada de saúde reprodutiva e acolhimento.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body className="bg-slate-50 text-slate-900 antialiased font-sans selection:bg-sky-100 selection:text-sky-700">
        <div className="flex min-h-screen">
          <Navbar />
          <main className="flex-1 lg:ml-72 w-full transition-all duration-300">
            <div className="p-4 lg:p-8 pt-20 lg:pt-8 max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}
