import React from 'react';
import type { CircuitComponent, Pin } from '../types/circuit';
import { COMPONENT_CATALOG } from '../data/componentCatalog';
import { Power, Volume2, Clock, Trash2, Copy, Info } from 'lucide-react';
import { soundEngine } from '../engine/audio';

interface ComponentViewProps {
  component: CircuitComponent;
  isSelected: boolean;
  activeWireSource: { compId: string; pinId: string } | null;
  isCutterMode?: boolean;
  onSelect: (id: string, e: React.MouseEvent | React.TouchEvent) => void;
  onPinPointerDown: (compId: string, pinId: string, e: React.PointerEvent) => void;
  onPinTap: (compId: string, pinId: string) => void;
  onToggleSwitch?: (compId: string) => void;
  onPushButtonPress?: (compId: string, pressed: boolean) => void;
  onToggleDipSwitch?: (compId: string, bit: string) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onInspect?: (type: string) => void;
}

export const ComponentView: React.FC<ComponentViewProps> = ({
  component,
  isSelected,
  activeWireSource,
  isCutterMode = false,
  onSelect,
  onPinPointerDown,
  onPinTap,
  onToggleSwitch,
  onPushButtonPress,
  onToggleDipSwitch,
  onDelete,
  onDuplicate,
  onInspect
}) => {
  const def = COMPONENT_CATALOG[component.type];
  if (!def) return null;

  const width = def.width;
  const height = def.height;

  // Render Gate Symbol SVG (ANSI standard)
  const renderGateSvg = () => {
    switch (component.type) {
      case 'not':
        return (
          <svg className="absolute inset-0 pointer-events-none" width={width} height={height}>
            <polygon points="15,10 70,30 15,50" fill="#1e293b" stroke="#94a3b8" strokeWidth="2.5" />
            <circle cx="75" cy="30" r="4.5" fill="#0f172a" stroke="#94a3b8" strokeWidth="2.5" />
            <line x1="0" y1="30" x2="15" y2="30" stroke="#94a3b8" strokeWidth="2" />
            <line x1="79.5" y1="30" x2={width} y2="30" stroke="#94a3b8" strokeWidth="2" />
          </svg>
        );
      case 'and':
        return (
          <svg className="absolute inset-0 pointer-events-none" width={width} height={height}>
            {/* AND ANSI D-shape */}
            <path d="M 18,12 L 44,12 A 18,18 0 0 1 44,48 L 18,48 Z" fill="#1e293b" stroke="#94a3b8" strokeWidth="2.5" />
            <line x1="0" y1="20" x2="18" y2="20" stroke="#94a3b8" strokeWidth="2" />
            <line x1="0" y1="40" x2="18" y2="40" stroke="#94a3b8" strokeWidth="2" />
            <line x1="62" y1="30" x2={width} y2="30" stroke="#94a3b8" strokeWidth="2" />
          </svg>
        );
      case 'and3':
        return (
          <svg className="absolute inset-0 pointer-events-none" width={width} height={height}>
            <path d="M 18,10 L 48,10 A 30,30 0 0 1 48,70 L 18,70 Z" fill="#1e293b" stroke="#94a3b8" strokeWidth="2.5" />
            <line x1="0" y1="20" x2="18" y2="20" stroke="#94a3b8" strokeWidth="2" />
            <line x1="0" y1="40" x2="18" y2="40" stroke="#94a3b8" strokeWidth="2" />
            <line x1="0" y1="60" x2="18" y2="60" stroke="#94a3b8" strokeWidth="2" />
            <line x1="78" y1="40" x2={width} y2="40" stroke="#94a3b8" strokeWidth="2" />
          </svg>
        );
      case 'or':
        return (
          <svg className="absolute inset-0 pointer-events-none" width={width} height={height}>
            {/* OR curved input and pointed output */}
            <path d="M 18,12 Q 32,30 18,48 Q 48,48 68,30 Q 48,12 18,12 Z" fill="#1e293b" stroke="#94a3b8" strokeWidth="2.5" />
            <line x1="0" y1="20" x2="22" y2="20" stroke="#94a3b8" strokeWidth="2" />
            <line x1="0" y1="40" x2="22" y2="40" stroke="#94a3b8" strokeWidth="2" />
            <line x1="68" y1="30" x2={width} y2="30" stroke="#94a3b8" strokeWidth="2" />
          </svg>
        );
      case 'or3':
        return (
          <svg className="absolute inset-0 pointer-events-none" width={width} height={height}>
            <path d="M 18,10 Q 36,40 18,70 Q 52,70 76,40 Q 52,10 18,10 Z" fill="#1e293b" stroke="#94a3b8" strokeWidth="2.5" />
            <line x1="0" y1="20" x2="24" y2="20" stroke="#94a3b8" strokeWidth="2" />
            <line x1="0" y1="40" x2="27" y2="40" stroke="#94a3b8" strokeWidth="2" />
            <line x1="0" y1="60" x2="24" y2="60" stroke="#94a3b8" strokeWidth="2" />
            <line x1="76" y1="40" x2={width} y2="40" stroke="#94a3b8" strokeWidth="2" />
          </svg>
        );
      case 'nand':
        return (
          <svg className="absolute inset-0 pointer-events-none" width={width} height={height}>
            <path d="M 18,12 L 44,12 A 18,18 0 0 1 44,48 L 18,48 Z" fill="#1e293b" stroke="#94a3b8" strokeWidth="2.5" />
            <circle cx="67" cy="30" r="4.5" fill="#0f172a" stroke="#94a3b8" strokeWidth="2.5" />
            <line x1="0" y1="20" x2="18" y2="20" stroke="#94a3b8" strokeWidth="2" />
            <line x1="0" y1="40" x2="18" y2="40" stroke="#94a3b8" strokeWidth="2" />
            <line x1="71.5" y1="30" x2={width} y2="30" stroke="#94a3b8" strokeWidth="2" />
          </svg>
        );
      case 'nor':
        return (
          <svg className="absolute inset-0 pointer-events-none" width={width} height={height}>
            <path d="M 18,12 Q 32,30 18,48 Q 48,48 68,30 Q 48,12 18,12 Z" fill="#1e293b" stroke="#94a3b8" strokeWidth="2.5" />
            <circle cx="73" cy="30" r="4.5" fill="#0f172a" stroke="#94a3b8" strokeWidth="2.5" />
            <line x1="0" y1="20" x2="22" y2="20" stroke="#94a3b8" strokeWidth="2" />
            <line x1="0" y1="40" x2="22" y2="40" stroke="#94a3b8" strokeWidth="2" />
            <line x1="77.5" y1="30" x2={width} y2="30" stroke="#94a3b8" strokeWidth="2" />
          </svg>
        );
      case 'xor':
        return (
          <svg className="absolute inset-0 pointer-events-none" width={width} height={height}>
            <path d="M 12,12 Q 26,30 12,48" fill="none" stroke="#94a3b8" strokeWidth="2.5" />
            <path d="M 18,12 Q 32,30 18,48 Q 48,48 68,30 Q 48,12 18,12 Z" fill="#1e293b" stroke="#94a3b8" strokeWidth="2.5" />
            <line x1="0" y1="20" x2="16" y2="20" stroke="#94a3b8" strokeWidth="2" />
            <line x1="0" y1="40" x2="16" y2="40" stroke="#94a3b8" strokeWidth="2" />
            <line x1="68" y1="30" x2={width} y2="30" stroke="#94a3b8" strokeWidth="2" />
          </svg>
        );
      case 'xnor':
        return (
          <svg className="absolute inset-0 pointer-events-none" width={width} height={height}>
            <path d="M 12,12 Q 26,30 12,48" fill="none" stroke="#94a3b8" strokeWidth="2.5" />
            <path d="M 18,12 Q 32,30 18,48 Q 48,48 68,30 Q 48,12 18,12 Z" fill="#1e293b" stroke="#94a3b8" strokeWidth="2.5" />
            <circle cx="73" cy="30" r="4.5" fill="#0f172a" stroke="#94a3b8" strokeWidth="2.5" />
            <line x1="0" y1="20" x2="16" y2="20" stroke="#94a3b8" strokeWidth="2" />
            <line x1="0" y1="40" x2="16" y2="40" stroke="#94a3b8" strokeWidth="2" />
            <line x1="77.5" y1="30" x2={width} y2="30" stroke="#94a3b8" strokeWidth="2" />
          </svg>
        );
      case 'buffer':
        return (
          <svg className="absolute inset-0 pointer-events-none" width={width} height={height}>
            <polygon points="15,10 65,25 15,40" fill="#1e293b" stroke="#94a3b8" strokeWidth="2.5" />
            <line x1="0" y1="25" x2="15" y2="25" stroke="#94a3b8" strokeWidth="2" />
            <line x1="65" y1="25" x2={width} y2="25" stroke="#94a3b8" strokeWidth="2" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Render 7-Segment Display SVG
  const render7SegmentSvg = (segments: Record<string, boolean>) => {
    const onColor = '#ef4444';
    const offColor = '#241416';
    const onGlow = 'drop-shadow(0 0 6px rgba(239, 68, 68, 0.9))';

    return (
      <svg className="w-16 h-24 my-auto mx-auto" viewBox="0 0 60 90">
        {/* Segment a (top) */}
        <polygon
          points="13,8 47,8 41,14 19,14"
          fill={segments.a ? onColor : offColor}
          style={{ filter: segments.a ? onGlow : 'none' }}
        />
        {/* Segment b (top-right) */}
        <polygon
          points="48,10 48,42 42,37 42,16"
          fill={segments.b ? onColor : offColor}
          style={{ filter: segments.b ? onGlow : 'none' }}
        />
        {/* Segment c (bottom-right) */}
        <polygon
          points="48,46 48,78 42,72 42,51"
          fill={segments.c ? onColor : offColor}
          style={{ filter: segments.c ? onGlow : 'none' }}
        />
        {/* Segment d (bottom) */}
        <polygon
          points="13,80 47,80 41,74 19,74"
          fill={segments.d ? onColor : offColor}
          style={{ filter: segments.d ? onGlow : 'none' }}
        />
        {/* Segment e (bottom-left) */}
        <polygon
          points="12,46 18,51 18,72 12,78"
          fill={segments.e ? onColor : offColor}
          style={{ filter: segments.e ? onGlow : 'none' }}
        />
        {/* Segment f (top-left) */}
        <polygon
          points="12,10 18,16 18,37 12,42"
          fill={segments.f ? onColor : offColor}
          style={{ filter: segments.f ? onGlow : 'none' }}
        />
        {/* Segment g (middle) */}
        <polygon
          points="15,44 19,41 41,41 45,44 41,47 19,47"
          fill={segments.g ? onColor : offColor}
          style={{ filter: segments.g ? onGlow : 'none' }}
        />
        {/* Decimal point */}
        <circle
          cx="54"
          cy="80"
          r="3"
          fill={segments.dp ? onColor : offColor}
          style={{ filter: segments.dp ? onGlow : 'none' }}
        />
      </svg>
    );
  };

  // Render LED bulb
  const renderLedBulb = (color: string, isOn: boolean) => {
    const colorStyles: Record<string, { bg: string; glow: string; border: string }> = {
      red: { bg: '#ef4444', glow: 'rgba(239, 68, 68, 0.9)', border: '#f87171' },
      green: { bg: '#22c55e', glow: 'rgba(34, 197, 94, 0.9)', border: '#4ade80' },
      blue: { bg: '#3b82f6', glow: 'rgba(59, 130, 246, 0.9)', border: '#60a5fa' },
      yellow: { bg: '#eab308', glow: 'rgba(234, 179, 8, 0.9)', border: '#facc15' }
    };
    const s = colorStyles[color] || colorStyles.red;

    return (
      <div className="flex flex-col items-center justify-center p-1">
        <div
          className="w-8 h-8 rounded-full border-2 transition-all duration-150 flex items-center justify-center"
          style={{
            backgroundColor: isOn ? s.bg : '#1e293b',
            borderColor: isOn ? s.border : '#475569',
            boxShadow: isOn ? `0 0 16px 4px ${s.glow}` : 'none'
          }}
        >
          {isOn && <div className="w-2.5 h-2.5 rounded-full bg-white opacity-80" />}
        </div>
        <span className="text-[10px] text-slate-400 font-mono mt-1 uppercase font-semibold">
          {isOn ? 'ON' : 'OFF'}
        </span>
      </div>
    );
  };

  // Render IC chip body
  const renderICBody = () => {
    return (
      <div className="w-full h-full bg-[#18181b] border-2 border-slate-700 rounded-md relative flex flex-col items-center justify-center shadow-lg overflow-hidden">
        {/* Notch on top of IC */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-2.5 bg-slate-900 border-b border-x border-slate-700 rounded-b-full" />
        <span className="font-mono text-[11px] font-bold text-amber-400 tracking-wider">
          {def.icNumber || component.type.toUpperCase()}
        </span>
        <span className="text-[8px] text-slate-500 font-mono tracking-widest uppercase">
          TTL DIP-{component.pins.length}
        </span>
      </div>
    );
  };

  // Render interactive Switch or Button
  const renderInteractiveInput = () => {
    if (component.type === 'switch') {
      const isOn = !!component.state?.isOn;
      return (
        <div
          onClick={(e) => {
            e.stopPropagation();
            soundEngine.vibrate(15);
            soundEngine.playClick(isOn);
            onToggleSwitch?.(component.id);
          }}
          className="flex flex-col items-center justify-center cursor-pointer select-none group"
        >
          <div
            className={`w-12 h-6 rounded-full transition-colors p-0.5 flex items-center border ${
              isOn ? 'bg-emerald-600 border-emerald-400' : 'bg-slate-700 border-slate-600'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                isOn ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </div>
          <span className="text-[10px] font-mono font-bold mt-1 text-slate-300">
            {isOn ? '1 (HIGH)' : '0 (LOW)'}
          </span>
        </div>
      );
    }

    if (component.type === 'push_button') {
      const isPressed = !!component.state?.isPressed;
      return (
        <div
          onPointerDown={(e) => {
            e.stopPropagation();
            soundEngine.vibrate(20);
            soundEngine.playClick(true);
            onPushButtonPress?.(component.id, true);
          }}
          onPointerUp={(e) => {
            e.stopPropagation();
            onPushButtonPress?.(component.id, false);
          }}
          onPointerLeave={(e) => {
            e.stopPropagation();
            onPushButtonPress?.(component.id, false);
          }}
          className={`w-12 h-12 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all active:scale-90 shadow-md ${
            isPressed
              ? 'bg-rose-600 border-rose-300 shadow-rose-500/50'
              : 'bg-rose-900/60 border-rose-600 hover:bg-rose-800'
          }`}
        >
          <Power className="w-5 h-5 text-white" />
        </div>
      );
    }

    if (component.type === 'clock') {
      const isHigh = !!component.state?.isHigh;
      const freq = component.state?.frequency || 1;
      return (
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center gap-1.5">
            <Clock className={`w-4 h-4 ${isHigh ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`} />
            <span className={`font-mono text-xs font-bold ${isHigh ? 'text-amber-400' : 'text-slate-400'}`}>
              {isHigh ? '1' : '0'}
            </span>
          </div>
          <span className="text-[9px] text-slate-400 font-mono mt-1">{freq} Hz</span>
        </div>
      );
    }

    if (component.type === 'vcc') {
      return (
        <div className="flex flex-col items-center justify-center">
          <span className="text-xs font-bold text-rose-500 font-mono">+5V</span>
          <span className="text-[9px] text-slate-400 font-mono">(1)</span>
        </div>
      );
    }

    if (component.type === 'gnd') {
      return (
        <div className="flex flex-col items-center justify-center">
          <span className="text-xs font-bold text-sky-400 font-mono">GND</span>
          <span className="text-[9px] text-slate-400 font-mono">(0)</span>
        </div>
      );
    }

    if (component.type === 'dip_switch_4') {
      const s0 = !!component.state?.s0;
      const s1 = !!component.state?.s1;
      const s2 = !!component.state?.s2;
      const s3 = !!component.state?.s3;
      return (
        <div className="flex flex-col gap-1.5 w-full px-2 py-1">
          {[
            { bit: 's0', label: 'D0', on: s0 },
            { bit: 's1', label: 'D1', on: s1 },
            { bit: 's2', label: 'D2', on: s2 },
            { bit: 's3', label: 'D3', on: s3 }
          ].map(sw => (
            <div
              key={sw.bit}
              onClick={(e) => {
                e.stopPropagation();
                soundEngine.vibrate(10);
                soundEngine.playClick(sw.on);
                onToggleDipSwitch?.(component.id, sw.bit);
              }}
              className="flex items-center justify-between text-[10px] font-mono bg-slate-900/80 px-1.5 py-0.5 rounded cursor-pointer border border-slate-700"
            >
              <span className="text-slate-400 font-bold">{sw.label}</span>
              <span className={`font-bold px-1 rounded ${sw.on ? 'bg-emerald-500 text-black' : 'text-slate-500'}`}>
                {sw.on ? '1' : '0'}
              </span>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  // Determine specific display contents
  const renderDisplay = () => {
    if (component.type === 'seven_segment' || component.type === 'til312_display') {
      const segs: Record<string, boolean> = {
        a: component.pins.find(p => p.id === 'a')?.value === 1,
        b: component.pins.find(p => p.id === 'b')?.value === 1,
        c: component.pins.find(p => p.id === 'c')?.value === 1,
        d: component.pins.find(p => p.id === 'd')?.value === 1,
        e: component.pins.find(p => p.id === 'e')?.value === 1,
        f: component.pins.find(p => p.id === 'f')?.value === 1,
        g: component.pins.find(p => p.id === 'g')?.value === 1,
        dp: component.pins.find(p => p.id === 'dp')?.value === 1
      };
      return render7SegmentSvg(segs);
    }

    if (component.type === 'bcd_display') {
      const d0 = component.pins.find(p => p.id === 'd0')?.value === 1 ? 1 : 0;
      const d1 = component.pins.find(p => p.id === 'd1')?.value === 1 ? 1 : 0;
      const d2 = component.pins.find(p => p.id === 'd2')?.value === 1 ? 1 : 0;
      const d3 = component.pins.find(p => p.id === 'd3')?.value === 1 ? 1 : 0;
      const numVal = (d3 << 3) | (d2 << 2) | (d1 << 1) | d0;
      const hexStr = numVal.toString(16).toUpperCase();

      return (
        <div className="flex flex-col items-center justify-center p-2">
          <div className="w-14 h-18 bg-black/90 border border-slate-700 rounded flex items-center justify-center shadow-inner">
            <span
              className="font-mono text-3xl font-black text-rose-500"
              style={{ filter: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.8))' }}
            >
              {hexStr}
            </span>
          </div>
          <span className="text-[9px] font-mono text-slate-400 mt-1">BCD: {numVal}</span>
        </div>
      );
    }

    if (component.type === 'buzzer') {
      const inVal = component.pins.find(p => p.id === 'in')?.value === 1;
      soundEngine.setBuzzerActive(inVal);
      return (
        <div className="flex flex-col items-center justify-center">
          <div
            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
              inVal
                ? 'bg-amber-500 border-amber-300 shadow-[0_0_16px_rgba(245,158,11,0.8)] animate-pulse'
                : 'bg-slate-800 border-slate-600'
            }`}
          >
            <Volume2 className={`w-5 h-5 ${inVal ? 'text-black' : 'text-slate-400'}`} />
          </div>
          <span className="text-[9px] font-mono text-slate-400 mt-1">{inVal ? 'BEEPING' : 'OFF'}</span>
        </div>
      );
    }

    if (component.type === 'probe') {
      const inVal = component.pins.find(p => p.id === 'in')?.value ?? 0;
      return (
        <div className="flex items-center justify-center">
          <div
            className={`px-2.5 py-1 rounded border font-mono font-bold text-xs shadow-md ${
              inVal === 1
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500'
                : inVal === 'Z'
                ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500'
                : 'bg-blue-500/20 text-blue-400 border-blue-500'
            }`}
          >
            {inVal === 1 ? 'HIGH (1)' : inVal === 'Z' ? 'HIGH-Z' : 'LOW (0)'}
          </div>
        </div>
      );
    }

    if (component.type === 'led') {
      const isOn = component.pins.find(p => p.id === 'in')?.value === 1;
      return renderLedBulb('red', isOn);
    }
    if (component.type === 'led_green') {
      const isOn = component.pins.find(p => p.id === 'in')?.value === 1;
      return renderLedBulb('green', isOn);
    }
    if (component.type === 'led_blue') {
      const isOn = component.pins.find(p => p.id === 'in')?.value === 1;
      return renderLedBulb('blue', isOn);
    }
    if (component.type === 'led_yellow') {
      const isOn = component.pins.find(p => p.id === 'in')?.value === 1;
      return renderLedBulb('yellow', isOn);
    }

    return null;
  };

  // Check if component has special rendering or standard box
  const isGate = def.category === 'gates' && def.symbolType === 'ansi';
  const isIC = def.category === 'chips74' && def.symbolType === 'ic';

  return (
    <div
      style={{
        transform: `translate3d(${component.x}px, ${component.y}px, 0)`,
        width: `${width}px`,
        height: `${height}px`,
        touchAction: 'none'
      }}
      onPointerDown={(e) => onSelect(component.id, e)}
      className={`absolute select-none cursor-move rounded-md transition-shadow ${
        isSelected
          ? 'ring-2 ring-sky-400 ring-offset-2 ring-offset-slate-900 shadow-xl'
          : 'hover:ring-1 hover:ring-slate-500'
      }`}
    >
      {/* Quick Component Mini Action Buttons when selected */}
      {isSelected && (
        <div
          onPointerDown={(e) => e.stopPropagation()}
          className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-slate-900/90 border border-slate-700 backdrop-blur-md px-1.5 py-1 rounded-full shadow-2xl z-40"
        >
          {onInspect && (
            <button
              onClick={() => onInspect(component.type)}
              title="Pinout Info"
              className="p-1 rounded-full hover:bg-slate-800 text-sky-400 transition-colors"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          )}
          {onDuplicate && (
            <button
              onClick={() => onDuplicate(component.id)}
              title="Duplicate"
              className="p-1 rounded-full hover:bg-slate-800 text-emerald-400 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(component.id)}
              title="Delete"
              className="p-1 rounded-full hover:bg-rose-950 text-rose-400 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Render Gate ANSI Symbol */}
      {isGate && renderGateSvg()}

      {/* Render 74-Series IC */}
      {isIC && renderICBody()}

      {/* Standard Box Container for generic modules & inputs/outputs */}
      {!isGate && !isIC && (
        <div className="w-full h-full bg-slate-800/90 border border-slate-700/80 rounded-md shadow-lg flex flex-col items-center justify-between p-1.5 backdrop-blur-sm">
          <div className="text-[9px] font-mono text-slate-400 font-semibold truncate max-w-[90%] text-center">
            {component.label || def.name}
          </div>

          <div className="flex-1 flex items-center justify-center w-full">
            {renderInteractiveInput()}
            {renderDisplay()}
          </div>

          {/* Internal state / module labels */}
          {def.category === 'sequential' && (
            <div className="text-[8px] font-mono text-slate-500">
              {component.state?.q !== undefined && `Q: ${component.state.q}`}
              {component.state?.count !== undefined && `CNT: ${component.state.count}`}
            </div>
          )}
        </div>
      )}

      {/* Render All Component Pins */}
      {component.pins.map((pin: Pin) => {
        const isSourceOfActiveWire =
          activeWireSource?.compId === component.id && activeWireSource?.pinId === pin.id;
        const val = pin.value;
        const pinColor =
          val === 1 ? '#22c55e' : val === 'Z' ? '#eab308' : '#3b82f6';

        return (
          <div
            key={pin.id}
            data-comp-id={component.id}
            data-pin-id={pin.id}
            style={{
              left: `${pin.x}px`,
              top: `${pin.y}px`
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-30"
          >
            {/* Generous touch target area (44px for phone thumbs) */}
            <div
              data-comp-id={component.id}
              data-pin-id={pin.id}
              onPointerDown={(e) => {
                e.stopPropagation();
                onPinPointerDown(component.id, pin.id, e);
              }}
              onClick={(e) => {
                e.stopPropagation();
                onPinTap(component.id, pin.id);
              }}
              className={`w-11 h-11 -translate-x-1/2 -translate-y-1/2 absolute left-1/2 top-1/2 cursor-pointer flex items-center justify-center touch-manipulation group ${
                isCutterMode ? 'hover:bg-rose-500/20 rounded-full' : ''
              }`}
            >
              {/* Visual Pin Circle */}
              <div
                style={{
                  backgroundColor: isCutterMode ? '#f43f5e' : pinColor,
                  boxShadow: isSourceOfActiveWire
                    ? '0 0 12px #fbbf24'
                    : val === 1
                    ? '0 0 8px #22c55e'
                    : 'none'
                }}
                className={`w-3.5 h-3.5 rounded-full border-2 border-slate-900 transition-all ${
                  isSourceOfActiveWire
                    ? 'ring-4 ring-amber-400 scale-125'
                    : isCutterMode
                    ? 'ring-2 ring-rose-500'
                    : 'group-hover:scale-125 group-active:scale-150'
                }`}
              />

              {/* Pulsing ring for active wire source */}
              {isSourceOfActiveWire && (
                <div className="absolute inset-2 rounded-full border-2 border-amber-400 animate-ping pointer-events-none" />
              )}
            </div>

            {/* Pin Name Label */}
            <span
              className={`absolute pointer-events-none text-[9px] font-mono font-bold px-1 rounded bg-slate-900/90 text-slate-300 shadow whitespace-nowrap z-20 ${
                pin.x > width / 2
                  ? '-left-6 -translate-y-1/2'
                  : 'left-3 -translate-y-1/2'
              }`}
            >
              {pin.name}
            </span>
          </div>
        );
      })}
    </div>
  );
};
