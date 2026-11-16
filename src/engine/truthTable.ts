import type { CircuitComponent, Wire, LogicLevel } from '../types/circuit';
import { simulateStep } from './simulation';

export interface TruthTableResult {
  inputs: { id: string; label: string; compId: string }[];
  outputs: { id: string; label: string; compId: string; pinId: string }[];
  rows: {
    inputValues: Record<string, LogicLevel>;
    outputValues: Record<string, LogicLevel>;
  }[];
}

/**
 * Automatically computes the truth table for the current circuit.
 */
export function generateTruthTable(
  components: CircuitComponent[],
  wires: Wire[]
): TruthTableResult | { error: string } {
  // 1. Identify input sources
  const inputSources: { id: string; label: string; compId: string; type: string }[] = [];

  for (const c of components) {
    if (c.type === 'switch') {
      inputSources.push({ id: c.id, label: c.label || `Switch ${c.id.slice(-4)}`, compId: c.id, type: 'switch' });
    } else if (c.type === 'push_button') {
      inputSources.push({ id: c.id, label: c.label || `Button ${c.id.slice(-4)}`, compId: c.id, type: 'push_button' });
    }
  }

  if (inputSources.length === 0) {
    return { error: 'No toggle switches or buttons found in circuit. Add switches to generate a truth table.' };
  }

  if (inputSources.length > 6) {
    return { error: 'Too many inputs (max 6 inputs / 64 rows supported for instant truth table).' };
  }

  // 2. Identify output indicators
  const outputIndicators: { id: string; label: string; compId: string; pinId: string }[] = [];

  for (const c of components) {
    if (c.type.startsWith('led') || c.type === 'probe' || c.type === 'buzzer') {
      const pin = c.pins.find(p => p.type === 'input') || c.pins[0];
      if (pin) {
        outputIndicators.push({
          id: `${c.id}:${pin.id}`,
          label: c.label || `${c.type.toUpperCase()} (${c.id.slice(-4)})`,
          compId: c.id,
          pinId: pin.id
        });
      }
    }
  }

  if (outputIndicators.length === 0) {
    return { error: 'No outputs (LEDs, Probes, or Buzzer) found in circuit. Connect an LED or Probe to observe output.' };
  }

  // 3. Generate all 2^N combinations
  const numInputs = inputSources.length;
  const totalCombinations = 1 << numInputs;
  const rows: TruthTableResult['rows'] = [];

  for (let i = 0; i < totalCombinations; i++) {
    // Clone components for this specific test iteration
    const testComps: CircuitComponent[] = components.map(c => ({
      ...c,
      state: { ...c.state },
      pins: c.pins.map(p => ({ ...p }))
    }));

    const inputVals: Record<string, LogicLevel> = {};

    // Assign binary combination to switches
    inputSources.forEach((src, bitIndex) => {
      // MSB to LSB
      const bit = ((i >> (numInputs - 1 - bitIndex)) & 1) as LogicLevel;
      inputVals[src.id] = bit;

      const comp = testComps.find(c => c.id === src.compId);
      if (comp) {
        if (src.type === 'switch') {
          comp.state.isOn = bit === 1;
        } else if (src.type === 'push_button') {
          comp.state.isPressed = bit === 1;
        }
      }
    });

    // Run simulation to convergence
    const simulated = simulateStep(testComps, wires, false);

    // Read outputs
    const outputVals: Record<string, LogicLevel> = {};
    outputIndicators.forEach(out => {
      const comp = simulated.components.find(c => c.id === out.compId);
      const pin = comp?.pins.find(p => p.id === out.pinId);
      outputVals[out.id] = pin ? pin.value : 0;
    });

    rows.push({
      inputValues: inputVals,
      outputValues: outputVals
    });
  }

  return {
    inputs: inputSources,
    outputs: outputIndicators,
    rows
  };
}
