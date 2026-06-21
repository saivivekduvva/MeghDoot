import React, { createContext, useContext, useState, useEffect } from 'react';
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
  rescuedCount: number;
  setRescuedCount: (v: number | ((prev: number) => number)) => void;
  resolvedReportIds: number[];
  setResolvedReportIds: (v: number[] | ((prev: number[]) => number[])) => void;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export function ReportProvider({ children }: { children: React.ReactNode }) {
  const [report, setReport] = useState<CityRiskReport>(() => {
    const saved = localStorage.getItem('meghdoot_report');
    return saved ? JSON.parse(saved) : defaultReport;
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const [rescuedCount, setRescuedCount] = useState<number>(() => {
    const saved = localStorage.getItem('meghdoot_rescuedCount');
    return saved ? JSON.parse(saved) : 0;
  });

  const [resolvedReportIds, setResolvedReportIds] = useState<number[]>(() => {
    const saved = localStorage.getItem('meghdoot_resolvedReportIds');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('meghdoot_report', JSON.stringify(report));
  }, [report]);

  useEffect(() => {
    localStorage.setItem('meghdoot_rescuedCount', JSON.stringify(rescuedCount));
  }, [rescuedCount]);

  useEffect(() => {
    localStorage.setItem('meghdoot_resolvedReportIds', JSON.stringify(resolvedReportIds));
  }, [resolvedReportIds]);

  return (
    <ReportContext.Provider value={{ 
      report, setReport, isLoading, setIsLoading,
      rescuedCount, setRescuedCount, resolvedReportIds, setResolvedReportIds 
    }}>
      {children}
    </ReportContext.Provider>
  );
}

export function useReport() {
  const context = useContext(ReportContext);
  if (!context) throw new Error("useReport must be used within ReportProvider");
  return context;
}
