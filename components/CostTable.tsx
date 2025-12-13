import React from 'react';
import { CostItem } from '../types';
import { AlertTriangle, Server, CheckCircle2, Cloud } from 'lucide-react';
import { EXPENSIVE_THRESHOLD } from '../constants';

interface CostTableProps {
  items: CostItem[];
}

const CostTable: React.FC<CostTableProps> = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-800/50 rounded-lg border border-gray-700 border-dashed">
        <p className="text-gray-400">No compute resources detected in the uploaded file.</p>
      </div>
    );
  }

  const getProviderBadge = (provider: string) => {
    switch (provider) {
      case 'AWS':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-900/30 text-orange-400 border border-orange-500/20">AWS</span>;
      case 'Azure':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-900/30 text-blue-400 border border-blue-500/20">Azure</span>;
      case 'GCP':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-900/30 text-emerald-400 border border-emerald-500/20">GCP</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-700 text-gray-300">Unknown</span>;
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-700 bg-gray-850 shadow-lg">
      <table className="w-full text-left text-sm text-gray-300">
        <thead className="bg-gray-800 text-xs uppercase text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Resource Name</th>
            <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Provider</th>
            <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Type / Size</th>
            <th scope="col" className="px-6 py-4 font-semibold tracking-wider text-right">Est. Monthly Cost</th>
            <th scope="col" className="px-6 py-4 font-semibold tracking-wider text-center">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {items.map((item, index) => {
            const isExpensive = item.monthlyCost > EXPENSIVE_THRESHOLD;
            
            return (
              <tr key={index} className="hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                  <Server className="w-4 h-4 text-gray-500" />
                  {item.resourceName}
                </td>
                <td className="px-6 py-4">
                  {getProviderBadge(item.provider)}
                </td>
                <td className="px-6 py-4 font-mono text-gray-300">
                  <span className="bg-gray-800 border border-gray-700 px-2 py-1 rounded">{item.instanceType}</span>
                </td>
                <td className="px-6 py-4 text-right font-mono text-white">
                  ${item.monthlyCost.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-center">
                  {isExpensive ? (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">High Cost</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">Optimal</span>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CostTable;