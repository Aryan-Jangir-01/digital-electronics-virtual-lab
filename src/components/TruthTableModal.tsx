import React from 'react';
import type { CircuitComponent, Wire } from '../types/circuit';
import { generateTruthTable } from '../engine/truthTable';
import type { TruthTableResult } from '../engine/truthTable';
import { Table, X, AlertCircle, Copy, Check } from 'lucide-react';
import { soundEngine } from '../engine/audio';

interface TruthTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  components: CircuitComponent[];
  wires: Wire[];
}

export const TruthTableModal: React.FC<TruthTableModalProps> = ({
  isOpen,
  onClose,
  components,
  wires
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const result = generateTruthTable(components, wires);

  const isError = 'error' in result;

  const handleCopy = () => {
    if (isError) return;
    const tt = result as TruthTableResult;
    const headers = [...tt.inputs.map(i => i.label), ...tt.outputs.map(o => o.label)].join('\t');
    const rowsText = tt.rows
      .map(r => [
        ...tt.inputs.map(i => r.inputValues[i.id]),
        ...tt.outputs.map(o => r.outputValues[o.id])
      ].join('\t'))
      .join('\n');

    navigator.clipboard.writeText(`${headers}\n${rowsText}`);
    soundEngine.vibrate(15);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Table className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="font-bold text-base sm:text-lg text-white">Truth Table Generator</h2>
              <p className="text-xs text-slate-400">Automated simulation of all input combinations</p>
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
        <div className="flex-1 overflow-y-auto p-4">
          {isError ? (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3 text-amber-200">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-amber-300">Cannot Generate Truth Table</p>
                <p className="mt-1 text-slate-300">{(result as { error: string }).error}</p>
                <p className="mt-2 text-xs text-slate-400">
                  Tip: Connect at least one Toggle Switch (Input) to a Logic Gate, and connect the gate's output to an LED (Output).
                </p>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-400 font-mono">
                  {(result as TruthTableResult).rows.length} Total States Evaluated
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Table'}</span>
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-center text-xs font-mono">
                  <thead>
                    <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400">
                      <th className="py-2.5 px-3 text-slate-500 font-bold">#</th>
                      {(result as TruthTableResult).inputs.map((inp) => (
                        <th key={inp.id} className="py-2.5 px-3 font-bold text-sky-400 border-r border-slate-800/60">
                          {inp.label}
                        </th>
                      ))}
                      {(result as TruthTableResult).outputs.map((out) => (
                        <th key={out.id} className="py-2.5 px-3 font-bold text-emerald-400">
                          {out.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {(result as TruthTableResult).rows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-2 px-3 text-slate-600 font-bold">{idx}</td>
                        {(result as TruthTableResult).inputs.map((inp) => {
                          const val = row.inputValues[inp.id];
                          return (
                            <td key={inp.id} className="py-2 px-3 border-r border-slate-800/60">
                              <span
                                className={`inline-block px-2 py-0.5 rounded font-bold ${
                                  val === 1
                                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                                    : 'bg-slate-800 text-slate-400'
                                }`}
                              >
                                {val}
                              </span>
                            </td>
                          );
                        })}
                        {(result as TruthTableResult).outputs.map((out) => {
                          const val = row.outputValues[out.id];
                          return (
                            <td key={out.id} className="py-2 px-3">
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded font-bold ${
                                  val === 1
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_8px_rgba(34,197,94,0.3)]'
                                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                }`}
                              >
                                {val}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
