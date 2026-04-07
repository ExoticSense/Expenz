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

    // Forward image to the local FastAPI ML Service
    const mlFormData = new FormData();
    mlFormData.append('file', file);
    
    // Using 127.0.0.1 for the local Python Service bridging
    const mlResponse = await fetch('http://127.0.0.1:8000/extract', {
      method: 'POST',
      body: mlFormData
    });

    if (!mlResponse.ok) {
       console.error("FastAPI Connection Error");
       return { success: false, error: "Failed to connect to ML Extraction Service. Is uvicorn running on port 8000?" }
    }

    const mlData = await mlResponse.json();

    // Instant MVP Date Validation bridging
    let auditStatus = "Approved";
    let reasoning = "Extracted data aligns with standard bounds.";
    
    // If the mock ML service kicks back "2024-03-15", but user put something else
    if (mlData.date !== claimedDate) {
       auditStatus = "Flagged";
       reasoning = `Date mismatch. User claimed ${claimedDate}, but AI receipt OCR extracted ${mlData.date}.`;
    }

    // Insert to SQLite Database via Prisma
    const expense = await prisma.expense.create({
      data: {
        merchantName: mlData.merchantName,
        date: new Date(mlData.date + 'T00:00:00Z'),
        totalAmount: mlData.totalAmount,
        currency: mlData.currency,
        businessPurpose: businessPurpose,
        category: "Pending Verification", 
        auditStatus: auditStatus,
        reasoning: reasoning,
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
