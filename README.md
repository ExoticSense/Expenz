# Expenz: Policy-First Generative Expense Auditor

## The Problem
For Finance and Operations teams, auditing hundreds of corporate receipts manually against complex, multi-page travel and expense policies creates operational drag. This manual system leads to pervasive "Spend Leakage" where out-of-policy claims (like anomalous weekend expensing or exceeding regional meal thresholds) slip through the cracks due to auditor fatigue and 3-week verification delays.

## The Solution
Expenz eliminates manual verification delays by acting as an autonomous, policy-first AI Auditor. By combining visual Optical Character Recognition (OCR) with deep Generative AI Retrieval-Augmented Generation (RAG), the system ingests receipts at the employee portal, extracts metadata instantly, and cross-references the data against the entire 40-page corporate policy manual. It catches policy violations instantly, automatically flags specific guideline breaches for the Finance dashboard, and completely automates the approval of matching claims in under 30 seconds.

## Tech Stack
*   **Frontend**: Next.js 16 (App Router), React, Tailwind CSS, TypeScript
*   **Backend Subsystem**: Python, FastAPI, Uvicorn
*   **Database & ORM**: Prisma ORM, SQLite (Production Ready for PostgreSQL)
*   **AI & Machine Learning Integration**: 
    *   `PyTesseract` & Hugging Face `LayoutLM` (OCR Data Extraction)
    *   `google-generativeai` (Gemini 1.5 Pro) & `ChromaDB` (RAG Policy Verification)

## Setup Instructions

### 1. Database & Frontend Setup (Node.js Environment)
First, install the Next.js dependencies and generate the Prisma local SQLite database.
```bash
# Install NPM dependencies
npm install

# Initialize Prisma SQLite schema 
npx prisma generate
npx prisma db push

# Run the Next.js Development Server
npm run dev
```
*The frontend portal will now be live at `http://localhost:3000`.*

### 2. Python ML Backend Setup (Python Environment)
In a secondary terminal window, initialize the FastAPI machine-learning pipeline.
```bash
# Navigate to the backend directory
cd backend

# Install Python ML dependencies
pip install -r requirements.txt

# Start the uvicorn FastAPI server on port 8000
uvicorn main:app --reload
```
*Note: Make sure [Tesseract-OCR](https://github.com/UB-Mannheim/tesseract/wiki) is installed globally on your machine, or rely on the system's simulated mock-logic.*

## Source Code
*   **GitHub Repository**: [Insert GitHub Repo Link Here]

## Video Demo
*   **Link**: [Insert YouTube/Loom Link Here] 
*This 2-minute video highlights the employee ingestion UX, the seamless handover to the FastAPI ML backend, and the immediate visualization of a flagged policy breach on the Live Auditor Dashboard.*

## Hosted Link (Optional)
*   **Live Application**: [Insert Vercel / Hosted Link Here]
