import { useReport } from '../ReportContext';
import { Bot, CheckCircle } from 'lucide-react';

export default function AgentIntelligence() {
  const { report } = useReport();
  const { agent_reasoning } = report;

  if (!agent_reasoning || agent_reasoning.length === 0) {
    return (
      <div className="p-8 flex items-center justify-center h-full text-slate-500">
        Run a simulation to see Agent Intelligence.
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Agent Intelligence</h2>
        <p className="text-slate-500 mt-2">Transparent reasoning from each specialized AI node.</p>
      </header>

      <div className="space-y-4">
        {agent_reasoning.map((agent, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="bg-blue-50 p-3 rounded-full text-blue-600">
              {agent.agent_name === 'Verification Agent' ? <CheckCircle className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-800">{agent.agent_name}</h4>
              <p className="text-slate-600 mt-2 leading-relaxed">{agent.reasoning}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
