import React from 'react';
import { PRESET_EXPERIMENTS } from '../data/presetExperiments';
import type { PresetExperiment } from '../types/circuit';
import { FlaskConical, X, ArrowRight, BookOpen } from 'lucide-react';
import { soundEngine } from '../engine/audio';

interface PresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadExperiment: (experiment: PresetExperiment) => void;
}

export const PresetModal: React.FC<PresetModalProps> = ({
  isOpen,
  onClose,
  onLoadExperiment
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="font-bold text-base sm:text-lg text-white">Lab Experiments Library</h2>
              <p className="text-xs text-slate-400">Pre-built experiments ready to run on your phone</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Experiment List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {PRESET_EXPERIMENTS.map((exp) => (
            <div
              key={exp.id}
              onClick={() => {
                soundEngine.vibrate(20);
                soundEngine.playConnect();
                onLoadExperiment(exp);
                onClose();
              }}
              className="bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-4 cursor-pointer transition-all group flex flex-col gap-2"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {exp.category}
                  </span>
                  <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-indigo-300 mt-1.5 transition-colors">
                    {exp.title}
                  </h3>
                </div>
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 group-hover:bg-indigo-500 text-white text-xs font-semibold shrink-0 transition-colors shadow">
                  <span>Load</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {exp.description}
              </p>

              <div className="text-[11px] text-slate-400 flex items-center gap-1 bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-slate-800">
                <BookOpen className="w-3 h-3 text-indigo-400 shrink-0" />
                <span className="truncate"><strong className="text-slate-300">Theory:</strong> {exp.theory}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
