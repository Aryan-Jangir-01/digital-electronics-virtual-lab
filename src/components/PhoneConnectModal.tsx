import React from 'react';
import { Smartphone, X, Wifi, HandMetal, CheckCircle2, Download } from 'lucide-react';
import { soundEngine } from '../engine/audio';

interface PhoneConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhoneConnectModal: React.FC<PhoneConnectModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const currentPort = typeof window !== 'undefined' ? window.location.port || '5173' : '5173';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-sky-400" />
            <div>
              <h2 className="font-bold text-base sm:text-lg text-white">Phone Se Kaise Use Karein?</h2>
              <p className="text-xs text-slate-400">Mobile Touch Gestures & Wi-Fi Connection Guide</p>
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
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm text-slate-300">
          {/* Step 1: Open on phone */}
          <div className="bg-sky-500/10 border border-sky-500/30 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-sky-300 font-bold">
              <Wifi className="w-4 h-4" />
              <span>1. Apne Phone ke Browser me kaise kholein:</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Apne PC aur Phone ko <strong>same Wi-Fi ya Mobile Hotspot</strong> se connect karein. Uske baad phone ke Chrome/Safari me yeh link open karein:
            </p>
            <div className="bg-slate-950 px-3 py-2 rounded-lg font-mono text-xs text-sky-400 border border-slate-800 flex items-center justify-between">
              <span>http://{currentHost}:{currentPort}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`http://${currentHost}:${currentPort}`);
                  soundEngine.vibrate(15);
                }}
                className="text-[10px] bg-sky-600 hover:bg-sky-500 text-white px-2 py-0.5 rounded font-sans"
              >
                Copy Link
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              (Agar PC par hain toh terminal me apna Wi-Fi IP address e.g. <code>http://192.168.x.x:5173</code> phone browser me daalein).
            </p>
          </div>

          {/* Step 2: Touch Gestures */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <HandMetal className="w-4 h-4" />
              <span>2. Phone Touch Controls & Gestures:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                <span className="font-bold text-sky-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Tap-to-Connect Wire
                </span>
                <p className="text-slate-400 mt-1">
                  Output pin par tap karein, fir Input pin par tap karein — Wire turant connect ho jayegi!
                </p>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                <span className="font-bold text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Pinch-to-Zoom
                </span>
                <p className="text-slate-400 mt-1">
                  2 fingers se screen par pinch karke zoom-in ya zoom-out karein.
                </p>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                <span className="font-bold text-amber-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 1-Touch Toggle
                </span>
                <p className="text-slate-400 mt-1">
                  Switches aur Push Buttons ko direct touch karke 1 (HIGH) ya 0 (LOW) karein.
                </p>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                <span className="font-bold text-indigo-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Sound & Haptics
                </span>
                <p className="text-slate-400 mt-1">
                  Real switch clicks, phone vibration feedback aur beeping buzzer sound effects.
                </p>
              </div>
            </div>
          </div>

          {/* Step 3: PWA Add to Home Screen */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-bold">
              <Download className="w-4 h-4" />
              <span>3. Phone App ki tarah install karein:</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Chrome me <strong>⋮ (3 dots)</strong> par tap karein aur <strong>"Add to Home screen"</strong> ya Safari me <strong>Share &gt; "Add to Home Screen"</strong> select karein. Isse yeh bina browser bar ke full-screen native mobile app ban jayegi!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={() => {
              soundEngine.vibrate(10);
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/20"
          >
            Samajh Gaya (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
