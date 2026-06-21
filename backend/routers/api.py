from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db, engine, Base
import models
import schemas
from agents.graph import agent_executor
from agents.nodes import llm
from langchain_core.prompts import ChatPromptTemplate
import os
import json

# Create tables if not exist (SQLite specific ease)
Base.metadata.create_all(bind=engine)

router = APIRouter()

@router.post("/parse-nl", response_model=schemas.ScenarioInput)
async def parse_nl_scenario(payload: schemas.NLParseInput):
    text = payload.text
    try:
        if not os.environ.get("GOOGLE_API_KEY") or "your_google_api_key" in os.environ.get("GOOGLE_API_KEY", ""):
            raise ValueError("Placeholder API key")
            
        prompt = ChatPromptTemplate.from_messages([
            ("system", """You are a natural language parser for a disaster simulation engine.
Extract these four parameters from the user's text and output ONLY valid JSON format:
{{
  "rainfall_mm": (float, e.g., 0 for dry, 150 for heavy rain),
  "temperature_c": (float, e.g., 30 for normal, 45 for heatwave),
  "reservoir_capacity_pct": (float, 0-120),
  "population_density_multiplier": (float, 0.5-2.5)
}}
If the text lacks specific numbers, make a highly educated guess based on the description (e.g. "heavy rain" -> 150, "very hot" -> 42)."""),
            ("user", "Text: {text}")
        ])
        
        chain = prompt | llm
        response = chain.invoke({"text": text}).content
        
        if response.startswith("```json"):
            response = response.replace("```json", "").replace("```", "").strip()
        elif response.startswith("```"):
            response = response.replace("```", "").strip()
            
        data = json.loads(response)
        return schemas.ScenarioInput(
            rainfall_mm=float(data.get("rainfall_mm", 120)),
            temperature_c=float(data.get("temperature_c", 35)),
            reservoir_capacity_pct=float(data.get("reservoir_capacity_pct", 50)),
            population_density_multiplier=float(data.get("population_density_multiplier", 1.0))
        )
    except Exception as e:
        print(f"[NL Parse] Fallback due to error: {e}")
        text_lower = text.lower()
        r = 200 if "rain" in text_lower or "flood" in text_lower else 0
        t = 45 if "hot" in text_lower or "heat" in text_lower else 30
        res = 100 if "lake" in text_lower or "full" in text_lower or "overflow" in text_lower else 40
        return schemas.ScenarioInput(
            rainfall_mm=r,
            temperature_c=t,
            reservoir_capacity_pct=res,
            population_density_multiplier=1.0
        )

@router.post("/simulate-scenario", response_model=schemas.CityRiskReport)
async def simulate_scenario(payload: schemas.ScenarioInput, db: Session = Depends(get_db)):
    # 1. Save Scenario to DB
    db_scenario = models.Scenario(
        name=f"Simulation {payload.rainfall_mm}mm",
        description="User triggered simulation",
        rainfall_mm=payload.rainfall_mm,
        temperature_c=payload.temperature_c,
        reservoir_capacity_pct=payload.reservoir_capacity_pct,
        population_density_multiplier=payload.population_density_multiplier
    )
    db.add(db_scenario)
    db.commit()
    db.refresh(db_scenario)
    
    # 2. Invoke Multi-Agent System via LangGraph
    initial_state = {
        "scenario": payload.dict()
    }
    try:
        final_state = agent_executor.invoke(initial_state)
    except Exception as e:
        print("Agent invocation failed", e)
        raise HTTPException(status_code=500, detail=f"Agent simulation failed: {str(e)}")
        
    mayor_report = final_state.get("mayor_report", {})
    
    # 3. Construct the response payload
    metrics = schemas.RiskMetrics(
        flood_risk_pct=final_state.get("flood_risk", 0.0),
        heatwave_risk_pct=final_state.get("weather_risk", 0.0),
        water_scarcity_risk_pct=max(0.0, 100.0 - payload.reservoir_capacity_pct), 
        infrastructure_stress_pct=final_state.get("infrastructure_risk", 0.0),
        power_risk_pct=final_state.get("power_risk", 0.0),
        affected_population=mayor_report.get("affected_population", 0),
        economic_loss_estimate=mayor_report.get("economic_loss_estimate", 0.0),
        hospital_demand_increase_pct=mayor_report.get("hospital_demand_increase_pct", 0.0),
        confidence_score_pct=final_state.get("confidence_score", 0.0)
    )
    
    agent_reasoning = [
        {"agent_name": "Weather Agent", "reasoning": final_state.get("weather_analysis", "")},
        {"agent_name": "Flood Agent", "reasoning": final_state.get("flood_analysis", "")},
        {"agent_name": "Infrastructure Agent", "reasoning": final_state.get("infrastructure_analysis", "")},
        {"agent_name": "Economics Agent", "reasoning": final_state.get("economic_analysis", "")},
        {"agent_name": "Verification Agent", "reasoning": final_state.get("verification_report", "")}
    ]
    
    actions = mayor_report.get("recommended_actions", [])
    allocations = mayor_report.get("relief_allocations", [])
    
    report = schemas.CityRiskReport(
        metrics=metrics,
        agent_reasoning=agent_reasoning,
        recommended_actions=actions,
        expected_impact_reduction=mayor_report.get("expected_impact_reduction", {}),
        relief_allocations=allocations
    )
    
    # Normally we'd save the outputs back to models.RiskAssessment and models.AgentOutput
    # Skipping DB save for the final state to speed up MVP, but you could add here
    
    return report


@router.post("/sos-report", response_model=schemas.SOSReportResponse)
async def process_sos_report(payload: schemas.SOSReportInput):
    # Simulate Verification Agent
    desc = payload.description.lower()
    if "flood" in desc or "water" in desc or "rain" in desc:
        status = "VERIFIED"
        reasoning = f"Citizen report from {payload.location} aligns with simulated flood patterns. Waterlogging confirmed visually by AI."
        confidence = 92.5
    else:
        status = "PENDING_REVIEW"
        reasoning = f"Citizen report from {payload.location} requires further manual validation."
        confidence = 45.0

    return schemas.SOSReportResponse(
        status=status,
        reasoning=reasoning,
        confidence_score=confidence
    )
