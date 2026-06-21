import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, MapPin, Camera, Send, CheckCircle2, AlertCircle, Hexagon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useReport } from '../ReportContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

interface ReportResponse {
  status: string;
  reasoning: string;
  confidence_score: number;
}

interface SubmittedReport {
  id: number;
  location: string;
  description: string;
  response?: ReportResponse;
  timestamp: string;
}

const CitizenReports = () => {
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reports, setReports] = useState<SubmittedReport[]>([]);
  const { setRescuedCount, resolvedReportIds, setResolvedReportIds } = useReport();

  const handleDispatch = (reportId: number) => {
    if (resolvedReportIds.includes(reportId)) return;
    setResolvedReportIds((prev) => [...prev, reportId]);
    const rescuedAmount = Math.floor(Math.random() * 11) + 5; // random between 5 and 15
    setRescuedCount((prev) => prev + rescuedAmount);
    toast.success(`Rescue Unit Dispatched! Approx ${rescuedAmount} citizens secured.`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location || !description) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/sos-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location, description }),
      });

      if (!res.ok) throw new Error('Submission failed');
      const data: ReportResponse = await res.json();

      const newReport: SubmittedReport = {
        id: Date.now(),
        location,
        description,
        response: data,
        timestamp: new Date().toLocaleTimeString(),
      };

      setReports((prev) => [newReport, ...prev]);
      setLocation('');
      setDescription('');
      toast.success('Report submitted and verified by AI!');
    } catch (error) {
      toast.error('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto space-y-8"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl shadow-lg shadow-red-500/30">
            <ShieldAlert className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Citizen SOS Portal</h1>
            <p className="text-slate-500 font-medium">Ground-truth verification powered by AI Vision</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="glass-panel p-6 rounded-2xl border border-white">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Camera className="w-5 h-5 text-blue-500" />
              Submit Live Report
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
                <div className="relative">
                  <MapPin className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. MG Road, Near Metro Station"
                    className="w-full pl-10 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Situation Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the situation (e.g., knee-deep waterlogging, fallen trees...)"
                  rows={4}
                  className="w-full p-4 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Processing via AI...</span>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit & Verify
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Feed Section */}
          <div className="glass-panel p-6 rounded-2xl border border-white flex flex-col h-full">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Verified AI Stream
            </h2>
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {reports.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center border-2 border-dashed border-slate-200 rounded-xl">
                  <AlertCircle className="w-12 h-12 mb-3 text-slate-300" />
                  <p>No active reports.<br/>New SOS requests will appear here after AI verification.</p>
                </div>
              ) : (
                reports.map((report) => {
                  const isResolved = resolvedReportIds.includes(report.id);
                  return (
                    <motion.div
                      key={report.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 rounded-xl border shadow-sm transition-all duration-500 ${isResolved ? 'bg-emerald-50/80 border-emerald-200' : 'bg-white/80 border-slate-100'}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className={`font-bold ${isResolved ? 'text-emerald-900' : 'text-slate-900'}`}>{report.location}</h3>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${isResolved ? 'bg-emerald-200 text-emerald-800' : 'bg-green-100 text-green-700'}`}>
                          {isResolved ? 'RESOLVED' : report.response?.status}
                        </span>
                      </div>
                      <p className={`text-sm mb-3 ${isResolved ? 'text-emerald-700' : 'text-slate-600'}`}>"{report.description}"</p>
                      <div className={`p-3 rounded-lg border ${isResolved ? 'bg-emerald-100/50 border-emerald-200' : 'bg-slate-50 border-slate-100'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <Hexagon className={`w-4 h-4 ${isResolved ? 'text-emerald-600' : 'text-indigo-500'}`} />
                          <span className={`text-xs font-bold ${isResolved ? 'text-emerald-800' : 'text-indigo-700'}`}>AI Verification Agent</span>
                          <span className="text-xs text-slate-400 ml-auto">{report.timestamp}</span>
                        </div>
                        <p className={`text-sm font-medium ${isResolved ? 'text-emerald-800' : 'text-slate-700'}`}>{report.response?.reasoning}</p>
                        <div className="mt-2 text-xs font-semibold text-slate-500">
                          Confidence Score: <span className={isResolved ? 'text-emerald-700' : 'text-indigo-600'}>{report.response?.confidence_score}%</span>
                        </div>
                      </div>
                      
                      <div className={`mt-4 pt-4 border-t ${isResolved ? 'border-emerald-200/60' : 'border-slate-100'}`}>
                        <button
                          onClick={() => handleDispatch(report.id)}
                          disabled={isResolved}
                          className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                            isResolved 
                              ? 'bg-emerald-200/50 text-emerald-700 cursor-not-allowed' 
                              : 'bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-700 shadow-sm border border-blue-200 hover:border-blue-300'
                          }`}
                        >
                          {isResolved ? (
                            <>
                              <CheckCircle2 className="w-5 h-5" />
                              Rescue Unit Dispatched
                            </>
                          ) : (
                            <>
                              <ShieldAlert className="w-5 h-5" />
                              Dispatch Rescue Unit
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CitizenReports;
