import React from 'react';
import type { CircuitComponent, ScopeSample } from '../types/circuit';
import { Activity, X, Trash2, Pause, Play } from 'lucide-react';
import { soundEngine } from '../engine/audio';

interface LogicAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
  samples: ScopeSample[];
  components: CircuitComponent[];
  isSampling: boolean;
  onToggleSampling: () => void;
  onClearSamples: () => void;
}

export const LogicAnalyzerModal: React.FC<LogicAnalyzerModalProps> = ({
  isOpen,
  onClose,
  samples,
  components,
  isSampling,
  onToggleSampling,
  onClearSamples
}) => {
  if (!isOpen) return null;

  // Identify channels to display (clocks, switches, LEDs, outputs)
  const channels: { id: string; label: string; color: string }[] = [];
  const palette = ['#38bdf8', '#22c55e', '#f59e0b', '#ec4899', '#a855f7', '#14b8a6'];

  components.forEach((c) => {
    if (c.type === 'clock' || c.type === 'switch' || c.type.startsWith('led') || c.type === 'counter_4bit') {
      const pin = c.pins.find(p => p.type === 'output') || c.pins.find(p => p.type === 'input');
      if (pin && channels.length < 6) {
        channels.push({
          id: `${c.id}:${pin.id}`,
          label: c.label || `${c.type.toUpperCase()}`,
          color: palette[channels.length % palette.length]
        });
      }
    }
  });

  const MAX_DISPLAY_POINTS = 30;
  const recentSamples = samples.slice(-MAX_DISPLAY_POINTS);

  // SVG waveform dimensions
  const waveWidth = 400;
  const channelHeight = 44;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="font-bold text-base sm:text-lg text-white">Logic Timing Analyzer</h2>
              <p className="text-xs text-slate-400">Real-time digital signal oscilloscope</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundEngine.vibrate(10);
                onToggleSampling();
              }}
              className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors ${
                isSampling
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              {isSampling ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isSampling ? 'Pause' : 'Resume'}</span>
            </button>

            <button
              onClick={() => {
                soundEngine.vibrate(10);
                onClearSamples();
              }}
              title="Clear Waveforms"
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {channels.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              Add a Clock, Switch, or LED to observe live digital waveforms.
            </div>
          ) : (
            channels.map((ch) => {
              // Construct digital waveform step path
              const numPoints = recentSamples.length;
              const stepX = numPoints > 1 ? waveWidth / (MAX_DISPLAY_POINTS - 1) : 10;
              const yHigh = 8;
              const yLow = channelHeight - 10;

              let pathD = '';

              recentSamples.forEach((sample, i) => {
                const val = sample.channels[ch.id] === 1 ? 1 : 0;
                const x = i * stepX;
                const y = val === 1 ? yHigh : yLow;

                if (i === 0) {
                  pathD += `M ${x} ${y}`;
                } else {
                  const prevVal = recentSamples[i - 1].channels[ch.id] === 1 ? 1 : 0;
                  const prevY = prevVal === 1 ? yHigh : yLow;
                  // Vertical transition step
                  if (prevVal !== val) {
                    pathD += ` L ${x} ${prevY} L ${x} ${y}`;
                  } else {
                    pathD += ` L ${x} ${y}`;
                  }
                }
              });

              const lastVal = recentSamples[recentSamples.length - 1]?.channels[ch.id] ?? 0;

              return (
                <div key={ch.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold" style={{ color: ch.color }}>
                      {ch.label}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        lastVal === 1
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {lastVal === 1 ? '1 (HIGH)' : '0 (LOW)'}
                    </span>
                  </div>

                  {/* Waveform Canvas SVG */}
                  <div className="w-full overflow-x-auto bg-[#0a0d14] rounded-lg border border-slate-900 p-1">
                    <svg
                      viewBox={`0 0 ${waveWidth} ${channelHeight}`}
                      className="w-full h-12 overflow-visible"
                    >
                      {/* Grid guideline */}
                      <line
                        x1="0"
                        y1={channelHeight - 10}
                        x2={waveWidth}
                        y2={channelHeight - 10}
                        stroke="#1e293b"
                        strokeDasharray="2 4"
                      />
                      <line
                        x1="0"
                        y1="8"
                        x2={waveWidth}
                        y2="8"
                        stroke="#1e293b"
                        strokeDasharray="2 4"
                      />

                      {/* Signal Path */}
                      <path
                        d={pathD || `M 0 ${channelHeight - 10} L ${waveWidth} ${channelHeight - 10}`}
                        fill="none"
                        stroke={ch.color}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
