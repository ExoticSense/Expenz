'use client';

import { useState } from 'react';
import ReceiptUpload from '@/components/ReceiptUpload';
import TrafficLightStatus from '@/components/TrafficLightStatus';
import { AuditStatus } from '@/lib/types';
import { ArrowRight, CheckCircle, ShieldCheck } from 'lucide-react';

export default function EmployeePortal() {
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'reviewing' | 'complete'>('idle');
  const [simulatedStatus, setSimulatedStatus] = useState<AuditStatus>('Pending');

  const handleUpload = (file: File) => {
    setUploadState('uploading');
    
    // Simulate upload and initial AI prescreen
    setTimeout(() => {
      setUploadState('reviewing');
      setTimeout(() => {
        setSimulatedStatus(Math.random() > 0.5 ? 'Approved' : 'Flagged');
        setUploadState('complete');
      }, 1500);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100/50 text-indigo-700 rounded-full text-sm font-semibold mb-4 border border-indigo-200">
             <ShieldCheck className="w-4 h-4" /> Policy-First Auditor
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Submit Expense</h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
            Upload your receipt. Our AI cross-references the details against corporate policy instantly.
          </p>
        </div>

        {/* Action Area */}
        <div className="bg-white p-6 sm:p-10 rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 max-w-2xl mx-auto transition-all">
          <ReceiptUpload onUpload={handleUpload} />
          
          {uploadState !== 'idle' && (
            <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col gap-4 fade-in">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 pl-1">Prescreen Status</h3>
              
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/60 shadow-sm transition-all duration-500">
                <div className="flex items-center gap-4">
                   <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100">
                      <ArrowRight className={`w-5 h-5 ${uploadState === 'complete' ? 'text-indigo-500' : 'text-slate-400 opacity-50'}`} />
                   </div>
                   <div>
                     <p className="font-bold text-slate-800 text-sm">
                       {uploadState === 'uploading' && 'Uploading document...'}
                       {uploadState === 'reviewing' && 'AI analyzing against policy...'}
                       {uploadState === 'complete' && 'Audit complete'}
                     </p>
                     <p className="text-[11px] font-medium tracking-wide text-slate-500 mt-0.5">REF: EXP-{Math.random().toString(36).substring(7).toUpperCase()}</p>
                   </div>
                </div>
                
                {uploadState === 'complete' ? (
                   <TrafficLightStatus status={simulatedStatus} />
                ) : (
                   <div className="flex h-3 w-3 mr-4">
                     <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-indigo-400 opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                   </div>
                )}
              </div>
              
              {uploadState === 'complete' && simulatedStatus === 'Approved' && (
                  <div className="mt-2 p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-sm font-semibold border border-emerald-100 flex items-start gap-3 shadow-sm shadow-emerald-100/50">
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      This expense matches standard operating limits and has been auto-approved. It will appear on your next payout cycle.
                    </p>
                  </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
