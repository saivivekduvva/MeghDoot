from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# Input payload for scenario simulation
class ScenarioInput(BaseModel):
    rainfall_mm: float
    temperature_c: float
    reservoir_capacity_pct: float
    population_density_multiplier: float = 1.0

# Base Agent Output
class AgentAnalysis(BaseModel):
    agent_name: str
    reasoning: str

# Risk Assessment block
class RiskMetrics(BaseModel):
    flood_risk_pct: float
    heatwave_risk_pct: float
    water_scarcity_risk_pct: float
    infrastructure_stress_pct: float
    affected_population: int
    economic_loss_estimate: float
    hospital_demand_increase_pct: float
    confidence_score_pct: float

# Recommended Action block
class ActionRecommendation(BaseModel):
    action_text: str
    priority_level: str

# Expected output format for the API response
class CityRiskReport(BaseModel):
    metrics: RiskMetrics
    agent_reasoning: List[AgentAnalysis]
    recommended_actions: List[ActionRecommendation]
    expected_impact_reduction: dict
