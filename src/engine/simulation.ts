import type { CircuitComponent, Wire, LogicLevel } from '../types/circuit';

// Standard 7-Segment segment lookup table for BCD digits 0-15
// Segments: [a, b, c, d, e, f, g]
const BCD_7SEG_TABLE: Record<number, number[]> = {
  0:  [1, 1, 1, 1, 1, 1, 0],
  1:  [0, 1, 1, 0, 0, 0, 0],
  2:  [1, 1, 0, 1, 1, 0, 1],
  3:  [1, 1, 1, 1, 0, 0, 1],
  4:  [0, 1, 1, 0, 0, 1, 1],
  5:  [1, 0, 1, 1, 0, 1, 1],
  6:  [1, 0, 1, 1, 1, 1, 1],
  7:  [1, 1, 1, 0, 0, 0, 0],
  8:  [1, 1, 1, 1, 1, 1, 1],
  9:  [1, 1, 1, 1, 0, 1, 1],
  10: [1, 1, 1, 0, 1, 1, 1], // A
  11: [0, 0, 1, 1, 1, 1, 1], // b
  12: [1, 0, 0, 1, 1, 1, 0], // C
  13: [0, 1, 1, 1, 1, 0, 1], // d
  14: [1, 0, 0, 1, 1, 1, 1], // E
  15: [1, 0, 0, 0, 1, 1, 1], // F
};

function getPinValue(comp: CircuitComponent, pinId: string): LogicLevel {
  const pin = comp.pins.find(p => p.id === pinId);
  return pin ? pin.value : 0;
}

function setPinValue(comp: CircuitComponent, pinId: string, val: LogicLevel): boolean {
  const pin = comp.pins.find(p => p.id === pinId);
  if (!pin) return false;
  if (pin.value !== val) {
    pin.value = val;
    return true; // value changed
  }
  return false;
}

function num(val: LogicLevel): number {
  return val === 1 ? 1 : 0;
}

/**
 * Executes one step of simulation across all components and wires.
 * Returns updated components, updated wires, and whether any state changed.
 */
export function simulateStep(
  components: CircuitComponent[],
  wires: Wire[],
  clockTicked: boolean = false
): { components: CircuitComponent[]; wires: Wire[]; hasChanged: boolean } {
  // Clone to avoid accidental unintended mutations
  const newComps: CircuitComponent[] = components.map(c => ({
    ...c,
    state: { ...c.state },
    pins: c.pins.map(p => ({ ...p }))
  }));

  const compMap = new Map<string, CircuitComponent>();
  newComps.forEach(c => compMap.set(c.id, c));

  let overallChanged = false;
  const MAX_CONVERGENCE_ITERATIONS = 8;

  // 1. Initialize fixed sources and clock states
  for (const comp of newComps) {
    if (comp.type === 'vcc') {
      if (setPinValue(comp, 'out', 1)) overallChanged = true;
    } else if (comp.type === 'gnd') {
      if (setPinValue(comp, 'out', 0)) overallChanged = true;
    } else if (comp.type === 'switch') {
      const isSwitchOn = comp.state?.isOn ? 1 : 0;
      if (setPinValue(comp, 'out', isSwitchOn)) overallChanged = true;
    } else if (comp.type === 'push_button') {
      const isPressed = comp.state?.isPressed ? 1 : 0;
      if (setPinValue(comp, 'out', isPressed)) overallChanged = true;
    } else if (comp.type === 'clock') {
      if (clockTicked) {
        comp.state.isHigh = !comp.state.isHigh;
        overallChanged = true;
      }
      const clkVal: LogicLevel = comp.state?.isHigh ? 1 : 0;
      if (setPinValue(comp, 'out', clkVal)) overallChanged = true;
    } else if (comp.type === 'dip_switch_4') {
      const s0 = comp.state?.s0 ? 1 : 0;
      const s1 = comp.state?.s1 ? 1 : 0;
      const s2 = comp.state?.s2 ? 1 : 0;
      const s3 = comp.state?.s3 ? 1 : 0;
      if (setPinValue(comp, 'out0', s0)) overallChanged = true;
      if (setPinValue(comp, 'out1', s1)) overallChanged = true;
      if (setPinValue(comp, 'out2', s2)) overallChanged = true;
      if (setPinValue(comp, 'out3', s3)) overallChanged = true;
    }
  }

  // 2. Loop until convergence (handles feedback loops and propagation)
  for (let iter = 0; iter < MAX_CONVERGENCE_ITERATIONS; iter++) {
    let iterationChanged = false;

    // Reset floating inputs before wire transfer
    // Any input with no wires attached will remain 0
    const connectedInputs = new Set<string>();

    // Transfer signals along wires
    for (const wire of wires) {
      const sourceComp = compMap.get(wire.fromComponentId);
      const targetComp = compMap.get(wire.toComponentId);
      if (!sourceComp || !targetComp) continue;

      const sourceVal = getPinValue(sourceComp, wire.fromPinId);
      wire.value = sourceVal;

      connectedInputs.add(`${wire.toComponentId}:${wire.toPinId}`);

      if (setPinValue(targetComp, wire.toPinId, sourceVal)) {
        iterationChanged = true;
        overallChanged = true;
      }
    }

    // Default unconnected inputs to 0
    for (const comp of newComps) {
      for (const pin of comp.pins) {
        if (pin.type === 'input') {
          const key = `${comp.id}:${pin.id}`;
          if (!connectedInputs.has(key) && pin.value !== 0) {
            pin.value = 0;
            iterationChanged = true;
            overallChanged = true;
          }
        }
      }
    }

    // Evaluate logic for each component
    for (const comp of newComps) {
      const changed = evaluateComponentLogic(comp);
      if (changed) {
        iterationChanged = true;
        overallChanged = true;
      }
    }

    if (!iterationChanged) {
      break; // Converged early!
    }
  }

  return { components: newComps, wires, hasChanged: overallChanged };
}

/**
 * Computes output pins of a component given its inputs and internal state.
 */
function evaluateComponentLogic(comp: CircuitComponent): boolean {
  let changed = false;

  switch (comp.type) {
    // ========== GATES ==========
    case 'not': {
      const a = getPinValue(comp, 'in');
      const y = a === 1 ? 0 : 1;
      if (setPinValue(comp, 'out', y)) changed = true;
      break;
    }
    case 'and': {
      const a = num(getPinValue(comp, 'in1'));
      const b = num(getPinValue(comp, 'in2'));
      const y = (a && b) ? 1 : 0;
      if (setPinValue(comp, 'out', y)) changed = true;
      break;
    }
    case 'and3': {
      const a = num(getPinValue(comp, 'in1'));
      const b = num(getPinValue(comp, 'in2'));
      const c = num(getPinValue(comp, 'in3'));
      const y = (a && b && c) ? 1 : 0;
      if (setPinValue(comp, 'out', y)) changed = true;
      break;
    }
    case 'or': {
      const a = num(getPinValue(comp, 'in1'));
      const b = num(getPinValue(comp, 'in2'));
      const y = (a || b) ? 1 : 0;
      if (setPinValue(comp, 'out', y)) changed = true;
      break;
    }
    case 'or3': {
      const a = num(getPinValue(comp, 'in1'));
      const b = num(getPinValue(comp, 'in2'));
      const c = num(getPinValue(comp, 'in3'));
      const y = (a || b || c) ? 1 : 0;
      if (setPinValue(comp, 'out', y)) changed = true;
      break;
    }
    case 'nand': {
      const a = num(getPinValue(comp, 'in1'));
      const b = num(getPinValue(comp, 'in2'));
      const y = (a && b) ? 0 : 1;
      if (setPinValue(comp, 'out', y)) changed = true;
      break;
    }
    case 'nor': {
      const a = num(getPinValue(comp, 'in1'));
      const b = num(getPinValue(comp, 'in2'));
      const y = (a || b) ? 0 : 1;
      if (setPinValue(comp, 'out', y)) changed = true;
      break;
    }
    case 'xor': {
      const a = num(getPinValue(comp, 'in1'));
      const b = num(getPinValue(comp, 'in2'));
      const y = (a ^ b) ? 1 : 0;
      if (setPinValue(comp, 'out', y)) changed = true;
      break;
    }
    case 'xnor': {
      const a = num(getPinValue(comp, 'in1'));
      const b = num(getPinValue(comp, 'in2'));
      const y = (a === b) ? 1 : 0;
      if (setPinValue(comp, 'out', y)) changed = true;
      break;
    }
    case 'buffer': {
      const a = getPinValue(comp, 'in');
      const y = a === 1 ? 1 : 0;
      if (setPinValue(comp, 'out', y)) changed = true;
      break;
    }
    case 'tristate_buffer': {
      const a = getPinValue(comp, 'in');
      const en = getPinValue(comp, 'en');
      const y = en === 1 ? (a === 1 ? 1 : 0) : 'Z';
      if (setPinValue(comp, 'out', y)) changed = true;
      break;
    }

    // ========== COMBINATIONAL CIRCUITS ==========
    case 'half_adder': {
      const a = num(getPinValue(comp, 'a'));
      const b = num(getPinValue(comp, 'b'));
      const sum = (a ^ b) ? 1 : 0;
      const carry = (a & b) ? 1 : 0;
      if (setPinValue(comp, 'sum', sum)) changed = true;
      if (setPinValue(comp, 'carry', carry)) changed = true;
      break;
    }
    case 'full_adder': {
      const a = num(getPinValue(comp, 'a'));
      const b = num(getPinValue(comp, 'b'));
      const cin = num(getPinValue(comp, 'cin'));
      const sum = (a ^ b ^ cin) ? 1 : 0;
      const cout = ((a & b) || (b & cin) || (a & cin)) ? 1 : 0;
      if (setPinValue(comp, 'sum', sum)) changed = true;
      if (setPinValue(comp, 'cout', cout)) changed = true;
      break;
    }
    case 'half_subtractor': {
      const a = num(getPinValue(comp, 'a'));
      const b = num(getPinValue(comp, 'b'));
      const diff = (a ^ b) ? 1 : 0;
      const borrow = (!a && b) ? 1 : 0;
      if (setPinValue(comp, 'diff', diff)) changed = true;
      if (setPinValue(comp, 'borrow', borrow)) changed = true;
      break;
    }
    case 'full_subtractor': {
      const a = num(getPinValue(comp, 'a'));
      const b = num(getPinValue(comp, 'b'));
      const bin = num(getPinValue(comp, 'bin'));
      const diff = (a ^ b ^ bin) ? 1 : 0;
      const bout = ((!a && b) || (!(a ^ b) && bin)) ? 1 : 0;
      if (setPinValue(comp, 'diff', diff)) changed = true;
      if (setPinValue(comp, 'bout', bout)) changed = true;
      break;
    }
    case 'mux_2_1': {
      const i0 = getPinValue(comp, 'i0');
      const i1 = getPinValue(comp, 'i1');
      const s = num(getPinValue(comp, 's'));
      const y = s === 1 ? i1 : i0;
      if (setPinValue(comp, 'y', y)) changed = true;
      break;
    }
    case 'mux_4_1': {
      const i0 = getPinValue(comp, 'i0');
      const i1 = getPinValue(comp, 'i1');
      const i2 = getPinValue(comp, 'i2');
      const i3 = getPinValue(comp, 'i3');
      const s0 = num(getPinValue(comp, 's0'));
      const s1 = num(getPinValue(comp, 's1'));
      const sel = (s1 << 1) | s0;
      const inputs = [i0, i1, i2, i3];
      const y = inputs[sel] ?? 0;
      if (setPinValue(comp, 'y', y)) changed = true;
      break;
    }
    case 'demux_1_2': {
      const inp = num(getPinValue(comp, 'in'));
      const s = num(getPinValue(comp, 's'));
      if (setPinValue(comp, 'y0', s === 0 ? (inp as LogicLevel) : 0)) changed = true;
      if (setPinValue(comp, 'y1', s === 1 ? (inp as LogicLevel) : 0)) changed = true;
      break;
    }
    case 'demux_1_4': {
      const inp = num(getPinValue(comp, 'in'));
      const s0 = num(getPinValue(comp, 's0'));
      const s1 = num(getPinValue(comp, 's1'));
      const sel = (s1 << 1) | s0;
      for (let i = 0; i < 4; i++) {
        const val: LogicLevel = (sel === i ? inp : 0) as LogicLevel;
        if (setPinValue(comp, `y${i}`, val)) changed = true;
      }
      break;
    }
    case 'decoder_2_4': {
      const a0 = num(getPinValue(comp, 'a0'));
      const a1 = num(getPinValue(comp, 'a1'));
      const en = num(getPinValue(comp, 'en'));
      const sel = (a1 << 1) | a0;
      for (let i = 0; i < 4; i++) {
        const val: LogicLevel = (en && sel === i) ? 1 : 0;
        if (setPinValue(comp, `y${i}`, val)) changed = true;
      }
      break;
    }
    case 'comparator_4bit': {
      const a = (num(getPinValue(comp, 'a3')) << 3) |
                (num(getPinValue(comp, 'a2')) << 2) |
                (num(getPinValue(comp, 'a1')) << 1) |
                 num(getPinValue(comp, 'a0'));
      const b = (num(getPinValue(comp, 'b3')) << 3) |
                (num(getPinValue(comp, 'b2')) << 2) |
                (num(getPinValue(comp, 'b1')) << 1) |
                 num(getPinValue(comp, 'b0'));
      if (setPinValue(comp, 'agtb', a > b ? 1 : 0)) changed = true;
      if (setPinValue(comp, 'aeqb', a === b ? 1 : 0)) changed = true;
      if (setPinValue(comp, 'altb', a < b ? 1 : 0)) changed = true;
      break;
    }
    case 'priority_encoder_4_2': {
      const d0 = num(getPinValue(comp, 'd0'));
      const d1 = num(getPinValue(comp, 'd1'));
      const d2 = num(getPinValue(comp, 'd2'));
      const d3 = num(getPinValue(comp, 'd3'));
      if (d3) {
        if (setPinValue(comp, 'y1', 1)) changed = true;
        if (setPinValue(comp, 'y0', 1)) changed = true;
        if (setPinValue(comp, 'valid', 1)) changed = true;
      } else if (d2) {
        if (setPinValue(comp, 'y1', 1)) changed = true;
        if (setPinValue(comp, 'y0', 0)) changed = true;
        if (setPinValue(comp, 'valid', 1)) changed = true;
      } else if (d1) {
        if (setPinValue(comp, 'y1', 0)) changed = true;
        if (setPinValue(comp, 'y0', 1)) changed = true;
        if (setPinValue(comp, 'valid', 1)) changed = true;
      } else if (d0) {
        if (setPinValue(comp, 'y1', 0)) changed = true;
        if (setPinValue(comp, 'y0', 0)) changed = true;
        if (setPinValue(comp, 'valid', 1)) changed = true;
      } else {
        if (setPinValue(comp, 'y1', 0)) changed = true;
        if (setPinValue(comp, 'y0', 0)) changed = true;
        if (setPinValue(comp, 'valid', 0)) changed = true;
      }
      break;
    }
    case 'bcd_to_7seg': {
      const a = num(getPinValue(comp, 'a'));
      const b = num(getPinValue(comp, 'b'));
      const c = num(getPinValue(comp, 'c'));
      const d = num(getPinValue(comp, 'd'));
      const bcdVal = (d << 3) | (c << 2) | (b << 1) | a;
      const segs = BCD_7SEG_TABLE[bcdVal] || [0, 0, 0, 0, 0, 0, 0];
      const names = ['out_a', 'out_b', 'out_c', 'out_d', 'out_e', 'out_f', 'out_g'];
      segs.forEach((val, idx) => {
        if (setPinValue(comp, names[idx], (val as LogicLevel))) changed = true;
      });
      break;
    }
    case 'decoder_2421_7seg': {
      const w2_msb = num(getPinValue(comp, 'w2_msb'));
      const w4 = num(getPinValue(comp, 'w4'));
      const w2_mid = num(getPinValue(comp, 'w2_mid'));
      const w1_lsb = num(getPinValue(comp, 'w1_lsb'));
      const val2421 = (w2_msb << 3) | (w4 << 2) | (w2_mid << 1) | w1_lsb;
      // 2421 Aiken code lookup:
      // 0000->0, 0001->1, 0010->2, 0011->3, 0100->4
      // 1011(11)->5, 1100(12)->6, 1101(13)->7, 1110(14)->8, 1111(15)->9
      const aikenMap: Record<number, number> = {
        0: 0, 1: 1, 2: 2, 3: 3, 4: 4,
        11: 5, 12: 6, 13: 7, 14: 8, 15: 9
      };
      const decVal = aikenMap[val2421] ?? (w2_msb * 2 + w4 * 4 + w2_mid * 2 + w1_lsb);
      const segs = BCD_7SEG_TABLE[decVal] || [0, 0, 0, 0, 0, 0, 0];
      const names = ['out_a', 'out_b', 'out_c', 'out_d', 'out_e', 'out_f', 'out_g'];
      segs.forEach((val, idx) => {
        if (setPinValue(comp, names[idx], (val as LogicLevel))) changed = true;
      });
      break;
    }
    case 'mux_8_1': {
      const s0 = num(getPinValue(comp, 's0'));
      const s1 = num(getPinValue(comp, 's1'));
      const s2 = num(getPinValue(comp, 's2'));
      const sel = (s2 << 2) | (s1 << 1) | s0;
      const inputs = [
        getPinValue(comp, 'i0'),
        getPinValue(comp, 'i1'),
        getPinValue(comp, 'i2'),
        getPinValue(comp, 'i3'),
        getPinValue(comp, 'i4'),
        getPinValue(comp, 'i5'),
        getPinValue(comp, 'i6'),
        getPinValue(comp, 'i7')
      ];
      const y = inputs[sel] ?? 0;
      if (setPinValue(comp, 'y', y)) changed = true;
      if (setPinValue(comp, 'y_bar', y === 1 ? 0 : 1)) changed = true;
      break;
    }
    case 'demux_1_8': {
      const inp = num(getPinValue(comp, 'in'));
      const s0 = num(getPinValue(comp, 's0'));
      const s1 = num(getPinValue(comp, 's1'));
      const s2 = num(getPinValue(comp, 's2'));
      const sel = (s2 << 2) | (s1 << 1) | s0;
      for (let i = 0; i < 8; i++) {
        const val: LogicLevel = (sel === i ? inp : 0) as LogicLevel;
        if (setPinValue(comp, `y${i}`, val)) changed = true;
      }
      break;
    }
    case 'adder_subtractor_4bit': {
      const m = num(getPinValue(comp, 'm'));
      const a0 = num(getPinValue(comp, 'a0'));
      const a1 = num(getPinValue(comp, 'a1'));
      const a2 = num(getPinValue(comp, 'a2'));
      const a3 = num(getPinValue(comp, 'a3'));
      const b0 = num(getPinValue(comp, 'b0'));
      const b1 = num(getPinValue(comp, 'b1'));
      const b2 = num(getPinValue(comp, 'b2'));
      const b3 = num(getPinValue(comp, 'b3'));

      const b0_eff = b0 ^ m;
      const b1_eff = b1 ^ m;
      const b2_eff = b2 ^ m;
      const b3_eff = b3 ^ m;

      const s0 = (a0 ^ b0_eff ^ m) ? 1 : 0;
      const c1 = ((a0 & b0_eff) | (m & (a0 ^ b0_eff))) ? 1 : 0;

      const s1 = (a1 ^ b1_eff ^ c1) ? 1 : 0;
      const c2 = ((a1 & b1_eff) | (c1 & (a1 ^ b1_eff))) ? 1 : 0;

      const s2 = (a2 ^ b2_eff ^ c2) ? 1 : 0;
      const c3 = ((a2 & b2_eff) | (c2 & (a2 ^ b2_eff))) ? 1 : 0;

      const s3 = (a3 ^ b3_eff ^ c3) ? 1 : 0;
      const cout = ((a3 & b3_eff) | (c3 & (a3 ^ b3_eff))) ? 1 : 0;
      const v = (c3 ^ cout) ? 1 : 0;

      if (setPinValue(comp, 's0', s0)) changed = true;
      if (setPinValue(comp, 's1', s1)) changed = true;
      if (setPinValue(comp, 's2', s2)) changed = true;
      if (setPinValue(comp, 's3', s3)) changed = true;
      if (setPinValue(comp, 'cout', cout)) changed = true;
      if (setPinValue(comp, 'v', v)) changed = true;
      break;
    }

    // ========== SEQUENTIAL CIRCUITS ==========
    case 'sr_latch': {
      const s = num(getPinValue(comp, 's'));
      const r = num(getPinValue(comp, 'r'));
      let q = comp.state.q ?? 0;
      if (s === 1 && r === 0) {
        q = 1;
      } else if (s === 0 && r === 1) {
        q = 0;
      }
      comp.state.q = q;
      const qBar: LogicLevel = q === 1 ? 0 : 1;
      if (setPinValue(comp, 'q', (q as LogicLevel))) changed = true;
      if (setPinValue(comp, 'q_bar', qBar)) changed = true;
      break;
    }
    case 'd_flip_flop': {
      const d = num(getPinValue(comp, 'd'));
      const clk = num(getPinValue(comp, 'clk'));
      const rst = num(getPinValue(comp, 'rst'));
      let q = comp.state.q ?? 0;
      const lastClk = comp.state.lastClk ?? 0;

      if (rst === 1) {
        q = 0;
      } else if (lastClk === 0 && clk === 1) { // Rising edge
        q = d;
      }
      comp.state.lastClk = clk;
      comp.state.q = q;
      if (setPinValue(comp, 'q', (q as LogicLevel))) changed = true;
      if (setPinValue(comp, 'q_bar', q === 1 ? 0 : 1)) changed = true;
      break;
    }
    case 'jk_flip_flop': {
      const j = num(getPinValue(comp, 'j'));
      const k = num(getPinValue(comp, 'k'));
      const clk = num(getPinValue(comp, 'clk'));
      const rst = num(getPinValue(comp, 'rst'));
      let q = comp.state.q ?? 0;
      const lastClk = comp.state.lastClk ?? 0;

      if (rst === 1) {
        q = 0;
      } else if (lastClk === 0 && clk === 1) { // Rising edge
        if (j === 0 && k === 1) {
          q = 0;
        } else if (j === 1 && k === 0) {
          q = 1;
        } else if (j === 1 && k === 1) {
          q = q === 1 ? 0 : 1; // Toggle
        }
      }
      comp.state.lastClk = clk;
      comp.state.q = q;
      if (setPinValue(comp, 'q', (q as LogicLevel))) changed = true;
      if (setPinValue(comp, 'q_bar', q === 1 ? 0 : 1)) changed = true;
      break;
    }
    case 't_flip_flop': {
      const t = num(getPinValue(comp, 't'));
      const clk = num(getPinValue(comp, 'clk'));
      let q = comp.state.q ?? 0;
      const lastClk = comp.state.lastClk ?? 0;

      if (lastClk === 0 && clk === 1) {
        if (t === 1) {
          q = q === 1 ? 0 : 1;
        }
      }
      comp.state.lastClk = clk;
      comp.state.q = q;
      if (setPinValue(comp, 'q', (q as LogicLevel))) changed = true;
      if (setPinValue(comp, 'q_bar', q === 1 ? 0 : 1)) changed = true;
      break;
    }
    case 'counter_4bit': {
      const clk = num(getPinValue(comp, 'clk'));
      const rst = num(getPinValue(comp, 'rst'));
      let count = comp.state.count ?? 0;
      const lastClk = comp.state.lastClk ?? 0;

      if (rst === 1) {
        count = 0;
      } else if (lastClk === 0 && clk === 1) {
        count = (count + 1) % 16;
      }
      comp.state.lastClk = clk;
      comp.state.count = count;
      if (setPinValue(comp, 'q0', ((count & 1) as LogicLevel))) changed = true;
      if (setPinValue(comp, 'q1', (((count >> 1) & 1) as LogicLevel))) changed = true;
      if (setPinValue(comp, 'q2', (((count >> 2) & 1) as LogicLevel))) changed = true;
      if (setPinValue(comp, 'q3', (((count >> 3) & 1) as LogicLevel))) changed = true;
      break;
    }
    case 'decade_counter': {
      const clk = num(getPinValue(comp, 'clk'));
      const rst = num(getPinValue(comp, 'rst'));
      let count = comp.state.count ?? 0;
      const lastClk = comp.state.lastClk ?? 0;

      if (rst === 1) {
        count = 0;
      } else if (lastClk === 0 && clk === 1) {
        count = (count + 1) % 10;
      }
      comp.state.lastClk = clk;
      comp.state.count = count;
      if (setPinValue(comp, 'q0', ((count & 1) as LogicLevel))) changed = true;
      if (setPinValue(comp, 'q1', (((count >> 1) & 1) as LogicLevel))) changed = true;
      if (setPinValue(comp, 'q2', (((count >> 2) & 1) as LogicLevel))) changed = true;
      if (setPinValue(comp, 'q3', (((count >> 3) & 1) as LogicLevel))) changed = true;
      if (setPinValue(comp, 'tc', count === 9 ? 1 : 0)) changed = true;
      break;
    }
    case 'shift_reg_4bit': {
      const din = num(getPinValue(comp, 'din'));
      const clk = num(getPinValue(comp, 'clk'));
      const rst = num(getPinValue(comp, 'rst'));
      let bits: number[] = comp.state.bits || [0, 0, 0, 0];
      const lastClk = comp.state.lastClk ?? 0;

      if (rst === 1) {
        bits = [0, 0, 0, 0];
      } else if (lastClk === 0 && clk === 1) {
        bits = [din, bits[0], bits[1], bits[2]];
      }
      comp.state.lastClk = clk;
      comp.state.bits = bits;
      if (setPinValue(comp, 'q0', (bits[0] as LogicLevel))) changed = true;
      if (setPinValue(comp, 'q1', (bits[1] as LogicLevel))) changed = true;
      if (setPinValue(comp, 'q2', (bits[2] as LogicLevel))) changed = true;
      if (setPinValue(comp, 'q3', (bits[3] as LogicLevel))) changed = true;
      break;
    }
    case 'clocked_sr_ff': {
      const s = num(getPinValue(comp, 's'));
      const r = num(getPinValue(comp, 'r'));
      const clk = num(getPinValue(comp, 'clk'));
      let q = comp.state.q ?? 0;
      const lastClk = comp.state.lastClk ?? 0;
      if (lastClk === 0 && clk === 1) { // Rising edge
        if (s === 1 && r === 0) {
          q = 1;
        } else if (s === 0 && r === 1) {
          q = 0;
        }
      }
      comp.state.lastClk = clk;
      comp.state.q = q;
      if (setPinValue(comp, 'q', (q as LogicLevel))) changed = true;
      if (setPinValue(comp, 'q_bar', q === 1 ? 0 : 1)) changed = true;
      break;
    }
    case 'ring_counter_4bit': {
      const clk = num(getPinValue(comp, 'clk'));
      const rst = num(getPinValue(comp, 'rst'));
      let stateIndex = comp.state.stateIndex ?? 0;
      const lastClk = comp.state.lastClk ?? 0;

      if (rst === 1) {
        stateIndex = 0;
      } else if (lastClk === 0 && clk === 1) {
        stateIndex = (stateIndex + 1) % 4;
      }
      comp.state.lastClk = clk;
      comp.state.stateIndex = stateIndex;
      if (setPinValue(comp, 'q0', stateIndex === 0 ? 1 : 0)) changed = true;
      if (setPinValue(comp, 'q1', stateIndex === 1 ? 1 : 0)) changed = true;
      if (setPinValue(comp, 'q2', stateIndex === 2 ? 1 : 0)) changed = true;
      if (setPinValue(comp, 'q3', stateIndex === 3 ? 1 : 0)) changed = true;
      break;
    }

    // ========== 74-SERIES IC IMPLEMENTATIONS ==========
    case 'ic_7400': {
      // Quad 2-in NAND
      const y1 = (num(getPinValue(comp, 'p1')) && num(getPinValue(comp, 'p2'))) ? 0 : 1;
      const y2 = (num(getPinValue(comp, 'p4')) && num(getPinValue(comp, 'p5'))) ? 0 : 1;
      const y3 = (num(getPinValue(comp, 'p9')) && num(getPinValue(comp, 'p10'))) ? 0 : 1;
      const y4 = (num(getPinValue(comp, 'p12')) && num(getPinValue(comp, 'p13'))) ? 0 : 1;

      if (setPinValue(comp, 'p3', y1)) changed = true;
      if (setPinValue(comp, 'p6', y2)) changed = true;
      if (setPinValue(comp, 'p8', y3)) changed = true;
      if (setPinValue(comp, 'p11', y4)) changed = true;
      break;
    }
    case 'ic_7402': {
      // Quad 2-in NOR
      const y1 = (num(getPinValue(comp, 'p2')) || num(getPinValue(comp, 'p3'))) ? 0 : 1;
      const y2 = (num(getPinValue(comp, 'p5')) || num(getPinValue(comp, 'p6'))) ? 0 : 1;
      const y3 = (num(getPinValue(comp, 'p8')) || num(getPinValue(comp, 'p9'))) ? 0 : 1;
      const y4 = (num(getPinValue(comp, 'p11')) || num(getPinValue(comp, 'p12'))) ? 0 : 1;

      if (setPinValue(comp, 'p1', y1)) changed = true;
      if (setPinValue(comp, 'p4', y2)) changed = true;
      if (setPinValue(comp, 'p10', y3)) changed = true;
      if (setPinValue(comp, 'p13', y4)) changed = true;
      break;
    }
    case 'ic_7404': {
      // Hex Inverter NOT
      const y1 = num(getPinValue(comp, 'p1')) ? 0 : 1;
      const y2 = num(getPinValue(comp, 'p3')) ? 0 : 1;
      const y3 = num(getPinValue(comp, 'p5')) ? 0 : 1;
      const y4 = num(getPinValue(comp, 'p9')) ? 0 : 1;
      const y5 = num(getPinValue(comp, 'p11')) ? 0 : 1;
      const y6 = num(getPinValue(comp, 'p13')) ? 0 : 1;

      if (setPinValue(comp, 'p2', y1)) changed = true;
      if (setPinValue(comp, 'p4', y2)) changed = true;
      if (setPinValue(comp, 'p6', y3)) changed = true;
      if (setPinValue(comp, 'p8', y4)) changed = true;
      if (setPinValue(comp, 'p10', y5)) changed = true;
      if (setPinValue(comp, 'p12', y6)) changed = true;
      break;
    }
    case 'ic_7408': {
      // Quad 2-in AND
      const y1 = (num(getPinValue(comp, 'p1')) && num(getPinValue(comp, 'p2'))) ? 1 : 0;
      const y2 = (num(getPinValue(comp, 'p4')) && num(getPinValue(comp, 'p5'))) ? 1 : 0;
      const y3 = (num(getPinValue(comp, 'p9')) && num(getPinValue(comp, 'p10'))) ? 1 : 0;
      const y4 = (num(getPinValue(comp, 'p12')) && num(getPinValue(comp, 'p13'))) ? 1 : 0;

      if (setPinValue(comp, 'p3', y1)) changed = true;
      if (setPinValue(comp, 'p6', y2)) changed = true;
      if (setPinValue(comp, 'p8', y3)) changed = true;
      if (setPinValue(comp, 'p11', y4)) changed = true;
      break;
    }
    case 'ic_7432': {
      // Quad 2-in OR
      const y1 = (num(getPinValue(comp, 'p1')) || num(getPinValue(comp, 'p2'))) ? 1 : 0;
      const y2 = (num(getPinValue(comp, 'p4')) || num(getPinValue(comp, 'p5'))) ? 1 : 0;
      const y3 = (num(getPinValue(comp, 'p9')) || num(getPinValue(comp, 'p10'))) ? 1 : 0;
      const y4 = (num(getPinValue(comp, 'p12')) || num(getPinValue(comp, 'p13'))) ? 1 : 0;

      if (setPinValue(comp, 'p3', y1)) changed = true;
      if (setPinValue(comp, 'p6', y2)) changed = true;
      if (setPinValue(comp, 'p8', y3)) changed = true;
      if (setPinValue(comp, 'p11', y4)) changed = true;
      break;
    }
    case 'ic_7486': {
      // Quad 2-in XOR
      const y1 = (num(getPinValue(comp, 'p1')) ^ num(getPinValue(comp, 'p2'))) ? 1 : 0;
      const y2 = (num(getPinValue(comp, 'p4')) ^ num(getPinValue(comp, 'p5'))) ? 1 : 0;
      const y3 = (num(getPinValue(comp, 'p9')) ^ num(getPinValue(comp, 'p10'))) ? 1 : 0;
      const y4 = (num(getPinValue(comp, 'p12')) ^ num(getPinValue(comp, 'p13'))) ? 1 : 0;

      if (setPinValue(comp, 'p3', y1)) changed = true;
      if (setPinValue(comp, 'p6', y2)) changed = true;
      if (setPinValue(comp, 'p8', y3)) changed = true;
      if (setPinValue(comp, 'p11', y4)) changed = true;
      break;
    }
    case 'ic_7474': {
      // Dual D Flip Flop
      const clr1 = num(getPinValue(comp, 'p1'));
      const d1 = num(getPinValue(comp, 'p2'));
      const clk1 = num(getPinValue(comp, 'p3'));
      const pre1 = num(getPinValue(comp, 'p4'));
      let q1 = comp.state.q1 ?? 0;
      const lastClk1 = comp.state.lastClk1 ?? 0;

      if (clr1 === 0 && pre1 === 1) q1 = 0;
      else if (clr1 === 1 && pre1 === 0) q1 = 1;
      else if (lastClk1 === 0 && clk1 === 1) q1 = d1;
      comp.state.lastClk1 = clk1;
      comp.state.q1 = q1;
      if (setPinValue(comp, 'p5', (q1 as LogicLevel))) changed = true;
      if (setPinValue(comp, 'p6', q1 === 1 ? 0 : 1)) changed = true;

      const clr2 = num(getPinValue(comp, 'p13'));
      const d2 = num(getPinValue(comp, 'p12'));
      const clk2 = num(getPinValue(comp, 'p11'));
      const pre2 = num(getPinValue(comp, 'p10'));
      let q2 = comp.state.q2 ?? 0;
      const lastClk2 = comp.state.lastClk2 ?? 0;

      if (clr2 === 0 && pre2 === 1) q2 = 0;
      else if (clr2 === 1 && pre2 === 0) q2 = 1;
      else if (lastClk2 === 0 && clk2 === 1) q2 = d2;
      comp.state.lastClk2 = clk2;
      comp.state.q2 = q2;
      if (setPinValue(comp, 'p9', (q2 as LogicLevel))) changed = true;
      if (setPinValue(comp, 'p8', q2 === 1 ? 0 : 1)) changed = true;
      break;
    }
    case 'ic_7447': {
      const a = num(getPinValue(comp, 'p7'));
      const b = num(getPinValue(comp, 'p1'));
      const c = num(getPinValue(comp, 'p2'));
      const d = num(getPinValue(comp, 'p6'));
      const bcdVal = (d << 3) | (c << 2) | (b << 1) | a;
      const segs = BCD_7SEG_TABLE[bcdVal] || [0, 0, 0, 0, 0, 0, 0];
      if (setPinValue(comp, 'p13', segs[0] ? 0 : 1)) changed = true;
      if (setPinValue(comp, 'p12', segs[1] ? 0 : 1)) changed = true;
      if (setPinValue(comp, 'p11', segs[2] ? 0 : 1)) changed = true;
      if (setPinValue(comp, 'p10', segs[3] ? 0 : 1)) changed = true;
      if (setPinValue(comp, 'p9',  segs[4] ? 0 : 1)) changed = true;
      if (setPinValue(comp, 'p15', segs[5] ? 0 : 1)) changed = true;
      if (setPinValue(comp, 'p14', segs[6] ? 0 : 1)) changed = true;
      break;
    }
    case 'ic_555': {
      const trig = num(getPinValue(comp, 'p2'));
      const rst = num(getPinValue(comp, 'p4'));
      let outState = comp.state.outState ?? 0;
      if (rst === 0) {
        outState = 0;
      } else if (trig === 0) {
        outState = 1;
      }
      comp.state.outState = outState;
      if (setPinValue(comp, 'p3', (outState as LogicLevel))) changed = true;
      break;
    }
  }

  return changed;
}
