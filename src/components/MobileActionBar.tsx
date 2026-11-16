import React from 'react';
import {
  Play,
  Pause,
  SkipForward,
  Plus,
  Trash2,
  Table,
  Activity,
  FlaskConical,
  Smartphone,
  Scissors
} from 'lucide-react';
import { soundEngine } from '../engine/audio';

interface MobileActionBarProps {
  isRunning: boolean;
  hasSelection: boolean;
  isCutterMode: boolean;
  onTogglePlay: () => void;
  onStep: () => void;
  onOpenDrawer: () => void;
  onDeleteSelection: () => void;
  onToggleCutterMode: () => void;
  onOpenTruthTable: () => void;
  onOpenScope: () => void;
  onOpenPresets: () => void;
  onOpenPhoneHelp: () => void;
}

export const MobileActionBar: React.FC<MobileActionBarProps> = ({
  isRunning,
  hasSelection,
  isCutterMode,
  onTogglePlay,
  onStep,
  onOpenDrawer,
  onDeleteSelection,
  onToggleCutterMode,
  onOpenTruthTable,
  onOpenScope,
  onOpenPresets,
  onOpenPhoneHelp
}) => {
  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[96%] max-w-lg z-40">
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl px-2.5 py-2 flex items-center justify-between gap-1">
        {/* Play / Pause */}
        <button
          onClick={() => {
            soundEngine.vibrate(15);
            onTogglePlay();
          }}
          title={isRunning ? 'Pause Simulation' : 'Run Simulation'}
          className={`flex items-center justify-center w-10 h-10 rounded-xl font-bold transition-all shrink-0 ${
            isRunning
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
              : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
          }`}
        >
          {isRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
        </button>

        {/* Step Clock */}
        <button
          onClick={() => {
            soundEngine.vibrate(10);
            onStep();
          }}
          title="Single Step Clock"
          className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors shrink-0"
        >
          <SkipForward className="w-4 h-4" />
        </button>

        {/* Big Add Component Button */}
        <button
          onClick={() => {
            soundEngine.vibrate(20);
            onOpenDrawer();
          }}
          className="flex items-center gap-1 px-3.5 h-10 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/25 active:scale-95 transition-all shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add</span>
        </button>

        {/* Wire Cutter / Disconnect Tool (Scissors) */}
        <button
          onClick={() => {
            soundEngine.vibrate(20);
            onToggleCutterMode();
          }}
          title={isCutterMode ? 'Exit Cutter Mode' : 'Cut / Disconnect Wire Tool'}
          className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all shrink-0 ${
            isCutterMode
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/50 ring-2 ring-rose-400 animate-pulse'
              : 'bg-slate-800/80 hover:bg-slate-700 text-rose-400'
          }`}
        >
          <Scissors className="w-4 h-4" />
        </button>

        {/* Delete Selection (if any component/wire is selected) */}
        {hasSelection && (
          <button
            onClick={() => {
              soundEngine.vibrate(25);
              soundEngine.playDelete();
              onDeleteSelection();
            }}
            title="Delete Selected"
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500 hover:text-white transition-all shrink-0 animate-bounce"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        {/* Presets Experiments */}
        {!hasSelection && (
          <button
            onClick={() => {
              soundEngine.vibrate(10);
              onOpenPresets();
            }}
            title="Experiments Library"
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-indigo-300 transition-colors shrink-0"
          >
            <FlaskConical className="w-4 h-4" />
          </button>
        )}

        {/* Truth Table Generator */}
        <button
          onClick={() => {
            soundEngine.vibrate(10);
            onOpenTruthTable();
          }}
          title="Auto Truth Table"
          className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-emerald-400 transition-colors shrink-0"
        >
          <Table className="w-4 h-4" />
        </button>

        {/* Logic Waveform Scope */}
        <button
          onClick={() => {
            soundEngine.vibrate(10);
            onOpenScope();
          }}
          title="Logic Timing Waveforms"
          className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-amber-400 transition-colors shrink-0"
        >
          <Activity className="w-4 h-4" />
        </button>

        {/* Phone Guide Button */}
        <button
          onClick={() => {
            soundEngine.vibrate(10);
            onOpenPhoneHelp();
          }}
          title="Phone Connection & Tips"
          className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-sky-400 transition-colors shrink-0"
        >
          <Smartphone className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
