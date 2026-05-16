import Link from "next/link";
import { ArrowRight, Hexagon } from "lucide-react";
import { Zen_Dots } from "next/font/google";

const zenDots = Zen_Dots({ weight: "400", subsets: ["latin"] });

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 selection:bg-blue-100">
      <div className="max-w-2xl w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-blue-600 rounded-3xl shadow-xl shadow-blue-600/20 rotate-3 hover:rotate-0 transition-transform duration-500">
            <Hexagon className="w-16 h-16 text-white" strokeWidth={1.5} />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className={`text-6xl md:text-8xl tracking-tight text-slate-900 ${zenDots.className}`}>
            Achacho
          </h1>
          <p className="text-sm md:text-base font-bold text-slate-400 tracking-[0.3em] uppercase">
            powered by saa vee zoo
          </p>
        </div>

        <p className="text-slate-600 max-w-lg mx-auto leading-relaxed text-lg pt-4">
          Welcome to the next generation of Enterprise Management. Let's tailor this workspace specifically for your business needs.
        </p>

        <div className="pt-10">
          <Link 
            href="/setup" 
            className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-600/20"
          >
            Configure Your Workspace <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
        
      </div>
    </div>
  );
}
