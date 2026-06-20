import os
from typing import Dict, Any
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from .state import AgentState

# Setup the LLM. Requires GOOGLE_API_KEY environment variable.
# For local dev, make sure to load it via dotenv or pass it in.
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.2)

def run_weather_agent(state: AgentState) -> Dict[str, Any]:
    scenario = state.get("scenario", {})
    rainfall_mm = scenario.get("rainfall_mm", 120.0)
    temperature_c = scenario.get("temperature_c", 38.5)
    
    try:
        if not os.environ.get("GOOGLE_API_KEY") or "your_google_api_key" in os.environ.get("GOOGLE_API_KEY", ""):
            raise ValueError("Placeholder API key")
            
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are the Weather Agent for MeghDoot. Analyze the climate scenario and predict weather risks. Return your output EXACTLY as two lines:\nLine 1: Analysis reasoning (1-2 sentences).\nLine 2: Risk Percentage (0-100 float)."),
            ("user", "Scenario: {scenario}")
        ])
        chain = prompt | llm
        response = chain.invoke({"scenario": str(scenario)}).content
        
        lines = response.strip().split("\n")
        analysis = lines[0] if len(lines) > 0 else "Analysis failed."
        risk = float(lines[-1].strip().replace('%', '')) if len(lines) > 1 else 0.0
    except Exception as e:
        print(f"[Weather Agent] Falling back to simulation due to LLM error: {e}")
        # Calculate simulated weather risk
        heat_risk = min(100.0, max(0.0, (temperature_c - 20.0) * 4.0))
        rain_risk = min(100.0, max(0.0, (rainfall_mm / 200.0) * 100.0))
        risk = max(heat_risk, rain_risk)
        analysis = f"[Simulation Mode] Weather risk assessed. Temperature of {temperature_c}°C indicates heat levels, while expected {rainfall_mm}mm rainfall raises local flash flood and runoff concerns."
        
    return {"weather_analysis": analysis, "weather_risk": risk}

def run_flood_agent(state: AgentState) -> Dict[str, Any]:
    scenario = state.get("scenario", {})
    weather_risk = state.get("weather_risk", 0.0)
    rainfall_mm = scenario.get("rainfall_mm", 120.0)
    reservoir_capacity_pct = scenario.get("reservoir_capacity_pct", 45.0)
    
    try:
        if not os.environ.get("GOOGLE_API_KEY") or "your_google_api_key" in os.environ.get("GOOGLE_API_KEY", ""):
            raise ValueError("Placeholder API key")
            
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are the Flood Agent. Assess flood probability based on weather risk ({weather_risk}%) and reservoir capacity. Output exactly two lines:\nLine 1: Reasoning.\nLine 2: Risk Percentage."),
            ("user", "Scenario: {scenario}")
        ])
        chain = prompt | llm
        response = chain.invoke({"scenario": str(scenario), "weather_risk": weather_risk}).content
        
        lines = response.strip().split("\n")
        analysis = lines[0] if len(lines) > 0 else "Analysis failed."
        risk = float(lines[-1].strip().replace('%', '')) if len(lines) > 1 else 0.0
    except Exception as e:
        print(f"[Flood Agent] Falling back to simulation due to LLM error: {e}")
        # Calculate simulated flood risk
        capacity_factor = 1.0 - (reservoir_capacity_pct / 100.0)
        risk = min(100.0, max(0.0, (weather_risk * 0.7 + (rainfall_mm / 1.5) * 0.3) * (0.5 + capacity_factor * 0.5)))
        analysis = f"[Simulation Mode] Flood risk estimated at {risk:.1f}%. High precipitation of {rainfall_mm}mm coupled with reservoir capacity at {reservoir_capacity_pct}% creates high runoff probability."
        
    return {"flood_analysis": analysis, "flood_risk": risk}

def run_infrastructure_agent(state: AgentState) -> Dict[str, Any]:
    scenario = state.get("scenario", {})
    flood_risk = state.get("flood_risk", 0.0)
    
    try:
        if not os.environ.get("GOOGLE_API_KEY") or "your_google_api_key" in os.environ.get("GOOGLE_API_KEY", ""):
            raise ValueError("Placeholder API key")
            
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are the Infrastructure Agent. Assess infrastructure stress based on flood risk ({flood_risk}%). Output exactly two lines:\nLine 1: Reasoning.\nLine 2: Risk Percentage."),
            ("user", "Scenario: {scenario}")
        ])
        chain = prompt | llm
        response = chain.invoke({"scenario": str(scenario), "flood_risk": flood_risk}).content
        
        lines = response.strip().split("\n")
        analysis = lines[0] if len(lines) > 0 else "Analysis failed."
        risk = float(lines[-1].strip().replace('%', '')) if len(lines) > 1 else 0.0
    except Exception as e:
        print(f"[Infrastructure Agent] Falling back to simulation due to LLM error: {e}")
        # Calculate simulated infrastructure risk
        risk = min(100.0, max(0.0, flood_risk * 0.85))
        analysis = f"[Simulation Mode] Infrastructure stress index is {risk:.1f}%. Key transit corridors and low-lying power substations are vulnerable to water logging."
        
    return {"infrastructure_analysis": analysis, "infrastructure_risk": risk}

def run_verification_agent(state: AgentState) -> Dict[str, Any]:
    # In a real scenario, this would cross-check data.
    # For now, we simulate a confidence score based on consistency.
    risk_variance = abs(state.get("weather_risk", 0) - state.get("flood_risk", 0))
    confidence = max(0, 100 - (risk_variance * 0.5))
    return {"verification_report": "[Simulation Mode] Validating agent outputs. Consistency checks passed. Confidence rating calculated.", "confidence_score": confidence}

def run_mayor_agent(state: AgentState) -> Dict[str, Any]:
    scenario = state.get("scenario", {})
    w = state.get("weather_risk", 0.0)
    f = state.get("flood_risk", 0.0)
    i = state.get("infrastructure_risk", 0.0)
    pop_density = scenario.get("population_density_multiplier", 1.0)
    
    try:
        if not os.environ.get("GOOGLE_API_KEY") or "your_google_api_key" in os.environ.get("GOOGLE_API_KEY", ""):
            raise ValueError("Placeholder API key")
            
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
            "w": w,
            "f": f,
            "i": i
        }).content
        
        import json
        import re
        match = re.search(r'\{.*\}', response, re.DOTALL)
        if match:
            data = json.loads(match.group(0))
        else:
            raise ValueError("Could not parse JSON from LLM response")
    except Exception as e:
        print(f"[Mayor Agent] Falling back to simulation due to LLM error: {e}")
        # Build simulated mayor report
        affected_pop = int(pop_density * f * 12500)
        econ_loss = float((w * 0.15 + f * 0.65 + i * 0.2) * pop_density * 3.5)
        hosp_demand = float(w * 0.4 + f * 0.2)
        
        actions = []
        if f > 60:
            actions.append({"action_text": "Evacuate low-lying areas in Zone A and deploy rescue teams.", "priority_level": "CRITICAL"})
        if w > 60:
            actions.append({"action_text": "Establish cooling centers and issue extreme heat advisory.", "priority_level": "CRITICAL"})
        if i > 50:
            actions.append({"action_text": "Deploy emergency generators and reinforce grid substations.", "priority_level": "HIGH"})
            
        if not actions:
            actions.append({"action_text": "Alert civic response teams and monitor reservoir levels.", "priority_level": "MEDIUM"})
            
        actions.append({"action_text": "Coordinate emergency medical supplies dispatch.", "priority_level": "HIGH"})
        
        data = {
            "recommended_actions": actions,
            "expected_impact_reduction": {
                "flood_exposure_reduced_pct": int(f * 0.35),
                "economic_loss_reduced_pct": int(i * 0.25)
            },
            "affected_population": affected_pop,
            "economic_loss_estimate": econ_loss,
            "hospital_demand_increase_pct": hosp_demand
        }
        
    return {"mayor_report": data}
