'use client';

import { useState } from 'react';
import ReceiptUpload from '@/components/ReceiptUpload';
import TrafficLightStatus from '@/components/TrafficLightStatus';
import { AuditStatus } from '@/lib/types';
import { ArrowRight, CheckCircle, ShieldCheck, AlertTriangle } from 'lucide-react';
import { submitExpenseClaim } from '@/app/actions/expenses';

export default function EmployeePortal() {
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'validating' | 'reviewing' | 'complete'>('idle');
  const [simulatedStatus, setSimulatedStatus] = useState<AuditStatus>('Pending');
  const [instantErrorMessage, setInstantErrorMessage] = useState<string | null>(null);

  // Form State
  const [businessPurpose, setBusinessPurpose] = useState('');
  const [claimedDate, setClaimedDate] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !businessPurpose || !claimedDate) return;

    setUploadState('uploading');
    setInstantErrorMessage(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('businessPurpose', businessPurpose);
    formData.append('claimedDate', claimedDate);

    setUploadState('validating');
    
    // Server Execution bridging to Python 
    const res = await submitExpenseClaim(formData);
    
    setUploadState('reviewing');
    
    if (!res.success) {
        setSimulatedStatus('Rejected');
        setInstantErrorMessage(res.error || "A connection error occurred.");
        setUploadState('complete');
        return;
    }

    // Pass data directly from Database object
    setSimulatedStatus(res.data.auditStatus as AuditStatus);
    if (res.data.auditStatus === 'Flagged') {
        setInstantErrorMessage(res.data.reasoning);
    }
    
    setUploadState('complete');
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
            Fill in the details below. Our AI cross-references the receipt against corporate policy instantly.
          </p>
        </div>

        {/* Action Area */}
        <div className="bg-white p-6 sm:p-10 rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 max-w-2xl mx-auto transition-all">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Business Purpose */}
            <div className="space-y-2">
              <label htmlFor="businessPurpose" className="block text-sm font-semibold text-slate-700">Business Purpose</label>
              <textarea 
                id="businessPurpose"
                required
                maxLength={250}
                value={businessPurpose}
                onChange={(e) => setBusinessPurpose(e.target.value)}
                placeholder="e.g. Client Lunch with Acme Corp regarding Q3 contract."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm resize-none h-24"
              />
              <p className="text-xs text-slate-400 text-right">{businessPurpose.length}/250</p>
            </div>

            {/* Claimed Date */}
            <div className="space-y-2">
              <label htmlFor="claimedDate" className="block text-sm font-semibold text-slate-700">Receipt Date</label>
              <input 
                type="date"
                id="claimedDate"
                required
                value={claimedDate}
                onChange={(e) => setClaimedDate(e.target.value)}
                className="w-full sm:w-1/2 px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm"
              />
              <p className="text-[11px] text-indigo-500 font-medium">To pass instant validation for MVP testing, use <strong>03/15/2024</strong> (March 15, 2024).</p>
            </div>

            {/* File Upload Component */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <label className="block text-sm font-semibold text-slate-700 mb-4">Attach Receipt</label>
              <ReceiptUpload onUpload={(file) => setSelectedFile(file)} />
            </div>

            <button 
              type="submit" 
              disabled={!selectedFile || uploadState !== 'idle'}
              className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              Submit Claim for Audit
            </button>
          </form>
          
          {uploadState !== 'idle' && (
            <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col gap-4 fade-in">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 pl-1">Audit Trace Activity</h3>
                {uploadState === 'complete' && (
                   <button onClick={() => setUploadState('idle')} className="text-xs text-indigo-600 font-medium hover:underline">Reset Form</button>
                )}
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/60 shadow-sm transition-all duration-500">
                <div className="flex items-center gap-4">
                   <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100">
                      <ArrowRight className={`w-5 h-5 ${uploadState === 'complete' ? 'text-indigo-500' : 'text-slate-400 opacity-50'}`} />
                   </div>
                   <div>
                     <p className="font-bold text-slate-800 text-sm">
                       {uploadState === 'uploading' && 'Ingesting document locally...'}
                       {uploadState === 'validating' && 'Routing to Python FastAPI...'}
                       {uploadState === 'reviewing' && 'Injecting to SQLite Database...'}
                       {uploadState === 'complete' && 'Evaluation complete'}
                     </p>
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
              
              {uploadState === 'complete' && instantErrorMessage && (
                  <div className="mt-2 p-4 bg-amber-50 text-amber-800 rounded-2xl text-sm font-semibold border border-amber-200 flex items-start gap-3 shadow-sm shadow-amber-100/50">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      {instantErrorMessage}
                    </p>
                  </div>
              )}

              {uploadState === 'complete' && simulatedStatus === 'Approved' && !instantErrorMessage && (
                  <div className="mt-2 p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-sm font-semibold border border-emerald-100 flex items-start gap-3 shadow-sm shadow-emerald-100/50">
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      This expense matches standard operating limits and the extracted ML data routes successfully. Automatically recorded into the SQLite Database.
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
