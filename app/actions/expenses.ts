'use server'

import prisma from '@/lib/prisma'

export async function submitExpenseClaim(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    const businessPurpose = formData.get('businessPurpose') as string;
    const claimedDate = formData.get('claimedDate') as string;

    if (!file || file.size === 0) {
      return { success: false, error: "Invalid file provided." }
    }

    // Forward payload to ML Python Backend
    const mlFormData = new FormData();
    mlFormData.append('file', file);
    mlFormData.append('claimedDate', claimedDate);
    mlFormData.append('businessPurpose', businessPurpose);
    
    // Connect to local FastAPI RAG Pipeline
    const mlResponse = await fetch('http://127.0.0.1:8000/extract', {
      method: 'POST',
      body: mlFormData
    });

    if (!mlResponse.ok) {
       console.error("FastAPI Connection Error");
       return { success: false, error: "Failed to connect to ML Extraction Service. Ensure uvicorn is running on port 8000." }
    }

    const mlData = await mlResponse.json();

    // The backend now fully structures the auditStatus and Reasoning via the Gemini RAG wrapper.
    // We seamlessly pump the results into the persistent SQLite mapping.

    const expense = await prisma.expense.create({
      data: {
        merchantName: mlData.merchantName,
        date: new Date(mlData.date + 'T00:00:00Z'),
        totalAmount: mlData.totalAmount,
        currency: mlData.currency,
        businessPurpose: businessPurpose,
        category: "Pending Verify", // Handled manually by RAG logic above
        auditStatus: mlData.auditStatus,
        reasoning: mlData.reasoning,
        policySnippet: mlData.policySnippet,
      }
    });

    return { 
      success: true, 
      data: expense,
      isMock: mlData.isMock 
    };

  } catch (error: any) {
    console.error("Submission DB/Fetch error:", error);
    return { success: false, error: "An unexpected network or database error occurred during submission." }
  }
}

// Fetch live Queue Data for Dashboard
export async function getExpenses() {
   try {
      const expenses = await prisma.expense.findMany({
         orderBy: { createdAt: 'desc' }
      });
      return { success: true, data: expenses };
   } catch(e) {
      return { success: false, error: "Failed to fetch DB stream." };
   }
}
