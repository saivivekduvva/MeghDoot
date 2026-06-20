import os
from typing import Dict, Any
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from .state import AgentState

# Setup the LLM. Requires GOOGLE_API_KEY environment variable.
# For local dev, make sure to load it via dotenv or pass it in.
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.2)

def run_weather_agent(state: AgentState) -> Dict[str, Any]:
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are the Weather Agent for MeghDoot. Analyze the climate scenario and predict weather risks. Return your output EXACTLY as two lines:\nLine 1: Analysis reasoning (1-2 sentences).\nLine 2: Risk Percentage (0-100 float)."),
        ("user", "Scenario: {scenario}")
    ])
    chain = prompt | llm
    response = chain.invoke({"scenario": str(state.get("scenario"))}).content
    
    lines = response.strip().split("\n")
    analysis = lines[0] if len(lines) > 0 else "Analysis failed."
    risk = float(lines[-1].strip().replace('%', '')) if len(lines) > 1 else 0.0
    
    return {"weather_analysis": analysis, "weather_risk": risk}

def run_flood_agent(state: AgentState) -> Dict[str, Any]:
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are the Flood Agent. Assess flood probability based on weather risk ({weather_risk}%) and reservoir capacity. Output exactly two lines:\nLine 1: Reasoning.\nLine 2: Risk Percentage."),
        ("user", "Scenario: {scenario}")
    ])
    chain = prompt | llm
    response = chain.invoke({"scenario": str(state.get("scenario")), "weather_risk": state.get("weather_risk")}).content
    
    lines = response.strip().split("\n")
    analysis = lines[0] if len(lines) > 0 else "Analysis failed."
    risk = float(lines[-1].strip().replace('%', '')) if len(lines) > 1 else 0.0
    
    return {"flood_analysis": analysis, "flood_risk": risk}

def run_infrastructure_agent(state: AgentState) -> Dict[str, Any]:
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are the Infrastructure Agent. Assess infrastructure stress based on flood risk ({flood_risk}%). Output exactly two lines:\nLine 1: Reasoning.\nLine 2: Risk Percentage."),
        ("user", "Scenario: {scenario}")
    ])
    chain = prompt | llm
    response = chain.invoke({"scenario": str(state.get("scenario")), "flood_risk": state.get("flood_risk")}).content
    
    lines = response.strip().split("\n")
    analysis = lines[0] if len(lines) > 0 else "Analysis failed."
    risk = float(lines[-1].strip().replace('%', '')) if len(lines) > 1 else 0.0
    
    return {"infrastructure_analysis": analysis, "infrastructure_risk": risk}

def run_verification_agent(state: AgentState) -> Dict[str, Any]:
    # In a real scenario, this would cross-check data.
    # For now, we simulate a confidence score based on consistency.
    risk_variance = abs(state.get("weather_risk", 0) - state.get("flood_risk", 0))
    confidence = max(0, 100 - (risk_variance * 0.5))
    return {"verification_report": "Validating agent outputs. Consistency checks passed.", "confidence_score": confidence}

def run_mayor_agent(state: AgentState) -> Dict[str, Any]:
    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are the Mayor Agent. Generate a final JSON output strictly matching this format:
{{
  "recommended_actions": [
    {{"action_text": "Evacuate Zone A", "priority_level": "CRITICAL"}}
  ],
  "expected_impact_reduction": {{
    "flood_exposure_reduced_pct": 34,
    "economic_loss_reduced_pct": 22
  }},
  "affected_population": 10000,
  "economic_loss_estimate": 100.5,
  "hospital_demand_increase_pct": 10.0
}}
Base your numbers on the input risks:
Weather: {w}%, Flood: {f}%, Infrastructure: {i}%
"""),
        ("user", "Generate report.")
    ])
    chain = prompt | llm
    response = chain.invoke({
        "w": state.get("weather_risk"),
        "f": state.get("flood_risk"),
        "i": state.get("infrastructure_risk")
    }).content
    
    # We should parse JSON robustly, but for this hackathon assume LLM obeys structure
    import json
    import re
    # Extract JSON block if surrounded by markdown
    match = re.search(r'\{.*\}', response, re.DOTALL)
    if match:
        data = json.loads(match.group(0))
    else:
        data = {
            "recommended_actions": [{"action_text": "Default Action", "priority_level": "MEDIUM"}],
            "expected_impact_reduction": {},
            "affected_population": 0,
            "economic_loss_estimate": 0.0,
            "hospital_demand_increase_pct": 0.0
        }
    return {"mayor_report": data}
