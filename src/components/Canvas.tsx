import React, { useRef, useState } from 'react';
import type { CircuitComponent, Wire } from '../types/circuit';
import { ComponentView } from './ComponentView';
import { soundEngine } from '../engine/audio';
import { COMPONENT_CATALOG } from '../data/componentCatalog';

interface CanvasProps {
  components: CircuitComponent[];
  wires: Wire[];
  selectedComponentId: string | null;
  selectedWireId: string | null;
  activeWireSource: { compId: string; pinId: string } | null;
  isCutterMode: boolean;
  onSelectComponent: (id: string | null) => void;
  onSelectWire: (id: string | null) => void;
  onDeleteWire: (id: string) => void;
  onDisconnectPinWires: (compId: string, pinId: string) => void;
  onMoveComponent: (id: string, x: number, y: number) => void;
  onConnectPins: (fromCompId: string, fromPinId: string, toCompId: string, toPinId: string) => void;
  onCancelWireDraft: () => void;
  onStartWireDraft: (compId: string, pinId: string) => void;
  onToggleCutterMode: () => void;
  onToggleSwitch?: (compId: string) => void;
  onPushButtonPress?: (compId: string, pressed: boolean) => void;
  onToggleDipSwitch?: (compId: string, bit: string) => void;
  onDeleteComponent?: (id: string) => void;
  onDuplicateComponent?: (id: string) => void;
  onInspectComponent?: (type: string) => void;
  zoom: number;
  pan: { x: number; y: number };
  onZoomChange: (zoom: number) => void;
  onPanChange: (pan: { x: number; y: number }) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  components,
  wires,
  selectedComponentId,
  selectedWireId,
  activeWireSource,
  isCutterMode,
  onSelectComponent,
  onSelectWire,
  onDeleteWire,
  onDisconnectPinWires,
  onMoveComponent,
  onConnectPins,
  onCancelWireDraft,
  onStartWireDraft,
  onToggleCutterMode,
  onToggleSwitch,
  onPushButtonPress,
  onToggleDipSwitch,
  onDeleteComponent,
  onDuplicateComponent,
  onInspectComponent,
  zoom,
  pan,
  onZoomChange,
  onPanChange
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Pin pointer down ref to distinguish clean tap from drag
  const pinDownRef = useRef<{ compId: string; pinId: string; clientX: number; clientY: number; time: number } | null>(null);

  // Dragging state for components, pan, or wire draft
  const [dragState, setDragState] = useState<{
    type: 'pan' | 'component' | 'wireDraft';
    targetId?: string;
    startX: number;
    startY: number;
    initialPanX?: number;
    initialPanY?: number;
    compStartX?: number;
    compStartY?: number;
    draftFrom?: { compId: string; pinId: string; x: number; y: number };
    currentPointer?: { x: number; y: number };
  } | null>(null);

  // Multi-touch pinch tracking for mobile pinch-to-zoom
  const touchPinchRef = useRef<{ initialDistance: number; initialZoom: number } | null>(null);

  // Convert screen coordinates to canvas coordinates (accounting for pan & zoom)
  const screenToCanvas = (screenX: number, screenY: number) => {
    if (!containerRef.current) return { x: screenX, y: screenY };
    const rect = containerRef.current.getBoundingClientRect();
    const x = (screenX - rect.left - pan.x) / zoom;
    const y = (screenY - rect.top - pan.y) / zoom;
    return { x, y };
  };

  // Find exact pin absolute coordinates in circuit space
  const getPinPos = (compId: string, pinId: string): { x: number; y: number } | null => {
    const comp = components.find((c) => c.id === compId);
    if (!comp) return null;
    const pin = comp.pins.find((p) => p.id === pinId);
    if (!pin) return null;
    return {
      x: comp.x + pin.x,
      y: comp.y + pin.y
    };
  };

  // Handle Canvas background pointer down (Pan)
  const handleCanvasPointerDown = (e: React.PointerEvent) => {
    if (e.target !== containerRef.current && (e.target as HTMLElement).tagName !== 'svg') {
      return;
    }

    onSelectComponent(null);
    onSelectWire(null);
    if (activeWireSource) {
      onCancelWireDraft();
    }

    setDragState({
      type: 'pan',
      startX: e.clientX,
      startY: e.clientY,
      initialPanX: pan.x,
      initialPanY: pan.y
    });
  };

  // Handle component selection and drag start
  const handleComponentSelect = (compId: string, e: React.MouseEvent | React.TouchEvent) => {
    const comp = components.find((c) => c.id === compId);
    if (!comp) return;

    onSelectComponent(compId);
    onSelectWire(null);

    const clientX = 'clientX' in e ? e.clientX : (e as React.TouchEvent).touches[0].clientX;
    const clientY = 'clientY' in e ? e.clientY : (e as React.TouchEvent).touches[0].clientY;

    setDragState({
      type: 'component',
      targetId: compId,
      startX: clientX,
      startY: clientY,
      compStartX: comp.x,
      compStartY: comp.y
    });
  };

  // Handle Pin Pointer Down (tracks tap vs drag)
  const handlePinPointerDown = (compId: string, pinId: string, e: React.PointerEvent) => {
    e.stopPropagation();

    pinDownRef.current = {
      compId,
      pinId,
      clientX: e.clientX,
      clientY: e.clientY,
      time: Date.now()
    };

    if (isCutterMode) {
      // In cutter mode, don't initiate wire draft
      return;
    }

    const pos = getPinPos(compId, pinId);
    if (!pos) return;

    const canvasPt = screenToCanvas(e.clientX, e.clientY);

    setDragState({
      type: 'wireDraft',
      draftFrom: { compId, pinId, x: pos.x, y: pos.y },
      startX: e.clientX,
      startY: e.clientY,
      currentPointer: canvasPt
    });
  };

  // Handle Pin Tap
  const handlePinTap = (compId: string, pinId: string) => {
    if (isCutterMode) {
      // Cut all wires connected to this pin!
      soundEngine.vibrate(30);
      soundEngine.playDelete();
      onDisconnectPinWires(compId, pinId);
      return;
    }

    if (!activeWireSource) {
      // First pin tapped: Start wire
      soundEngine.vibrate(25);
      soundEngine.playClick(true);
      onStartWireDraft(compId, pinId);
    } else {
      // Second pin tapped: Connect wire!
      if (activeWireSource.compId === compId && activeWireSource.pinId === pinId) {
        onCancelWireDraft();
        return;
      }
      onConnectPins(activeWireSource.compId, activeWireSource.pinId, compId, pinId);
    }
  };

  // Handle Pointer Move (Pan / Component Drag / Wire Draft)
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragState) return;

    if (dragState.type === 'pan') {
      const dx = e.clientX - dragState.startX;
      const dy = e.clientY - dragState.startY;
      onPanChange({
        x: (dragState.initialPanX || 0) + dx,
        y: (dragState.initialPanY || 0) + dy
      });
    } else if (dragState.type === 'component' && dragState.targetId) {
      const dx = (e.clientX - dragState.startX) / zoom;
      const dy = (e.clientY - dragState.startY) / zoom;
      const rawX = (dragState.compStartX || 0) + dx;
      const rawY = (dragState.compStartY || 0) + dy;
      const snappedX = Math.round(rawX / 12) * 12;
      const snappedY = Math.round(rawY / 12) * 12;

      onMoveComponent(dragState.targetId, snappedX, snappedY);
    } else if (dragState.type === 'wireDraft') {
      const canvasPt = screenToCanvas(e.clientX, e.clientY);
      setDragState((prev) => (prev ? { ...prev, currentPointer: canvasPt } : null));
    }
  };

  // Handle Pointer Up
  const handlePointerUp = (e: React.PointerEvent) => {
    if (pinDownRef.current) {
      const dist = Math.hypot(
        e.clientX - pinDownRef.current.clientX,
        e.clientY - pinDownRef.current.clientY
      );

      if (dist < 14) {
        // Confirmed tap on pin!
        handlePinTap(pinDownRef.current.compId, pinDownRef.current.pinId);
      } else if (!isCutterMode) {
        // Drag release over target pin
        const elem = document.elementFromPoint(e.clientX, e.clientY);
        const pinTarget = elem?.closest('[data-pin-id]');
        if (pinTarget) {
          const targetCompId = pinTarget.getAttribute('data-comp-id');
          const targetPinId = pinTarget.getAttribute('data-pin-id');
          if (
            targetCompId &&
            targetPinId &&
            (targetCompId !== pinDownRef.current.compId || targetPinId !== pinDownRef.current.pinId)
          ) {
            onConnectPins(
              pinDownRef.current.compId,
              pinDownRef.current.pinId,
              targetCompId,
              targetPinId
            );
          }
        }
      }
      pinDownRef.current = null;
    }

    setDragState(null);
  };

  // Touch gesture handlers for mobile pinch-to-zoom
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      touchPinchRef.current = { initialDistance: dist, initialZoom: zoom };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchPinchRef.current) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const scale = dist / touchPinchRef.current.initialDistance;
      const newZoom = Math.min(Math.max(touchPinchRef.current.initialZoom * scale, 0.4), 2.5);
      onZoomChange(Number(newZoom.toFixed(2)));
    }
  };

  const handleTouchEnd = () => {
    touchPinchRef.current = null;
  };

  // Wheel zoom handler for desktop/laptop
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    const newZoom = Math.min(Math.max(zoom * zoomFactor, 0.4), 2.5);
    onZoomChange(Number(newZoom.toFixed(2)));
  };

  // Build Bezier curve path string for wires
  const renderWirePath = (x1: number, y1: number, x2: number, y2: number) => {
    const dx = Math.abs(x2 - x1) * 0.5;
    const cx1 = x1 + Math.max(dx, 40);
    const cx2 = x2 - Math.max(dx, 40);
    return `M ${x1} ${y1} C ${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2}`;
  };

  // Get active source label
  const getActiveSourceLabel = () => {
    if (!activeWireSource) return '';
    const comp = components.find((c) => c.id === activeWireSource.compId);
    const pin = comp?.pins.find((p) => p.id === activeWireSource.pinId);
    const def = comp ? COMPONENT_CATALOG[comp.type] : null;
    return `${comp?.label || def?.name || 'Component'} (Pin ${pin?.name || ''})`;
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handleCanvasPointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
      className={`relative w-full h-full overflow-hidden select-none circuit-grid circuit-grid-major ${
        isCutterMode ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'
      }`}
      style={{ touchAction: 'none' }}
    >
      {/* Transformed Canvas Container */}
      <div
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0'
        }}
        className="absolute inset-0 pointer-events-auto"
      >
        {/* SVG Layer for Wires */}
        <svg
          className="absolute inset-0 overflow-visible pointer-events-none"
          style={{ width: '100%', height: '100%' }}
        >
          {/* Render All Connected Wires */}
          {wires.map((wire) => {
            const fromPos = getPinPos(wire.fromComponentId, wire.fromPinId);
            const toPos = getPinPos(wire.toComponentId, wire.toPinId);
            if (!fromPos || !toPos) return null;

            const isHigh = wire.value === 1;
            const isFloating = wire.value === 'Z';
            const isSelected = selectedWireId === wire.id;

            const strokeColor = isSelected
              ? '#f43f5e'
              : wire.color || (isHigh ? '#22c55e' : isFloating ? '#eab308' : '#3b82f6');

            const pathD = renderWirePath(fromPos.x, fromPos.y, toPos.x, toPos.y);

            // Midpoint of wire for clickable delete badge
            const midX = (fromPos.x + toPos.x) / 2;
            const midY = (fromPos.y + toPos.y) / 2;

            return (
              <g key={wire.id} className="cursor-pointer pointer-events-auto">
                {/* Generous 44px wide touch target area for mobile fingers! */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="44"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isCutterMode) {
                      soundEngine.vibrate(25);
                      soundEngine.playDelete();
                      onDeleteWire(wire.id);
                    } else {
                      soundEngine.vibrate(15);
                      onSelectWire(wire.id);
                      onSelectComponent(null);
                    }
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    soundEngine.vibrate(25);
                    soundEngine.playDelete();
                    onDeleteWire(wire.id);
                  }}
                />

                {/* Outer Glow when High or Selected */}
                {(isHigh || isSelected) && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke={isSelected ? '#f43f5e' : '#22c55e'}
                    strokeWidth={isSelected ? '12' : '8'}
                    strokeOpacity={isSelected ? '0.6' : '0.4'}
                    strokeLinecap="round"
                  />
                )}

                {/* Base Wire Path */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={isSelected ? '5' : '3.5'}
                  strokeLinecap="round"
                />

                {/* Animated electron pulses when Logic 1 (HIGH) */}
                {isHigh && !isSelected && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    strokeDasharray="6 14"
                    strokeLinecap="round"
                    className="wire-animated opacity-90"
                  />
                )}

                {/* Clickable Disconnect Badge on Wire Selection */}
                {isSelected && (
                  <g
                    transform={`translate(${midX}, ${midY})`}
                    className="cursor-pointer pointer-events-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      soundEngine.vibrate(25);
                      soundEngine.playDelete();
                      onDeleteWire(wire.id);
                    }}
                  >
                    <circle r="16" fill="#f43f5e" stroke="#ffffff" strokeWidth="2.5" className="animate-bounce" />
                    <text
                      x="0"
                      y="4"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="13"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      ✕
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Render Live Dragging Wire Draft */}
          {dragState?.type === 'wireDraft' && dragState.draftFrom && dragState.currentPointer && (
            <path
              d={renderWirePath(
                dragState.draftFrom.x,
                dragState.draftFrom.y,
                dragState.currentPointer.x,
                dragState.currentPointer.y
              )}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="4"
              strokeDasharray="6 6"
              className="animate-pulse"
            />
          )}

          {/* Render Active Wire source ping in Tap-to-Wire Mode */}
          {activeWireSource && (
            (() => {
              const fromPos = getPinPos(activeWireSource.compId, activeWireSource.pinId);
              if (!fromPos) return null;
              return (
                <circle
                  cx={fromPos.x}
                  cy={fromPos.y}
                  r="18"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="3"
                  className="animate-ping"
                />
              );
            })()
          )}
        </svg>

        {/* Render Components Layer */}
        {components.map((comp) => (
          <ComponentView
            key={comp.id}
            component={comp}
            isSelected={selectedComponentId === comp.id}
            activeWireSource={activeWireSource}
            isCutterMode={isCutterMode}
            onSelect={handleComponentSelect}
            onPinPointerDown={handlePinPointerDown}
            onPinTap={handlePinTap}
            onToggleSwitch={onToggleSwitch}
            onPushButtonPress={onPushButtonPress}
            onToggleDipSwitch={onToggleDipSwitch}
            onDelete={onDeleteComponent}
            onDuplicate={onDuplicateComponent}
            onInspect={onInspectComponent}
          />
        ))}
      </div>

      {/* Floating Mode Banners for Phone Users */}
      {isCutterMode ? (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-rose-600 text-white font-bold px-4 py-2 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-2.5 z-50 text-xs sm:text-sm animate-pulse border border-rose-300">
          <span>✂️ WIRE CUTTER: Tap any wire or pin to disconnect</span>
          <button
            onClick={() => {
              soundEngine.vibrate(10);
              onToggleCutterMode();
            }}
            className="bg-slate-950 text-white font-bold rounded-full px-2.5 py-0.5 text-xs ml-1 hover:bg-slate-800"
          >
            Exit Cutter
          </button>
        </div>
      ) : activeWireSource ? (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-2.5 z-50 text-xs sm:text-sm border border-amber-300">
          <span>🔗 Connect from <strong>{getActiveSourceLabel()}</strong> ➔ Tap target pin</span>
          <button
            onClick={() => {
              soundEngine.vibrate(10);
              onCancelWireDraft();
            }}
            className="bg-slate-900 text-white rounded-full px-2.5 py-0.5 text-xs ml-1"
          >
            Cancel
          </button>
        </div>
      ) : selectedWireId ? (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-slate-900 border border-rose-500 text-white font-bold px-4 py-2 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-3 z-50 text-xs sm:text-sm">
          <span className="text-rose-400">Wire Selected</span>
          <button
            onClick={() => {
              soundEngine.vibrate(20);
              soundEngine.playDelete();
              onDeleteWire(selectedWireId);
              onSelectWire(null);
            }}
            className="bg-rose-600 hover:bg-rose-500 text-white rounded-full px-3 py-0.5 text-xs font-bold"
          >
            Delete Wire
          </button>
          <button
            onClick={() => onSelectWire(null)}
            className="text-slate-400 hover:text-white text-xs"
          >
            Deselect
          </button>
        </div>
      ) : null}
    </div>
  );
};
