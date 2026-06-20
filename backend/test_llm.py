from langchain_google_genai import ChatGoogleGenerativeAI
import os

try:
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro", temperature=0.2)
    print("Success")
except Exception as e:
    import traceback
    traceback.print_exc()
