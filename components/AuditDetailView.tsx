import { ExpenseClaim } from '@/lib/types';
import TrafficLightStatus from './TrafficLightStatus';
import { AuditResult } from '@/lib/audit-engine';
import { FileSearch, Calculator, Scale} from 'lucide-react';

interface AuditDetailViewProps {
  claim: ExpenseClaim;
  auditResult: AuditResult;
}

export default function AuditDetailView({ claim, auditResult }: AuditDetailViewProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col md:flex-row transition-all hover:shadow-md">
      {/* Visual / Image Section Mockup */}
      <div className="w-full md:w-1/3 bg-slate-50/50 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-200">
        <div className="w-full aspect-[3/4] bg-white rounded-2xl shadow-sm flex items-center justify-center relative border border-slate-200 overflow-hidden group">
             {/* Abstract Mock Receipt UI */}
             <div className="absolute inset-x-6 inset-y-8 border border-slate-100 rounded-xl bg-slate-50 flex flex-col p-5 opacity-40 transition-opacity group-hover:opacity-60">
               <div className="h-5 w-2/3 bg-slate-300 rounded mb-6"></div>
               <div className="h-3 w-1/2 bg-slate-200 rounded mb-3"></div>
               <div className="h-3 w-3/4 bg-slate-200 rounded mb-3"></div>
               <div className="h-3 w-full bg-slate-200 rounded mb-3"></div>
               <div className="h-4 w-1/3 bg-slate-200 rounded mt-4"></div>
               
               <div className="mt-auto h-5 w-1/3 bg-indigo-200 rounded self-end"></div>
             </div>
             
             <div className="flex flex-col items-center z-10 opacity-75 group-hover:scale-105 transition-transform duration-300">
                 <FileSearch className="w-12 h-12 text-slate-400 mb-3 drop-shadow-sm" />
                 <span className="text-sm font-semibold tracking-wide text-slate-500 uppercase">Input Document</span>
             </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="w-full md:w-2/3 p-8 flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{claim.merchantName}</h2>
            <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
              <span>{new Date(claim.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{claim.category}</span>
            </p>
          </div>
          <TrafficLightStatus status={auditResult.status} className="shadow-sm" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 flex-1">
            {/* Extracted Data (OCR Simulation) */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2.5 text-indigo-600 mb-1">
                <div className="p-1.5 bg-indigo-50 rounded-lg">
                  <Calculator className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-sm tracking-wide uppercase text-slate-700">Extraction Results</h3>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm shadow-slate-100/50 text-sm space-y-4 flex-1">
                 <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Total Amount</span>
                    <span className="text-lg font-bold text-slate-900">{claim.currency} {claim.totalAmount.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between items-start gap-4 pb-3 border-b border-slate-100">
                    <span className="text-slate-500 font-medium whitespace-nowrap">Business Purpose</span>
                    <span className="font-semibold text-slate-800 text-right">{claim.businessPurpose}</span>
                 </div>
                 {claim.items.length > 0 && (
                     <div className="pt-2">
                        <span className="text-[11px] font-bold text-slate-400 block mb-3 uppercase tracking-wider">Detected Line Items</span>
                        <div className="space-y-2">
                           {claim.items.map((item, idx) => (
                             <div key={idx} className="flex justify-between items-center text-xs p-2 rounded-md bg-slate-50 border border-slate-100">
                                <span className="font-medium text-slate-700">{item.description}</span>
                                <span className="font-semibold text-slate-900">{item.amount.toFixed(2)}</span>
                             </div>
                           ))}
                        </div>
                     </div>
                 )}
              </div>
            </div>

            {/* Policy Context Engine */}
            <div className="flex flex-col gap-4">
               <div className="flex items-center gap-2.5 text-indigo-600 mb-1">
                <div className="p-1.5 bg-indigo-50 rounded-lg">
                  <Scale className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-sm tracking-wide uppercase text-slate-700">Audit Reasoning</h3>
              </div>
              <div className={`rounded-2xl p-5 border shadow-sm flex flex-col gap-4 flex-1 transition-colors ${
                auditResult.status === 'Approved' ? 'bg-emerald-50/30 border-emerald-100 shadow-emerald-100/20' : 
                auditResult.status === 'Flagged' ? 'bg-amber-50/30 border-amber-100 shadow-amber-100/20' : 
                'bg-rose-50/30 border-rose-100 shadow-rose-100/20'
              }`}>
                 <div className="space-y-2">
                   <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">AI Analysis</span>
                   <p className="text-slate-800 leading-relaxed font-medium text-sm">
                     {auditResult.reasoning}
                   </p>
                 </div>
                 <div className="pt-4 border-t border-slate-200 mt-auto">
                   <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
                       <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                       <span className="text-[10px] font-bold text-indigo-500 block mb-1.5 uppercase tracking-widest">Matched Policy Source</span>
                       <p className="text-xs text-slate-600 italic leading-relaxed">
                         "{auditResult.policySnippet}"
                       </p>
                   </div>
                 </div>
              </div>
            </div>
        </div>

      </div>
    </div>
  );
}
