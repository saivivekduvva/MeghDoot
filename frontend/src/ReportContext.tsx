import React, { createContext, useContext, useState } from 'react';
import type { CityRiskReport } from './types';

// Mock initial data
const defaultReport: CityRiskReport = {
  metrics: {
    flood_risk_pct: 0,
    heatwave_risk_pct: 0,
    water_scarcity_risk_pct: 0,
    infrastructure_stress_pct: 0,
    affected_population: 0,
    economic_loss_estimate: 0,
    hospital_demand_increase_pct: 0,
    confidence_score_pct: 0,
  },
  agent_reasoning: [],
  recommended_actions: [],
  expected_impact_reduction: {}
};

interface ReportContextType {
  report: CityRiskReport;
  setReport: (r: CityRiskReport) => void;
  isLoading: boolean;
  setIsLoading: (v: boolean) => void;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export function ReportProvider({ children }: { children: React.ReactNode }) {
  const [report, setReport] = useState<CityRiskReport>(defaultReport);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <ReportContext.Provider value={{ report, setReport, isLoading, setIsLoading }}>
      {children}
    </ReportContext.Provider>
  );
}

export function useReport() {
  const context = useContext(ReportContext);
  if (!context) throw new Error("useReport must be used within ReportProvider");
  return context;
}
