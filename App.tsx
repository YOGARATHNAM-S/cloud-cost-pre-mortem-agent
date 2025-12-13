import React, { useState, useMemo } from 'react';
import FileUpload from './components/FileUpload';
import CostTable from './components/CostTable';
import AiAdvisor from './components/AiAdvisor';
import { parseTerraformContent } from './services/parserService';
import { calculateCosts, getTotalCost } from './services/pricingService';
import { ParsedResource, CostItem } from './types';
import { LayoutDashboard, DollarSign, PieChart, Layers, Cloud, Filter, Home } from 'lucide-react';

const App: React.FC = () => {
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsedResources, setParsedResources] = useState<ParsedResource[]>([]);
  
  // Cloud Provider Filter State
  const [selectedProvider, setSelectedProvider] = useState<'All' | 'AWS' | 'Azure' | 'GCP'>('All');

  const handleFileUpload = (content: string, name: string) => {
    setFileContent(content);
    setFileName(name);
    const resources = parseTerraformContent(content);
    setParsedResources(resources);
    setSelectedProvider('All'); // Reset filter on new upload
  };

  const costItems: CostItem[] = useMemo(() => {
    return calculateCosts(parsedResources);
  }, [parsedResources]);

  // Filter items based on selection
  const filteredCostItems = useMemo(() => {
    if (selectedProvider === 'All') return costItems;
    return costItems.filter(item => item.provider === selectedProvider);
  }, [costItems, selectedProvider]);

  // Calculate total based on filtered items
  const totalCost = useMemo(() => {
    return getTotalCost(filteredCostItems);
  }, [filteredCostItems]);

  const getProviderStyles = (provider: string, isActive: boolean) => {
    if (isActive) {
      switch (provider) {
        case 'AWS': return 'bg-[#FF9900] text-black border-[#FF9900] shadow-[0_0_15px_rgba(255,153,0,0.3)]';
        case 'Azure': return 'bg-[#007FFF] text-white border-[#007FFF] shadow-[0_0_15px_rgba(0,127,255,0.3)]';
        case 'GCP': return 'bg-[#0F9D58] text-white border-[#0F9D58] shadow-[0_0_15px_rgba(15,157,88,0.3)]';
        default: return 'bg-gray-100 text-gray-900 border-gray-200';
      }
    }
    // Inactive styles
    return 'bg-gray-800/50 text-gray-400 border-gray-700 hover:bg-gray-800 hover:text-gray-200';
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white selection:bg-purple-500/30">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Cloud Cost Pre-Mortem</h1>
              <p className="text-xs text-gray-400">Terraform FinOps Agent</p>
            </div>
            {/* Cloud Provider Logos */}
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-700">
              <img src="/google-cloud-logo-png_seeklogo-336116.webp" alt="GCP" className="h-6 w-auto opacity-70 hover:opacity-100 transition-opacity" title="Google Cloud Platform" />
              <img src="/AWS-Logo-700x394.webp" alt="AWS" className="h-6 w-auto opacity-70 hover:opacity-100 transition-opacity" title="Amazon Web Services" />
              <img src="/Microsoft_Azure-Logo.wine.webp" alt="Azure" className="h-6 w-auto opacity-70 hover:opacity-100 transition-opacity" title="Microsoft Azure" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            {fileContent && (
              <button
                onClick={() => { 
                  setFileContent(null); 
                  setFileName(null); 
                  setParsedResources([]); 
                  setSelectedProvider('All'); 
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all border border-gray-700 hover:border-gray-600 shadow-sm"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Home</span>
              </button>
            )}
            <span className="px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-xs text-gray-400">
              v1.0.0 MVP
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {!fileContent ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in duration-500">
            <div className="text-center mb-8 max-w-2xl">
              <h2 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Stop Cloud Bill Shock
              </h2>
              <p className="text-lg text-gray-400">
                Upload your <code className="bg-gray-800 px-1.5 py-0.5 rounded text-gray-300 font-mono">main.tf</code> file to get an instant cost estimate and AI-powered optimization advice before you deploy.
              </p>
            </div>
            <FileUpload onFileUpload={handleFileUpload} />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-12">
              {[
                { title: 'Instant Parsing', desc: 'Extracts instances locally.', icon: '⚡' },
                { title: 'Cost Estimation', desc: 'Monthly price preview.', icon: '💰' },
                { title: 'AI Audit', desc: 'Optimization suggestions.', icon: '🤖' },
              ].map((feature, idx) => (
                <div key={idx} className="p-6 bg-gray-800/30 rounded-xl border border-gray-800 text-center hover:bg-gray-800/50 transition-colors">
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
            
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-800/50">
               <div className="flex items-center gap-2">
                 <Filter className="w-4 h-4 text-gray-500" />
                 <span className="text-sm font-medium text-gray-400">Provider View:</span>
               </div>
               
               <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                {(['All', 'AWS', 'Azure', 'GCP'] as const).map((provider) => {
                  const isActive = selectedProvider === provider;
                  return (
                    <button
                      key={provider}
                      onClick={() => setSelectedProvider(provider)}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border whitespace-nowrap
                        ${getProviderStyles(provider, isActive)}
                      `}
                    >
                      {provider === 'All' ? <Layers className="w-4 h-4" /> : <Cloud className="w-4 h-4" />}
                      {provider === 'All' ? 'All Clouds' : provider}
                    </button>
                  );
                })}
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Stats & Table */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-xl flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <DollarSign className="w-5 h-5" />
                      <span className="text-sm font-medium">Total Est. ({selectedProvider})</span>
                    </div>
                    <div className="text-4xl font-bold text-white tracking-tight">
                      ${totalCost.toFixed(2)}
                    </div>
                  </div>

                  <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-xl flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <PieChart className="w-5 h-5" />
                      <span className="text-sm font-medium">Resources ({selectedProvider})</span>
                    </div>
                    <div className="text-4xl font-bold text-white tracking-tight">
                      {filteredCostItems.length}
                    </div>
                  </div>
                </div>

                {/* Cloud Provider Logos - Billing Report */}
                <div className="flex items-center justify-center gap-6 mb-6 p-4 bg-gray-800/30 rounded-xl border border-gray-700">
                  <img src="/google-cloud-logo-png_seeklogo-336116.webp" alt="GCP" className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity" title="Google Cloud Platform" />
                  <img src="/AWS-Logo-700x394.webp" alt="AWS" className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity" title="Amazon Web Services" />
                  <img src="/Microsoft_Azure-Logo.wine.webp" alt="Azure" className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity" title="Microsoft Azure" />
                </div>

                {/* Detail Table */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                       Resource Breakdown
                       {selectedProvider !== 'All' && <span className="text-sm font-normal text-gray-400">({selectedProvider} Only)</span>}
                    </h3>
                    <button 
                      onClick={() => { setFileContent(null); setSelectedProvider('All'); }}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      Upload different file
                    </button>
                  </div>
                  <CostTable items={filteredCostItems} />
                </div>

                {/* Raw File Preview */}
                <div className="mt-8">
                  <details className="group border border-gray-700 rounded-lg bg-gray-900/30">
                    <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-gray-400 hover:text-white transition-colors">
                      <span>See the Bill: {fileName}</span>
                      <span className="transition group-open:rotate-180">
                        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                      </span>
                    </summary>
                    <div className="border-t border-gray-700 p-4">
                      <textarea
                        value={fileContent || ''}
                        onChange={(e) => {
                          const newContent = e.target.value;
                          setFileContent(newContent);
                          const resources = parseTerraformContent(newContent);
                          setParsedResources(resources);
                        }}
                        className="w-full text-xs text-gray-300 font-mono overflow-x-auto whitespace-pre-wrap min-h-64 max-h-96 bg-gray-900/50 border border-gray-700 rounded p-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="Edit your Terraform configuration here..."
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Edit the file content above - costs will update automatically
                      </p>
                    </div>
                  </details>
                </div>
              </div>

              {/* Right Column: AI Agent */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <AiAdvisor fileContent={fileContent} />
                </div>
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;