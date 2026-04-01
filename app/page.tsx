import Link from 'next/link';
import { ArrowRight, Wallet, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-8 font-sans selection:bg-indigo-500/30">
      <div className="max-w-4xl text-center space-y-8 mb-20 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 text-indigo-300 rounded-full text-sm font-bold tracking-wide uppercase mb-2 border border-indigo-500/20 backdrop-blur-sm">
          <ShieldCheck className="w-4 h-4" /> v1.0 Expense Framework
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter leading-[1.1]">
          Stop Spend Leakage <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">At The Source</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
          A highly-contextual AI policy engine that checks expenses before they affect your bottom line.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl relative z-10">
         <Link href="/employee" className="group p-8 rounded-[2rem] bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all duration-300 relative overflow-hidden backdrop-blur-md shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="p-3.5 bg-indigo-500/10 text-indigo-400 rounded-2xl w-fit mb-8 border border-indigo-500/20 shadow-inner group-hover:scale-110 transition-transform duration-300">
               <Wallet className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3 tracking-wide">Employee Portal</h2>
            <p className="text-slate-400 mb-8 text-sm leading-relaxed font-medium">Frictionless receipt upload with instant frontend audit feedback and prescreening.</p>
            <span className="text-indigo-400 font-bold text-sm tracking-wide flex items-center gap-2 group-hover:gap-3 transition-all">
              Launch Portal <ArrowRight className="w-4 h-4" />
            </span>
         </Link>

         <Link href="/finance" className="group p-8 rounded-[2rem] bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/80 transition-all duration-300 relative overflow-hidden backdrop-blur-md shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="p-3.5 bg-cyan-500/10 text-cyan-400 rounded-2xl w-fit mb-8 border border-cyan-500/20 shadow-inner group-hover:scale-110 transition-transform duration-300">
               <ShieldCheck className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3 tracking-wide">Audit Console</h2>
            <p className="text-slate-400 mb-8 text-sm leading-relaxed font-medium">Dashboard for complex discrepancy resolution and AI policy tracing view.</p>
            <span className="text-cyan-400 font-bold text-sm tracking-wide flex items-center gap-2 group-hover:gap-3 transition-all">
              Open Console <ArrowRight className="w-4 h-4" />
            </span>
         </Link>
      </div>
      
      {/* Background decoration */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[1000px] h-[600px] md:h-[1000px] bg-gradient-to-br from-indigo-500/10 via-cyan-500/5 to-transparent blur-[120px] rounded-full pointer-events-none -z-10"></div>
    </div>
  );
}
