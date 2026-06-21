export interface RiskMetrics {
  flood_risk_pct: number;
  heatwave_risk_pct: number;
  water_scarcity_risk_pct: number;
  infrastructure_stress_pct: number;
  affected_population: number;
  economic_loss_estimate: number;
  hospital_demand_increase_pct: number;
  confidence_score_pct: number;
}

export interface AgentAnalysis {
  agent_name: string;
  reasoning: string;
}

export interface ActionRecommendation {
  action_text: string;
  priority_level: string;
}

export interface ExpectedImpactReduction {
  flood_exposure_reduced_pct?: number;
  economic_loss_reduced_pct?: number;
}

export interface ReliefAllocation {
  category: string;
  amount_crores: number;
}

export interface RecoverySuggestion {
  original_asset: string;
  upgrade_suggestion: string;
  upgrade_cost_crores: number;
  risk_reduction_pct: number;
}

export interface CityRiskReport {
  metrics: RiskMetrics;
  agent_reasoning: AgentAnalysis[];
  recommended_actions: ActionRecommendation[];
  expected_impact_reduction: ExpectedImpactReduction;
  relief_allocations: ReliefAllocation[];
  recovery_suggestions?: RecoverySuggestion[];
}
