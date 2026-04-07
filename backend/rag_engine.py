import os
import google.generativeai as genai

# NOTE: In a full production env, you would import chromadb here, initialize a PersistentClient,
# embed the 40-page PDF string, and query for closest chunks utilizing semantic distance algorithms.

def index_policy_document():
    """
    Simulates the one-time ingestion of the 40-page corporate policy PDF 
    into the Vector store using Gemini Embeddings.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("Warning: No GEMINI_API_KEY found. RAG indexing simulated.")
        return {"status": "simulated_success", "documents_chunked": 42}
        
    genai.configure(api_key=api_key)
    # E.g. genai.embed_content(model="models/text-embedding-004", content="...")
    return {"status": "success", "documents_chunked": 42}

def evaluate_expense_context(merchant_name: str, amount: float, date: str, user_claimed_date: str) -> dict:
    """
    Queries the mocked ChromaDB vector store for specific policies and passes 
    them to Gemini 1.5 Pro to determine if the standard constraints have been breached.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    
    # 1. Fallback Mock Simulation Mode (No API Key)
    if not api_key:
        print("Executing Fallback Simulation RAG Evaluation.")
        
        # We enforce the logic here natively in the backend orchestrating the ML rules natively
        if date != user_claimed_date:
             return {
                 "status": "Flagged",
                 "reasoning": f"Date mismatch anomaly. Extracted date is {date}, but claimant indicated {user_claimed_date}.",
                 "policySnippet": "Section 3.1: All dates on physical receipts must match the submission claim perfectly to prevent double-logging fraud."
             }
             
        if amount > 100:
             return {
                 "status": "Flagged",
                 "reasoning": f"Amount ${amount} exceeds the automated approval threshold without management override.",
                 "policySnippet": "Section 2.4: Expenses exceeding $100.00 require secondary context and explicit supervisor sign-off."
             }
             
        return {
            "status": "Approved",
            "reasoning": f"The {merchant_name} transaction for ${amount} aligns securely within corporate limits.",
            "policySnippet": "Section 1.1: Standard merchant expenditures under threshold limitations are auto-approved."
        }

    # 2. Live Gemini Pro Mode (When API Key is Provided)
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-pro')
    
    # In a full flow, you inject the snippet fetched from ChromaDB here
    rag_snippet = "Meals limit is $100. Transport limit is $50. No weekend expensing."
    
    prompt = f"""
    You are an expert Finance Auditor. Evaluate this expense against the policy text.
    Expense: Merchant: {merchant_name}, Amount: ${amount}, Date: {date}, Claimed Date: {user_claimed_date}
    Policy String: {rag_snippet}
    
    Rules: 
    1. If Claimed Date != Date, reject it.
    2. Respond strictly with JSON format: {{"status": "Approved"|"Flagged"|"Rejected", "reasoning": "...", "policySnippet": "..."}}
    """
    
    response = model.generate_content(prompt)
    
    # Attempt to parse output cleanly
    try:
        import json
        clean_text = response.text.replace("```json", "").replace("```", "")
        return json.loads(clean_text)
    except Exception as e:
        print("Gemini parsing error:", e)
        return {
            "status": "Flagged",
            "reasoning": "Failed to parse AI Auditor response cleanly.",
            "policySnippet": "N/A"
        }
