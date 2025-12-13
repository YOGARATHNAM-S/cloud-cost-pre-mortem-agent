import React, { useState } from 'react';
import { Sparkles, Loader2, AlertCircle, ArrowRight, ShieldCheck, Banknote } from 'lucide-react';
import { analyzeTerraformCode } from '../services/geminiService';
import { AnalysisResult } from '../types';

interface AiAdvisorProps {
  fileContent: string;
}

const AiAdvisor: React.FC<AiAdvisorProps> = ({ fileContent }) => {
  const [apiKey, setApiKey] = useState(process.env.API_KEY || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showKeyInput, setShowKeyInput] = useState(!process.env.API_KEY);

  const handleAnalyze = async () => {
    if (!apiKey) {
      setError("Please enter a Gemini API Key.");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const analysis = await analyzeTerraformCode(fileContent, apiKey);
      setResult(analysis);
    } catch (e: any) {
      setError(e.message || "Something went wrong during analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 bg-gray-800/30 border border-gray-700 rounded-xl p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-purple-500/10 blur-3xl rounded-full pointer-events-none"></div>

      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-lg">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">AI Agent Audit</h2>
          <p className="text-sm text-gray-400">Powered by Gemini 2.5 Flash</p>
        </div>
      </div>

      {showKeyInput && !result && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Gemini API Key</label>
          <div className="flex gap-2">
            <input 
              type="password" 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API Key (starts with AIza...)"
              className="flex-1 bg-gray-900 border border-gray-700 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 placeholder-gray-600"
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Key is only used for this session and not stored.
          </p>
        </div>
      )}

      {!result ? (
        <button
          onClick={handleAnalyze}
          disabled={loading || !fileContent}
          className={`relative w-full py-3 px-4 rounded-lg font-medium text-white shadow-lg transition-all 
            ${loading ? 'bg-gray-700 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 hover:shadow-purple-500/25'}
          `}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analyzing Infrastructure...</span>
            </div>
          ) : (
             "Run Pre-Mortem Analysis"
          )}
        </button>
      ) : (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid gap-4">
            {result.suggestions.length === 0 ? (
               <div className="p-4 bg-emerald-900/20 border border-emerald-500/20 rounded-lg text-emerald-200">
                 <div className="flex items-center gap-2">
                   <ShieldCheck className="w-5 h-5" />
                   <p>No critical issues found. Good job!</p>
                 </div>
               </div>
            ) : (
              result.suggestions.map((s, i) => (
                <div key={i} className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 hover:border-purple-500/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-purple-200 flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-purple-400" />
                      {s.suggestion}
                    </h3>
                    {s.potentialSavings !== 'N/A' && (
                      <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2 py-1 rounded border border-emerald-500/20">
                        Save {s.potentialSavings}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{s.reasoning}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-900 rounded p-2 border border-gray-800">
                    <span className="font-mono text-indigo-400">{s.resourceName}</span>
                    <ArrowRight className="w-3 h-3" />
                    <span className="line-through opacity-50">{s.currentType}</span>
                  </div>
                </div>
              ))
            )}
          </div>
          <button 
            onClick={() => setResult(null)}
            className="text-sm text-gray-500 hover:text-white underline"
          >
            Reset Analysis
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-900/20 border border-red-500/20 rounded-lg text-red-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default AiAdvisor;