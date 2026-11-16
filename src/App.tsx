import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { CircuitComponent, Wire, ScopeSample, PresetExperiment } from './types/circuit';
import { COMPONENT_CATALOG } from './data/componentCatalog';
import { PRESET_EXPERIMENTS } from './data/presetExperiments';
import { simulateStep } from './engine/simulation';
import { soundEngine } from './engine/audio';

import { Canvas } from './components/Canvas';
import { Toolbar } from './components/Toolbar';
import { MobileActionBar } from './components/MobileActionBar';
import { ComponentDrawer } from './components/ComponentDrawer';
import { PresetModal } from './components/PresetModal';
import { TruthTableModal } from './components/TruthTableModal';
import { LogicAnalyzerModal } from './components/LogicAnalyzerModal';
import { PhoneConnectModal } from './components/PhoneConnectModal';
import { ComponentHelpModal } from './components/ComponentHelpModal';

export const App: React.FC = () => {
  // Start with default Exp 1 loaded
  const defaultExp = PRESET_EXPERIMENTS[0];

  const [components, setComponents] = useState<CircuitComponent[]>(defaultExp.components);
  const [wires, setWires] = useState<Wire[]>(defaultExp.wires);

  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [selectedWireId, setSelectedWireId] = useState<string | null>(null);

  // Wire creation state
  const [activeWireSource, setActiveWireSource] = useState<{ compId: string; pinId: string } | null>(null);

  // Wire cutter / disconnect mode
  const [isCutterMode, setIsCutterMode] = useState<boolean>(false);

  // Canvas viewport
  const [zoom, setZoom] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 30, y: 70 });

  // Simulation controls
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Oscilloscope waveform samples
  const [scopeSamples, setScopeSamples] = useState<ScopeSample[]>([]);
  const [isSampling, setIsSampling] = useState<boolean>(true);

  // Modals
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isPresetModalOpen, setIsPresetModalOpen] = useState<boolean>(false);
  const [isTruthTableOpen, setIsTruthTableOpen] = useState<boolean>(false);
  const [isScopeOpen, setIsScopeOpen] = useState<boolean>(false);
  const [isPhoneHelpOpen, setIsPhoneHelpOpen] = useState<boolean>(false);
  const [inspectType, setInspectType] = useState<string | null>(null);

  // Hidden file input for importing JSON circuits
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step simulation reference
  const lastClockTickRef = useRef<number>(0);

  // Simulation tick loop
  useEffect(() => {
    lastClockTickRef.current = Date.now();
    const interval = setInterval(() => {
      if (!isRunning) return;

      const now = Date.now();
      // Tick clocks roughly every 500ms (1Hz)
      const clockTicked = now - lastClockTickRef.current >= 500;
      if (clockTicked) {
        lastClockTickRef.current = now;
      }

      setComponents((prevComps) => {
        const { components: updatedComps, wires: updatedWires } = simulateStep(
          prevComps,
          wires,
          clockTicked
        );

        setWires(updatedWires);

        // Record waveform sample for scope
        if (isSampling) {
          const sampleChannels: Record<string, any> = {};
          updatedComps.forEach((c) => {
            c.pins.forEach((p) => {
              sampleChannels[`${c.id}:${p.id}`] = p.value;
            });
          });

          setScopeSamples((prev) => {
            const next = [...prev, { timestamp: now, channels: sampleChannels }];
            return next.length > 50 ? next.slice(-50) : next;
          });
        }

        return updatedComps;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, wires, isSampling]);

  // Handle single manual clock step
  const handleStepClock = useCallback(() => {
    setComponents((prevComps) => {
      const { components: updatedComps, wires: updatedWires } = simulateStep(prevComps, wires, true);
      setWires(updatedWires);
      return updatedComps;
    });
  }, [wires]);

  // Add Component (centers in current viewport)
  const handleAddComponent = useCallback((type: string) => {
    const def = COMPONENT_CATALOG[type];
    if (!def) return;

    const viewportCenterX = (-pan.x + window.innerWidth / 2) / zoom - def.width / 2;
    const viewportCenterY = (-pan.y + window.innerHeight / 2) / zoom - def.height / 2;

    const newComp: CircuitComponent = {
      id: `${type}_${Date.now().toString(36).slice(-5)}`,
      type,
      x: Math.round(viewportCenterX / 12) * 12,
      y: Math.round(viewportCenterY / 12) * 12,
      pins: def.pins.map((p) => ({ ...p, value: 0 })),
      state: { ...def.defaultState },
      label: def.name
    };

    setComponents((prev) => [...prev, newComp]);
    setSelectedComponentId(newComp.id);
  }, [pan, zoom]);

  // Move Component
  const handleMoveComponent = useCallback((id: string, x: number, y: number) => {
    setComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, x, y } : c))
    );
  }, []);

  // Duplicate Component
  const handleDuplicateComponent = useCallback((id: string) => {
    const orig = components.find((c) => c.id === id);
    if (!orig) return;
    const def = COMPONENT_CATALOG[orig.type];
    if (!def) return;

    soundEngine.vibrate(15);
    soundEngine.playClick(true);

    const cloned: CircuitComponent = {
      id: `${orig.type}_${Date.now().toString(36).slice(-5)}`,
      type: orig.type,
      x: orig.x + 36,
      y: orig.y + 36,
      pins: def.pins.map((p) => ({ ...p, value: 0 })),
      state: { ...orig.state },
      label: orig.label
    };

    setComponents((prev) => [...prev, cloned]);
    setSelectedComponentId(cloned.id);
  }, [components]);

  // Delete Component (and any wires connected to it)
  const handleDeleteComponent = useCallback((id: string) => {
    soundEngine.vibrate(20);
    soundEngine.playDelete();
    setComponents((prev) => prev.filter((c) => c.id !== id));
    setWires((prev) => prev.filter((w) => w.fromComponentId !== id && w.toComponentId !== id));
    if (selectedComponentId === id) setSelectedComponentId(null);
  }, [selectedComponentId]);

  // Delete Wire
  const handleDeleteWire = useCallback((wireId: string) => {
    soundEngine.vibrate(20);
    soundEngine.playDelete();
    setWires((prev) => prev.filter((w) => w.id !== wireId));
    if (selectedWireId === wireId) setSelectedWireId(null);
  }, [selectedWireId]);

  // Disconnect all wires attached to a specific pin
  const handleDisconnectPinWires = useCallback((compId: string, pinId: string) => {
    soundEngine.vibrate(25);
    soundEngine.playDelete();
    setWires((prev) =>
      prev.filter(
        (w) =>
          !(
            (w.fromComponentId === compId && w.fromPinId === pinId) ||
            (w.toComponentId === compId && w.toPinId === pinId)
          )
      )
    );
  }, []);

  // Delete selected wire or component
  const handleDeleteSelection = useCallback(() => {
    if (selectedComponentId) {
      handleDeleteComponent(selectedComponentId);
    } else if (selectedWireId) {
      handleDeleteWire(selectedWireId);
    }
  }, [selectedComponentId, selectedWireId, handleDeleteComponent, handleDeleteWire]);

  // Connect Pins to make a Wire
  const handleConnectPins = useCallback((
    fromCompId: string,
    fromPinId: string,
    toCompId: string,
    toPinId: string
  ) => {
    const compA = components.find((c) => c.id === fromCompId);
    const compB = components.find((c) => c.id === toCompId);
    if (!compA || !compB) return;

    const pinA = compA.pins.find((p) => p.id === fromPinId);
    const pinB = compB.pins.find((p) => p.id === toPinId);
    if (!pinA || !pinB) return;

    // Check directions: One must be output, one must be input
    let outComp = compA;
    let outPin = pinA;
    let inComp = compB;
    let inPin = pinB;

    if (pinA.type === 'input' && pinB.type === 'output') {
      outComp = compB;
      outPin = pinB;
      inComp = compA;
      inPin = pinA;
    } else if (pinA.type === 'input' && pinB.type === 'input') {
      // Both are inputs - invalid
      soundEngine.vibrate([40, 40]);
      setActiveWireSource(null);
      return;
    } else if (pinA.type === 'output' && pinB.type === 'output') {
      // Both are outputs - invalid
      soundEngine.vibrate([40, 40]);
      setActiveWireSource(null);
      return;
    }

    // Check if duplicate wire already exists
    const exists = wires.some(
      (w) =>
        w.fromComponentId === outComp.id &&
        w.fromPinId === outPin.id &&
        w.toComponentId === inComp.id &&
        w.toPinId === inPin.id
    );

    if (exists) {
      setActiveWireSource(null);
      return;
    }

    // Pick distinct color based on source
    const wireColors = ['#38bdf8', '#22c55e', '#f59e0b', '#ec4899', '#a855f7', '#14b8a6'];
    const chosenColor = wireColors[wires.length % wireColors.length];

    const newWire: Wire = {
      id: `w_${Date.now().toString(36).slice(-5)}`,
      fromComponentId: outComp.id,
      fromPinId: outPin.id,
      toComponentId: inComp.id,
      toPinId: inPin.id,
      color: chosenColor,
      value: outPin.value
    };

    soundEngine.vibrate(20);
    soundEngine.playConnect();

    // Replace any existing wire connected to this input pin (clean rewire behavior)
    setWires((prev) => [
      ...prev.filter((w) => !(w.toComponentId === inComp.id && w.toPinId === inPin.id)),
      newWire
    ]);

    setActiveWireSource(null);
  }, [components, wires]);

  // Toggle Switch
  const handleToggleSwitch = useCallback((compId: string) => {
    setComponents((prev) =>
      prev.map((c) => {
        if (c.id === compId && c.type === 'switch') {
          return {
            ...c,
            state: { ...c.state, isOn: !c.state.isOn }
          };
        }
        return c;
      })
    );
  }, []);

  // Momentary Push Button
  const handlePushButtonPress = useCallback((compId: string, pressed: boolean) => {
    setComponents((prev) =>
      prev.map((c) => {
        if (c.id === compId && c.type === 'push_button') {
          return {
            ...c,
            state: { ...c.state, isPressed: pressed }
          };
        }
        return c;
      })
    );
  }, []);

  // 4-bit DIP Switch
  const handleToggleDipSwitch = useCallback((compId: string, bit: string) => {
    setComponents((prev) =>
      prev.map((c) => {
        if (c.id === compId && c.type === 'dip_switch_4') {
          return {
            ...c,
            state: { ...c.state, [bit]: !c.state[bit] }
          };
        }
        return c;
      })
    );
  }, []);

  // Clear Canvas
  const handleClear = useCallback(() => {
    soundEngine.vibrate(30);
    soundEngine.playDelete();
    setComponents([]);
    setWires([]);
    setSelectedComponentId(null);
    setSelectedWireId(null);
    setActiveWireSource(null);
    setScopeSamples([]);
  }, []);

  // Load Preset Experiment
  const handleLoadExperiment = useCallback((exp: PresetExperiment) => {
    setComponents(exp.components);
    setWires(exp.wires);
    setSelectedComponentId(null);
    setSelectedWireId(null);
    setActiveWireSource(null);
    setPan({ x: 30, y: 70 });
    setZoom(1.0);
  }, []);

  // Save / Export JSON
  const handleExportJson = useCallback(() => {
    const data = JSON.stringify({ components, wires }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `circuit_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [components, wires]);

  // Import JSON
  const handleImportJson = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (parsed.components && parsed.wires) {
          setComponents(parsed.components);
          setWires(parsed.wires);
          soundEngine.playConnect();
        }
      } catch {
        alert('Invalid circuit JSON file');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Keyboard shortcut listeners (Backspace/Delete to remove selection)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        handleDeleteSelection();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsRunning((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDeleteSelection]);

  return (
    <div className="relative w-full h-full bg-[#0c0f17] overflow-hidden select-none font-sans">
      {/* Hidden File Input for Import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />

      {/* Top Toolbar */}
      <Toolbar
        zoom={zoom}
        soundEnabled={soundEnabled}
        isCutterMode={isCutterMode}
        onZoomIn={() => setZoom((z) => Math.min(Number((z + 0.15).toFixed(2)), 2.5))}
        onZoomOut={() => setZoom((z) => Math.max(Number((z - 0.15).toFixed(2)), 0.4))}
        onResetZoom={() => {
          setZoom(1.0);
          setPan({ x: 30, y: 70 });
        }}
        onToggleSound={() => {
          const next = !soundEnabled;
          setSoundEnabled(next);
          soundEngine.soundEnabled = next;
        }}
        onToggleCutterMode={() => setIsCutterMode((prev) => !prev)}
        onClear={handleClear}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        onOpenPhoneHelp={() => setIsPhoneHelpOpen(true)}
      />

      {/* Interactive Circuit Canvas */}
      <Canvas
        components={components}
        wires={wires}
        selectedComponentId={selectedComponentId}
        selectedWireId={selectedWireId}
        activeWireSource={activeWireSource}
        isCutterMode={isCutterMode}
        onSelectComponent={setSelectedComponentId}
        onSelectWire={setSelectedWireId}
        onDeleteWire={handleDeleteWire}
        onDisconnectPinWires={handleDisconnectPinWires}
        onMoveComponent={handleMoveComponent}
        onConnectPins={handleConnectPins}
        onCancelWireDraft={() => setActiveWireSource(null)}
        onStartWireDraft={(compId, pinId) => setActiveWireSource({ compId, pinId })}
        onToggleCutterMode={() => setIsCutterMode((prev) => !prev)}
        onToggleSwitch={handleToggleSwitch}
        onPushButtonPress={handlePushButtonPress}
        onToggleDipSwitch={handleToggleDipSwitch}
        onDeleteComponent={handleDeleteComponent}
        onDuplicateComponent={handleDuplicateComponent}
        onInspectComponent={(type) => setInspectType(type)}
        zoom={zoom}
        pan={pan}
        onZoomChange={setZoom}
        onPanChange={setPan}
      />

      {/* Mobile Floating Bottom Action Bar */}
      <MobileActionBar
        isRunning={isRunning}
        hasSelection={!!selectedComponentId || !!selectedWireId}
        isCutterMode={isCutterMode}
        onTogglePlay={() => setIsRunning((prev) => !prev)}
        onStep={handleStepClock}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onDeleteSelection={handleDeleteSelection}
        onToggleCutterMode={() => setIsCutterMode((prev) => !prev)}
        onOpenTruthTable={() => setIsTruthTableOpen(true)}
        onOpenScope={() => setIsScopeOpen(true)}
        onOpenPresets={() => setIsPresetModalOpen(true)}
        onOpenPhoneHelp={() => setIsPhoneHelpOpen(true)}
      />

      {/* Modals & Drawers */}
      <ComponentDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onAddComponent={handleAddComponent}
      />

      <PresetModal
        isOpen={isPresetModalOpen}
        onClose={() => setIsPresetModalOpen(false)}
        onLoadExperiment={handleLoadExperiment}
      />

      <TruthTableModal
        isOpen={isTruthTableOpen}
        onClose={() => setIsTruthTableOpen(false)}
        components={components}
        wires={wires}
      />

      <LogicAnalyzerModal
        isOpen={isScopeOpen}
        onClose={() => setIsScopeOpen(false)}
        samples={scopeSamples}
        components={components}
        isSampling={isSampling}
        onToggleSampling={() => setIsSampling((prev) => !prev)}
        onClearSamples={() => setScopeSamples([])}
      />

      <PhoneConnectModal
        isOpen={isPhoneHelpOpen}
        onClose={() => setIsPhoneHelpOpen(false)}
      />

      <ComponentHelpModal
        type={inspectType}
        onClose={() => setInspectType(null)}
      />
    </div>
  );
};

export default App;
