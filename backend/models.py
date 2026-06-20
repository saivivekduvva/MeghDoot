from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
import datetime
from database import Base

class Scenario(Base):
    __tablename__ = "scenarios"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Input parameters
    rainfall_mm = Column(Float)
    temperature_c = Column(Float)
    reservoir_capacity_pct = Column(Float)
    population_density_multiplier = Column(Float, default=1.0)
    
    # Relationships
    risks = relationship("RiskAssessment", back_populates="scenario", uselist=False)
    agent_outputs = relationship("AgentOutput", back_populates="scenario")
    actions = relationship("RecommendedAction", back_populates="scenario")

class RiskAssessment(Base):
    __tablename__ = "risk_assessments"

    id = Column(Integer, primary_key=True, index=True)
    scenario_id = Column(Integer, ForeignKey("scenarios.id"))
    
    flood_risk_pct = Column(Float)
    heatwave_risk_pct = Column(Float)
    water_scarcity_risk_pct = Column(Float)
    infrastructure_stress_pct = Column(Float)
    
    affected_population = Column(Integer)
    economic_loss_estimate = Column(Float) # in Crores
    hospital_demand_increase_pct = Column(Float)
    
    confidence_score_pct = Column(Float)
    
    scenario = relationship("Scenario", back_populates="risks")

class AgentOutput(Base):
    __tablename__ = "agent_outputs"

    id = Column(Integer, primary_key=True, index=True)
    scenario_id = Column(Integer, ForeignKey("scenarios.id"))
    agent_name = Column(String) # e.g., 'Weather Agent', 'Flood Agent'
    reasoning = Column(Text)
    
    scenario = relationship("Scenario", back_populates="agent_outputs")

class RecommendedAction(Base):
    __tablename__ = "recommended_actions"

    id = Column(Integer, primary_key=True, index=True)
    scenario_id = Column(Integer, ForeignKey("scenarios.id"))
    action_text = Column(Text)
    priority_level = Column(String) # e.g., 'CRITICAL', 'HIGH', 'MEDIUM'
    
    scenario = relationship("Scenario", back_populates="actions")
