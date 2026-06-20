from typing import TypedDict, Dict, Any, List

class AgentState(TypedDict):
    scenario: Dict[str, Any]  # The input data: rainfall, temp, etc.
    
    # Agent Outputs
    weather_analysis: str
    weather_risk: float
    
    flood_analysis: str
    flood_risk: float
    
    infrastructure_analysis: str
    infrastructure_risk: float
    
    healthcare_analysis: str
    healthcare_risk: float
    
    water_analysis: str
    water_risk: float
    
    economic_analysis: str
    economic_risk: float
    
    # Verification
    verification_report: str
    confidence_score: float
    
    # Mayor / Final Output
    mayor_report: Dict[str, Any]
