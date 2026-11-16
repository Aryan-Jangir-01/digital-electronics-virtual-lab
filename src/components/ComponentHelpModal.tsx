import React from 'react';
import { COMPONENT_CATALOG } from '../data/componentCatalog';
import { Info, X, Cpu } from 'lucide-react';

interface ComponentHelpModalProps {
  type: string | null;
  onClose: () => void;
}

export const ComponentHelpModal: React.FC<ComponentHelpModalProps> = ({
  type,
  onClose
}) => {
  if (!type) return null;

  const def = COMPONENT_CATALOG[type];
  if (!def) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg max-h-[85vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-sky-400" />
            <div>
              <h2 className="font-bold text-base sm:text-lg text-white">{def.name}</h2>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Category: {def.category} {def.icNumber ? `• IC ${def.icNumber}` : ''}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs text-slate-300">
          <div>
            <h4 className="font-bold text-slate-200 text-sm mb-1">Description & Function</h4>
            <p className="text-slate-400 leading-relaxed">{def.description}</p>
          </div>

          {/* Pin Configuration Table */}
          <div>
            <h4 className="font-bold text-slate-200 text-sm mb-2 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-sky-400" />
              <span>Pinout List ({def.pins.length} Pins)</span>
            </h4>
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
              <table className="w-full text-left font-mono text-[11px]">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500">
                    <th className="py-2 px-3">Pin</th>
                    <th className="py-2 px-3">Name</th>
                    <th className="py-2 px-3">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {def.pins.map((p, idx) => (
                    <tr key={p.id} className="hover:bg-slate-900/50">
                      <td className="py-1.5 px-3 text-slate-500">#{idx + 1}</td>
                      <td className="py-1.5 px-3 font-bold text-sky-300">{p.name}</td>
                      <td className="py-1.5 px-3">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] ${
                            p.type === 'input'
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}
                        >
                          {p.type.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
