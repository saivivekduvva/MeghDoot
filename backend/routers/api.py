from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db, engine, Base
import models
import schemas
from agents.graph import agent_executor

# Create tables if not exist (SQLite specific ease)
Base.metadata.create_all(bind=engine)

router = APIRouter()

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
        water_scarcity_risk_pct=0.0, # Placeholder for now
        infrastructure_stress_pct=final_state.get("infrastructure_risk", 0.0),
        affected_population=mayor_report.get("affected_population", 0),
        economic_loss_estimate=mayor_report.get("economic_loss_estimate", 0.0),
        hospital_demand_increase_pct=mayor_report.get("hospital_demand_increase_pct", 0.0),
        confidence_score_pct=final_state.get("confidence_score", 0.0)
    )
    
    agent_reasoning = [
        {"agent_name": "Weather Agent", "reasoning": final_state.get("weather_analysis", "")},
        {"agent_name": "Flood Agent", "reasoning": final_state.get("flood_analysis", "")},
        {"agent_name": "Infrastructure Agent", "reasoning": final_state.get("infrastructure_analysis", "")},
        {"agent_name": "Verification Agent", "reasoning": final_state.get("verification_report", "")}
    ]
    
    actions = mayor_report.get("recommended_actions", [])
    
    report = schemas.CityRiskReport(
        metrics=metrics,
        agent_reasoning=agent_reasoning,
        recommended_actions=actions,
        expected_impact_reduction=mayor_report.get("expected_impact_reduction", {})
    )
    
    # Normally we'd save the outputs back to models.RiskAssessment and models.AgentOutput
    # Skipping DB save for the final state to speed up MVP, but you could add here
    
    return report

@router.get("/city-report")
async def get_city_report():
    # Placeholder for getting the latest report
    return {"message": "Use /simulate-scenario to generate a new report."}
