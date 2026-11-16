import React from 'react';
import {
  RotateCcw,
  Volume2,
  VolumeX,
  ZoomIn,
  ZoomOut,
  Download,
  Upload,
  Cpu,
  Smartphone,
  Scissors
} from 'lucide-react';
import { soundEngine } from '../engine/audio';

interface ToolbarProps {
  zoom: number;
  soundEnabled: boolean;
  isCutterMode: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onToggleSound: () => void;
  onToggleCutterMode: () => void;
  onClear: () => void;
  onExportJson: () => void;
  onImportJson: () => void;
  onOpenPhoneHelp: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  zoom,
  soundEnabled,
  isCutterMode,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onToggleSound,
  onToggleCutterMode,
  onClear,
  onExportJson,
  onImportJson,
  onOpenPhoneHelp
}) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-3 py-2 flex items-center justify-between gap-2 shadow-lg">
      {/* Title & Branding */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-md shadow-sky-500/20">
          <Cpu className="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-xs sm:text-sm text-white tracking-wide flex items-center gap-1.5 leading-none">
            Digital Electronics Virtual Lab
          </h1>
          <p className="text-[10px] text-slate-400 font-mono mt-0.5 hidden xs:block">
            Phone & Desktop Touch-Optimized
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Zoom Controls */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
          <button
            onClick={() => {
              soundEngine.vibrate(10);
              onZoomOut();
            }}
            title="Zoom Out"
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              soundEngine.vibrate(10);
              onResetZoom();
            }}
            title="Reset Zoom to 100%"
            className="px-1.5 text-[10px] font-mono text-slate-300 hover:text-white font-semibold"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            onClick={() => {
              soundEngine.vibrate(10);
              onZoomIn();
            }}
            title="Zoom In"
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Sound Toggle */}
        <button
          onClick={() => {
            soundEngine.vibrate(10);
            onToggleSound();
          }}
          title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
          className={`p-2 rounded-lg border transition-colors ${
            soundEnabled
              ? 'bg-slate-900 border-slate-800 text-sky-400 hover:bg-slate-800'
              : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
          }`}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Phone Guide Button */}
        <button
          onClick={() => {
            soundEngine.vibrate(10);
            onOpenPhoneHelp();
          }}
          title="Phone Setup & Mobile Tips"
          className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 hover:bg-sky-500/20 text-xs font-semibold transition-colors"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Phone Mode</span>
        </button>

        {/* Wire Cutter Toggle */}
        <button
          onClick={() => {
            soundEngine.vibrate(15);
            onToggleCutterMode();
          }}
          title={isCutterMode ? 'Exit Cutter Mode' : 'Wire Cutter / Disconnect Tool'}
          className={`p-2 rounded-lg border transition-all ${
            isCutterMode
              ? 'bg-rose-600 border-rose-400 text-white shadow-md shadow-rose-600/40 ring-1 ring-rose-400 animate-pulse'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-800'
          }`}
        >
          <Scissors className="w-4 h-4" />
        </button>

        {/* Clear Canvas */}
        <button
          onClick={() => {
            soundEngine.vibrate(20);
            onClear();
          }}
          title="Clear Entire Canvas"
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Save / Export Menu */}
        <div className="flex items-center gap-1">
          <button
            onClick={onExportJson}
            title="Save Circuit (JSON)"
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors hidden sm:block"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={onImportJson}
            title="Open Saved Circuit (JSON)"
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors hidden sm:block"
          >
            <Upload className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
