from fastapi import FastAPI, UploadFile, File
from ocr_pipeline import process_receipt
from pydantic import BaseModel

app = FastAPI(title="Expenz ML Service")

class OCRResponse(BaseModel):
    merchantName: str
    date: str
    totalAmount: float
    currency: str
    isMock: bool

@app.post("/extract", response_model=OCRResponse)
async def extract_receipt_data(file: UploadFile = File(...)):
    """
    Ingests a receipt image and extracts crucial metadata using Tesseract and LayoutLM.
    If OCR backend fails, it defaults to a mock transaction for testing.
    """
    contents = await file.read()
    result = process_receipt(contents)
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
