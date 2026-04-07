from fastapi import FastAPI, UploadFile, File, Form
from typing import Optional
from ocr_pipeline import process_receipt
from rag_engine import evaluate_expense_context
from pydantic import BaseModel

app = FastAPI(title="Expenz ML Service")

class OCRResponse(BaseModel):
    merchantName: str
    date: str
    totalAmount: float
    currency: str
    isMock: bool
    auditStatus: str
    reasoning: str
    policySnippet: str

@app.post("/extract", response_model=OCRResponse)
async def extract_receipt_data(
    file: UploadFile = File(...),
    claimedDate: str = Form(""),
    businessPurpose: str = Form("")
):
    """
    Ingests a receipt image bounding box extraction, and connects directly to the RAG policy Evaluation Engine.
    """
    contents = await file.read()
    extracted = process_receipt(contents)
    
    # Pass Data into standard RAG rules
    rag_evaluation = evaluate_expense_context(
        merchant_name=extracted["merchantName"],
        amount=extracted["totalAmount"],
        date=extracted["date"],
        user_claimed_date=claimedDate
    )
    
    return {
        "merchantName": extracted["merchantName"],
        "date": extracted["date"],
        "totalAmount": extracted["totalAmount"],
        "currency": extracted["currency"],
        "isMock": extracted["isMock"],
        "auditStatus": rag_evaluation["status"],
        "reasoning": rag_evaluation["reasoning"],
        "policySnippet": rag_evaluation["policySnippet"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
