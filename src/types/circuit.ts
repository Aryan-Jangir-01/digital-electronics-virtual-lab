// Circuit types and data structures

export type LogicLevel = 0 | 1 | 'Z'; // 0: LOW, 1: HIGH, Z: High Impedance / Floating

export type PinType = 'input' | 'output';

export interface Pin {
  id: string;
  name: string;
  type: PinType;
  x: number; // relative to component top-left
  y: number; // relative to component top-left
  value: LogicLevel;
  invert?: boolean; // small circle on gate
  isClock?: boolean; // clock triangle symbol
}

export type ComponentCategory =
  | 'inputs'
  | 'gates'
  | 'combinational'
  | 'sequential'
  | 'outputs'
  | 'chips74';

export interface ComponentDefinition {
  type: string;
  name: string;
  category: ComponentCategory;
  description: string;
  width: number;
  height: number;
  pins: Omit<Pin, 'value'>[];
  defaultState?: Record<string, any>;
  icNumber?: string;
  symbolType?: 'ansi' | 'box' | 'ic';
}

export interface CircuitComponent {
  id: string;
  type: string;
  x: number;
  y: number;
  pins: Pin[];
  state: Record<string, any>; // custom internal state (e.g. switch isOn, counter value, latch state, frequency)
  label?: string;
}

export interface Wire {
  id: string;
  fromComponentId: string;
  fromPinId: string;
  toComponentId: string;
  toPinId: string;
  color?: string;
  value?: LogicLevel;
}

export interface PresetExperiment {
  id: string;
  title: string;
  category: string;
  description: string;
  objective: string;
  theory: string;
  truthTable?: { inputs: string[]; outputs: string[]; rows: (number | string)[][] };
  components: CircuitComponent[];
  wires: Wire[];
}

export interface ScopeSample {
  timestamp: number;
  channels: Record<string, LogicLevel>; // componentId:pinId -> value
}
