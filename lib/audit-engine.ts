import { ExpenseClaim, AuditStatus } from './types';

export interface AuditResult {
  status: AuditStatus;
  reasoning: string;
  policySnippet: string;
}

/**
 * Placeholder logic for future Gemini / RAG integration.
 * Currently simulates cross-referencing extracted data against a policy document.
 */
export async function auditClaimAgainstPolicy(claim: ExpenseClaim): Promise<AuditResult> {
  // Simulate network or LLM processing delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Contextual check 1: Team building with only 1 meal item
  if (claim.category === 'Team Building' && claim.items.length <= 1) {
    return {
      status: 'Flagged',
      reasoning: 'Team Building expenses usually require multiple line items corresponding to multiple attendees. Only 1 item found.',
      policySnippet: 'Section 4.1: Team Building – "All team building expenses must detail the names of attendees and include receipts for multiple meals or activities when claimed collectively."',
    };
  }

  // Contextual check 2: Meal over $100 without explicit business purpose (simplified)
  if (claim.category === 'Meals' && claim.totalAmount > 100) {
    return {
      status: 'Flagged',
      reasoning: 'Meal expense exceeds the $100 threshold without prior approval documentation.',
      policySnippet: 'Section 2.3: Meals and Entertainment – "Individual meals exceeding $100 must have written pre-approval from a director-level supervisor."',
    };
  }

  // Implicit rule: Weekend expenses require justification
  const dateObj = new Date(claim.date);
  // Sunday = 0, Saturday = 6
  if (dateObj.getDay() === 0 || dateObj.getDay() === 6) {
    if (claim.category !== 'Transport') { // Allowing weekend transport just as an example
      return {
        status: 'Flagged',
        reasoning: 'Expense occurred on a weekend. Please verify if business was conducted.',
        policySnippet: 'Section 1.2: General Rules – "Weekend expenses are strictly audited and require a clear business justification to prevent out-of-policy personal spending."',
      };
    }
  }

  // Otherwise, default to Approved
  return {
    status: 'Approved',
    reasoning: 'Expense matches standard operating limits and appears well-documented within policy bounds.',
    policySnippet: 'General Policies: "Standard expenses under threshold and within logical bounds are auto-approved."',
  };
}
