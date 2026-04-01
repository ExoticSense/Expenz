export type AuditStatus = 'Approved' | 'Flagged' | 'Rejected' | 'Pending';

export interface ExpenseItem {
  description: string;
  amount: number;
}

export interface ExpenseClaim {
  id: string;
  merchantName: string;
  date: string; // ISO date format
  totalAmount: number;
  currency: string;
  businessPurpose: string;
  category: string; // e.g., 'Transport', 'Meals', 'Team Building'
  auditStatus: AuditStatus;
  items: ExpenseItem[];
}
