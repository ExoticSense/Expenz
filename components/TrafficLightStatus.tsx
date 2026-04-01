import { CheckCircle2, AlertCircle, XCircle, Clock } from 'lucide-react';
import { AuditStatus } from '@/lib/types';

interface TrafficLightStatusProps {
  status: AuditStatus;
  className?: string; // allow overrides
}

export default function TrafficLightStatus({ status, className = '' }: TrafficLightStatusProps) {
  switch (status) {
    case 'Approved':
      return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-emerald-50 text-emerald-600 border border-emerald-500/20 ${className}`}>
          <CheckCircle2 className="w-4 h-4" />
          Approved
        </span>
      );
    case 'Flagged':
      return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-amber-50 text-amber-600 border border-amber-500/20 ${className}`}>
          <AlertCircle className="w-4 h-4" />
          Flagged
        </span>
      );
    case 'Rejected':
      return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-rose-50 text-rose-600 border border-rose-500/20 ${className}`}>
          <XCircle className="w-4 h-4" />
          Rejected
        </span>
      );
    case 'Pending':
      return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-slate-50 text-slate-600 border border-slate-500/20 ${className}`}>
          <Clock className="w-4 h-4" />
          Pending
        </span>
      );
    default:
      return null;
  }
}
