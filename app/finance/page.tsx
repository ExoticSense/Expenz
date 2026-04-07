'use client';

import { useState, useEffect } from 'react';
import AuditDetailView from '@/components/AuditDetailView';
import { ExpenseClaim } from '@/lib/types';
import { getExpenses } from '@/app/actions/expenses';
import { Search, Filter, ShieldAlert, RefreshCw } from 'lucide-react';

export default function FinanceDashboard() {
  const [claims, setClaims] = useState<ExpenseClaim[]>([]);
  const [activeClaim, setActiveClaim] = useState<ExpenseClaim | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchClaims = async () => {
     setLoading(true);
     const res = await getExpenses();
     if (res.success && res.data) {
        // Map Prisma DB response back to our Frontend Type expectations.
        const mappedData: ExpenseClaim[] = res.data.map((item: any) => ({
           id: item.id,
           merchantName: item.merchantName,
           date: item.date.toISOString(),
           totalAmount: item.totalAmount,
           currency: item.currency,
           businessPurpose: item.businessPurpose,
           category: item.category,
           auditStatus: item.auditStatus,
           items: [], // Detail items not scaffolded in MVP DB currently.
           reasoning: item.reasoning,
           policySnippet: item.policySnippet
        }));
        
        setClaims(mappedData);
        if (mappedData.length > 0 && !activeClaim) {
           setActiveClaim(mappedData[0]);
        }
     }
     setLoading(false);
  };

  useEffect(() => {
    fetchClaims();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
       {/* Dashboard Header */}
       <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm shadow-slate-100/50">
          <div className="flex items-center gap-4">
             <div className="bg-rose-50 border border-rose-100 text-rose-600 p-2.5 rounded-xl shadow-sm">
               <ShieldAlert className="w-5 h-5" />
             </div>
             <div>
               <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">Finance Auditor</h1>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Policy Engine v1.0</p>
             </div>
          </div>
          
          <div className="flex gap-4">
              <button onClick={fetchClaims} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors" title="Refresh Live Data">
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <div className="relative group hidden sm:block">
                 <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -mt-2 group-focus-within:text-indigo-500 transition-colors" />
                 <input type="text" placeholder="Search claims..." className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none w-64 transition-all" />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm">
                <Filter className="w-4 h-4 opacity-70" /> Filter
              </button>
          </div>
       </div>

       {/* Dashboard Body */}
       <div className="flex-1 flex overflow-hidden">
          {/* Sidebar Queues */}
          <div className="w-80 bg-white border-r border-slate-200 overflow-y-auto flex-shrink-0 flex flex-col">
             <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 z-10 flex justify-between items-center">
               <div>
                  <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Global Queue</h2>
                  <p className="text-xs font-medium text-slate-400 mt-1">{claims.length} total claims</p>
               </div>
             </div>
             <div className="p-4 space-y-3 flex-1 overflow-y-auto">
                {claims.length === 0 && !loading && (
                   <div className="text-center p-8 text-sm text-slate-500">No active claims found in SQLite.</div>
                )}
                {claims.map((claim) => (
                   <button 
                     key={claim.id}
                     onClick={() => setActiveClaim(claim)}
                     className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 group ${
                       activeClaim?.id === claim.id 
                         ? 'bg-indigo-50 border-indigo-200 shadow-sm shadow-indigo-100/50 scale-[1.02]' 
                         : 'bg-white border-slate-100 hover:border-slate-300 hover:shadow-sm'
                     }`}
                   >
                     <div className="flex justify-between items-start mb-2.5">
                        <span className={`font-bold tracking-tight text-xs ${activeClaim?.id === claim.id ? 'text-indigo-900' : 'text-slate-800'}`}>{claim.id.slice(-6).toUpperCase()}</span>
                        {claim.auditStatus === 'Flagged' && (
                           <span className="text-[10px] font-bold bg-amber-100/80 text-amber-700 px-2.5 py-0.5 rounded-full border border-amber-200/50 uppercase">FLAGGED</span>
                        )}
                        {claim.auditStatus === 'Rejected' && (
                           <span className="text-[10px] font-bold bg-rose-100/80 text-rose-700 px-2.5 py-0.5 rounded-full border border-rose-200/50 uppercase">REJECTED</span>
                        )}
                        {claim.auditStatus === 'Approved' && (
                           <span className="text-[10px] font-bold bg-emerald-100/80 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200/50 uppercase">APPROVED</span>
                        )}
                        
                     </div>
                     <p className={`text-sm font-semibold truncate ${activeClaim?.id === claim.id ? 'text-indigo-800' : 'text-slate-600'}`}>{claim.merchantName}</p>
                     <p className={`text-xs font-medium mt-1.5 ${activeClaim?.id === claim.id ? 'text-indigo-600/70' : 'text-slate-400'}`}>{claim.currency} {claim.totalAmount.toFixed(2)}</p>
                   </button>
                ))}
             </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-[#f8fafc]">
             <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                   <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Trace Investigation</h2>
                   {activeClaim && (
                       <div className="flex gap-3">
                          <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-all shadow-sm">
                            Reject
                          </button>
                          <button className="px-6 py-2.5 bg-slate-900 border border-transparent rounded-xl text-sm font-bold text-white hover:bg-slate-800 transition-all shadow-md shadow-slate-900/20 active:scale-95">
                            Override Policy
                          </button>
                       </div>
                   )}
                </div>

                {loading ? (
                   <div className="animate-pulse bg-white border border-slate-100 shadow-sm h-[500px] rounded-3xl w-full flex items-center justify-center">
                      <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
                   </div>
                ) : !activeClaim ? (
                   <div className="bg-white border border-slate-100 shadow-sm h-[400px] rounded-3xl w-full flex flex-col items-center justify-center text-slate-400">
                      <ShieldAlert className="w-12 h-12 mb-4 opacity-50" />
                      <p className="font-semibold">No claims in your queue</p>
                   </div>
                ) : (
                   <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <AuditDetailView claim={activeClaim} auditResult={{
                        status: activeClaim.auditStatus,
                        reasoning: activeClaim.reasoning || "Reasoning generated locally.",
                        policySnippet: activeClaim.policySnippet || "Section X.X: Loaded via legacy mock map."
                     }} />
                   </div>
                )}
             </div>
          </div>
       </div>
    </div>
  );
}
