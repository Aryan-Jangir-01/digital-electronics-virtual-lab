import type { ComponentDefinition } from '../types/circuit';

export const COMPONENT_CATALOG: Record<string, ComponentDefinition> = {
  // ==================== INPUTS ====================
  switch: {
    type: 'switch',
    name: 'Toggle Switch',
    category: 'inputs',
    description: 'Toggle switch producing static Logic 0 (LOW) or Logic 1 (HIGH).',
    width: 90,
    height: 70,
    pins: [
      { id: 'out', name: 'OUT', type: 'output', x: 90, y: 35 }
    ],
    defaultState: { isOn: false },
    symbolType: 'box'
  },
  push_button: {
    type: 'push_button',
    name: 'Push Button',
    category: 'inputs',
    description: 'Momentary push button (normally LOW, HIGH when pressed).',
    width: 90,
    height: 70,
    pins: [
      { id: 'out', name: 'OUT', type: 'output', x: 90, y: 35 }
    ],
    defaultState: { isPressed: false },
    symbolType: 'box'
  },
  clock: {
    type: 'clock',
    name: 'Clock Pulse',
    category: 'inputs',
    description: 'Periodic square-wave clock pulse generator with adjustable frequency.',
    width: 95,
    height: 75,
    pins: [
      { id: 'out', name: 'CLK', type: 'output', x: 95, y: 37 }
    ],
    defaultState: { frequency: 1, isHigh: false },
    symbolType: 'box'
  },
  vcc: {
    type: 'vcc',
    name: 'VCC (+5V / 1)',
    category: 'inputs',
    description: 'Constant Logic 1 (HIGH / +5V) voltage source.',
    width: 60,
    height: 50,
    pins: [
      { id: 'out', name: 'VCC', type: 'output', x: 60, y: 25 }
    ],
    defaultState: {},
    symbolType: 'box'
  },
  gnd: {
    type: 'gnd',
    name: 'GND (0V / 0)',
    category: 'inputs',
    description: 'Constant Logic 0 (LOW / 0V) ground reference.',
    width: 60,
    height: 50,
    pins: [
      { id: 'out', name: 'GND', type: 'output', x: 60, y: 25 }
    ],
    defaultState: {},
    symbolType: 'box'
  },
  dip_switch_4: {
    type: 'dip_switch_4',
    name: '4-Bit DIP Switch',
    category: 'inputs',
    description: 'Bank of 4 independent toggle switches for 4-bit binary input.',
    width: 120,
    height: 140,
    pins: [
      { id: 'out0', name: 'D0', type: 'output', x: 120, y: 25 },
      { id: 'out1', name: 'D1', type: 'output', x: 120, y: 55 },
      { id: 'out2', name: 'D2', type: 'output', x: 120, y: 85 },
      { id: 'out3', name: 'D3', type: 'output', x: 120, y: 115 }
    ],
    defaultState: { s0: false, s1: false, s2: false, s3: false },
    symbolType: 'box'
  },

  // ==================== LOGIC GATES ====================
  not: {
    type: 'not',
    name: 'NOT Gate',
    category: 'gates',
    description: 'Inverts the digital input signal (Y = A\').',
    width: 90,
    height: 60,
    pins: [
      { id: 'in', name: 'A', type: 'input', x: 0, y: 30 },
      { id: 'out', name: 'Y', type: 'output', x: 90, y: 30, invert: true }
    ],
    symbolType: 'ansi'
  },
  and: {
    type: 'and',
    name: 'AND Gate (2-In)',
    category: 'gates',
    description: 'Output is HIGH only if all inputs are HIGH (Y = A · B).',
    width: 90,
    height: 60,
    pins: [
      { id: 'in1', name: 'A', type: 'input', x: 0, y: 20 },
      { id: 'in2', name: 'B', type: 'input', x: 0, y: 40 },
      { id: 'out', name: 'Y', type: 'output', x: 90, y: 30 }
    ],
    symbolType: 'ansi'
  },
  and3: {
    type: 'and3',
    name: 'AND Gate (3-In)',
    category: 'gates',
    description: '3-input AND gate (Y = A · B · C).',
    width: 100,
    height: 80,
    pins: [
      { id: 'in1', name: 'A', type: 'input', x: 0, y: 20 },
      { id: 'in2', name: 'B', type: 'input', x: 0, y: 40 },
      { id: 'in3', name: 'C', type: 'input', x: 0, y: 60 },
      { id: 'out', name: 'Y', type: 'output', x: 100, y: 40 }
    ],
    symbolType: 'ansi'
  },
  or: {
    type: 'or',
    name: 'OR Gate (2-In)',
    category: 'gates',
    description: 'Output is HIGH if at least one input is HIGH (Y = A + B).',
    width: 90,
    height: 60,
    pins: [
      { id: 'in1', name: 'A', type: 'input', x: 0, y: 20 },
      { id: 'in2', name: 'B', type: 'input', x: 0, y: 40 },
      { id: 'out', name: 'Y', type: 'output', x: 90, y: 30 }
    ],
    symbolType: 'ansi'
  },
  or3: {
    type: 'or3',
    name: 'OR Gate (3-In)',
    category: 'gates',
    description: '3-input OR gate (Y = A + B + C).',
    width: 100,
    height: 80,
    pins: [
      { id: 'in1', name: 'A', type: 'input', x: 0, y: 20 },
      { id: 'in2', name: 'B', type: 'input', x: 0, y: 40 },
      { id: 'in3', name: 'C', type: 'input', x: 0, y: 60 },
      { id: 'out', name: 'Y', type: 'output', x: 100, y: 40 }
    ],
    symbolType: 'ansi'
  },
  nand: {
    type: 'nand',
    name: 'NAND Gate',
    category: 'gates',
    description: 'Universal Gate: Inverted AND gate (Y = (A · B)\').',
    width: 95,
    height: 60,
    pins: [
      { id: 'in1', name: 'A', type: 'input', x: 0, y: 20 },
      { id: 'in2', name: 'B', type: 'input', x: 0, y: 40 },
      { id: 'out', name: 'Y', type: 'output', x: 95, y: 30, invert: true }
    ],
    symbolType: 'ansi'
  },
  nor: {
    type: 'nor',
    name: 'NOR Gate',
    category: 'gates',
    description: 'Universal Gate: Inverted OR gate (Y = (A + B)\').',
    width: 95,
    height: 60,
    pins: [
      { id: 'in1', name: 'A', type: 'input', x: 0, y: 20 },
      { id: 'in2', name: 'B', type: 'input', x: 0, y: 40 },
      { id: 'out', name: 'Y', type: 'output', x: 95, y: 30, invert: true }
    ],
    symbolType: 'ansi'
  },
  xor: {
    type: 'xor',
    name: 'XOR Gate',
    category: 'gates',
    description: 'Exclusive-OR: Output is HIGH when inputs differ (Y = A ⊕ B).',
    width: 95,
    height: 60,
    pins: [
      { id: 'in1', name: 'A', type: 'input', x: 0, y: 20 },
      { id: 'in2', name: 'B', type: 'input', x: 0, y: 40 },
      { id: 'out', name: 'Y', type: 'output', x: 95, y: 30 }
    ],
    symbolType: 'ansi'
  },
  xnor: {
    type: 'xnor',
    name: 'XNOR Gate',
    category: 'gates',
    description: 'Exclusive-NOR (Equivalence): Output HIGH when inputs are equal.',
    width: 100,
    height: 60,
    pins: [
      { id: 'in1', name: 'A', type: 'input', x: 0, y: 20 },
      { id: 'in2', name: 'B', type: 'input', x: 0, y: 40 },
      { id: 'out', name: 'Y', type: 'output', x: 100, y: 30, invert: true }
    ],
    symbolType: 'ansi'
  },
  buffer: {
    type: 'buffer',
    name: 'Buffer',
    category: 'gates',
    description: 'Passes signal directly without inversion for signal boost or delay.',
    width: 80,
    height: 50,
    pins: [
      { id: 'in', name: 'A', type: 'input', x: 0, y: 25 },
      { id: 'out', name: 'Y', type: 'output', x: 80, y: 25 }
    ],
    symbolType: 'ansi'
  },
  tristate_buffer: {
    type: 'tristate_buffer',
    name: 'Tri-State Buffer',
    category: 'gates',
    description: 'Active-high enable buffer. Output is High-Z when Enable is 0.',
    width: 85,
    height: 60,
    pins: [
      { id: 'in', name: 'A', type: 'input', x: 0, y: 25 },
      { id: 'en', name: 'EN', type: 'input', x: 42, y: 60 },
      { id: 'out', name: 'Y', type: 'output', x: 85, y: 25 }
    ],
    symbolType: 'box'
  },

  // ==================== COMBINATIONAL CIRCUITS ====================
  half_adder: {
    type: 'half_adder',
    name: 'Half Adder',
    category: 'combinational',
    description: 'Adds two 1-bit binary digits (A, B) producing Sum and Carry.',
    width: 110,
    height: 80,
    pins: [
      { id: 'a', name: 'A', type: 'input', x: 0, y: 25 },
      { id: 'b', name: 'B', type: 'input', x: 0, y: 55 },
      { id: 'sum', name: 'SUM', type: 'output', x: 110, y: 25 },
      { id: 'carry', name: 'CARRY', type: 'output', x: 110, y: 55 }
    ],
    symbolType: 'box'
  },
  full_adder: {
    type: 'full_adder',
    name: 'Full Adder',
    category: 'combinational',
    description: 'Adds three 1-bit binary numbers (A, B, Cin) producing Sum and Cout.',
    width: 120,
    height: 100,
    pins: [
      { id: 'a', name: 'A', type: 'input', x: 0, y: 25 },
      { id: 'b', name: 'B', type: 'input', x: 0, y: 50 },
      { id: 'cin', name: 'CIN', type: 'input', x: 0, y: 75 },
      { id: 'sum', name: 'SUM', type: 'output', x: 120, y: 35 },
      { id: 'cout', name: 'COUT', type: 'output', x: 120, y: 65 }
    ],
    symbolType: 'box'
  },
  half_subtractor: {
    type: 'half_subtractor',
    name: 'Half Subtractor',
    category: 'combinational',
    description: 'Subtracts two 1-bit numbers producing Difference and Borrow.',
    width: 120,
    height: 80,
    pins: [
      { id: 'a', name: 'A', type: 'input', x: 0, y: 25 },
      { id: 'b', name: 'B', type: 'input', x: 0, y: 55 },
      { id: 'diff', name: 'DIFF', type: 'output', x: 120, y: 25 },
      { id: 'borrow', name: 'BORR', type: 'output', x: 120, y: 55 }
    ],
    symbolType: 'box'
  },
  full_subtractor: {
    type: 'full_subtractor',
    name: 'Full Subtractor',
    category: 'combinational',
    description: 'Subtracts three 1-bit inputs (A, B, Bin) producing Diff and Bout.',
    width: 125,
    height: 100,
    pins: [
      { id: 'a', name: 'A', type: 'input', x: 0, y: 25 },
      { id: 'b', name: 'B', type: 'input', x: 0, y: 50 },
      { id: 'bin', name: 'BIN', type: 'input', x: 0, y: 75 },
      { id: 'diff', name: 'DIFF', type: 'output', x: 125, y: 35 },
      { id: 'bout', name: 'BOUT', type: 'output', x: 125, y: 65 }
    ],
    symbolType: 'box'
  },
  mux_2_1: {
    type: 'mux_2_1',
    name: '2:1 Multiplexer',
    category: 'combinational',
    description: 'Selects one of two data inputs (I0, I1) based on select line S.',
    width: 110,
    height: 90,
    pins: [
      { id: 'i0', name: 'I0', type: 'input', x: 0, y: 25 },
      { id: 'i1', name: 'I1', type: 'input', x: 0, y: 65 },
      { id: 's', name: 'S', type: 'input', x: 55, y: 90 },
      { id: 'y', name: 'Y', type: 'output', x: 110, y: 45 }
    ],
    symbolType: 'box'
  },
  mux_4_1: {
    type: 'mux_4_1',
    name: '4:1 Multiplexer',
    category: 'combinational',
    description: 'Selects one of 4 inputs (I0-I3) to single output using S0 and S1.',
    width: 125,
    height: 130,
    pins: [
      { id: 'i0', name: 'I0', type: 'input', x: 0, y: 20 },
      { id: 'i1', name: 'I1', type: 'input', x: 0, y: 45 },
      { id: 'i2', name: 'I2', type: 'input', x: 0, y: 70 },
      { id: 'i3', name: 'I3', type: 'input', x: 0, y: 95 },
      { id: 's0', name: 'S0', type: 'input', x: 45, y: 130 },
      { id: 's1', name: 'S1', type: 'input', x: 80, y: 130 },
      { id: 'y', name: 'Y', type: 'output', x: 125, y: 55 }
    ],
    symbolType: 'box'
  },
  demux_1_2: {
    type: 'demux_1_2',
    name: '1:2 Demultiplexer',
    category: 'combinational',
    description: 'Routes 1 input line to one of 2 output lines based on S.',
    width: 110,
    height: 90,
    pins: [
      { id: 'in', name: 'IN', type: 'input', x: 0, y: 45 },
      { id: 's', name: 'S', type: 'input', x: 55, y: 90 },
      { id: 'y0', name: 'Y0', type: 'output', x: 110, y: 25 },
      { id: 'y1', name: 'Y1', type: 'output', x: 110, y: 65 }
    ],
    symbolType: 'box'
  },
  demux_1_4: {
    type: 'demux_1_4',
    name: '1:4 Demultiplexer',
    category: 'combinational',
    description: 'Routes 1 data line to one of 4 output lines based on S0, S1.',
    width: 125,
    height: 130,
    pins: [
      { id: 'in', name: 'IN', type: 'input', x: 0, y: 55 },
      { id: 's0', name: 'S0', type: 'input', x: 45, y: 130 },
      { id: 's1', name: 'S1', type: 'input', x: 80, y: 130 },
      { id: 'y0', name: 'Y0', type: 'output', x: 125, y: 20 },
      { id: 'y1', name: 'Y1', type: 'output', x: 125, y: 45 },
      { id: 'y2', name: 'Y2', type: 'output', x: 125, y: 70 },
      { id: 'y3', name: 'Y3', type: 'output', x: 125, y: 95 }
    ],
    symbolType: 'box'
  },
  decoder_2_4: {
    type: 'decoder_2_4',
    name: '2:4 Line Decoder',
    category: 'combinational',
    description: 'Decodes 2-bit binary code (A0, A1) into 4 active HIGH outputs.',
    width: 130,
    height: 130,
    pins: [
      { id: 'a0', name: 'A0', type: 'input', x: 0, y: 35 },
      { id: 'a1', name: 'A1', type: 'input', x: 0, y: 65 },
      { id: 'en', name: 'EN', type: 'input', x: 0, y: 95 },
      { id: 'y0', name: 'Y0', type: 'output', x: 130, y: 20 },
      { id: 'y1', name: 'Y1', type: 'output', x: 130, y: 45 },
      { id: 'y2', name: 'Y2', type: 'output', x: 130, y: 70 },
      { id: 'y3', name: 'Y3', type: 'output', x: 130, y: 95 }
    ],
    symbolType: 'box'
  },
  comparator_4bit: {
    type: 'comparator_4bit',
    name: '4-Bit Magnitude Comparator',
    category: 'combinational',
    description: 'Compares two 4-bit numbers (A and B) giving A>B, A=B, and A<B outputs.',
    width: 150,
    height: 160,
    pins: [
      { id: 'a0', name: 'A0', type: 'input', x: 0, y: 20 },
      { id: 'a1', name: 'A1', type: 'input', x: 0, y: 40 },
      { id: 'a2', name: 'A2', type: 'input', x: 0, y: 60 },
      { id: 'a3', name: 'A3', type: 'input', x: 0, y: 80 },
      { id: 'b0', name: 'B0', type: 'input', x: 0, y: 100 },
      { id: 'b1', name: 'B1', type: 'input', x: 0, y: 120 },
      { id: 'b2', name: 'B2', type: 'input', x: 0, y: 140 },
      { id: 'b3', name: 'B3', type: 'input', x: 0, y: 160 },
      { id: 'agtb', name: 'A>B', type: 'output', x: 150, y: 45 },
      { id: 'aeqb', name: 'A=B', type: 'output', x: 150, y: 85 },
      { id: 'altb', name: 'A<B', type: 'output', x: 150, y: 125 }
    ],
    symbolType: 'box'
  },
  priority_encoder_4_2: {
    type: 'priority_encoder_4_2',
    name: '4:2 Priority Encoder',
    category: 'combinational',
    description: 'Encodes 4 input lines into a 2-bit binary code with priority order.',
    width: 140,
    height: 130,
    pins: [
      { id: 'd0', name: 'D0', type: 'input', x: 0, y: 20 },
      { id: 'd1', name: 'D1', type: 'input', x: 0, y: 45 },
      { id: 'd2', name: 'D2', type: 'input', x: 0, y: 70 },
      { id: 'd3', name: 'D3', type: 'input', x: 0, y: 95 },
      { id: 'y0', name: 'Y0', type: 'output', x: 140, y: 35 },
      { id: 'y1', name: 'Y1', type: 'output', x: 140, y: 65 },
      { id: 'valid', name: 'V', type: 'output', x: 140, y: 95 }
    ],
    symbolType: 'box'
  },
  bcd_to_7seg: {
    type: 'bcd_to_7seg',
    name: 'BCD to 7-Segment Decoder',
    category: 'combinational',
    description: 'Decodes 4-bit BCD (A, B, C, D) into 7 display segments (a through g).',
    width: 150,
    height: 180,
    pins: [
      { id: 'a', name: 'A', type: 'input', x: 0, y: 30 },
      { id: 'b', name: 'B', type: 'input', x: 0, y: 65 },
      { id: 'c', name: 'C', type: 'input', x: 0, y: 100 },
      { id: 'd', name: 'D', type: 'input', x: 0, y: 135 },
      { id: 'out_a', name: 'a', type: 'output', x: 150, y: 20 },
      { id: 'out_b', name: 'b', type: 'output', x: 150, y: 45 },
      { id: 'out_c', name: 'c', type: 'output', x: 150, y: 70 },
      { id: 'out_d', name: 'd', type: 'output', x: 150, y: 95 },
      { id: 'out_e', name: 'e', type: 'output', x: 150, y: 120 },
      { id: 'out_f', name: 'f', type: 'output', x: 150, y: 145 },
      { id: 'out_g', name: 'g', type: 'output', x: 150, y: 170 }
    ],
    symbolType: 'box'
  },
  mux_8_1: {
    type: 'mux_8_1',
    name: '8:1 Multiplexer',
    category: 'combinational',
    description: 'Selects 1 of 8 data inputs (I0-I7) to output Y using 3 select lines (S0, S1, S2).',
    width: 140,
    height: 220,
    pins: [
      { id: 'i0', name: 'I0', type: 'input', x: 0, y: 20 },
      { id: 'i1', name: 'I1', type: 'input', x: 0, y: 45 },
      { id: 'i2', name: 'I2', type: 'input', x: 0, y: 70 },
      { id: 'i3', name: 'I3', type: 'input', x: 0, y: 95 },
      { id: 'i4', name: 'I4', type: 'input', x: 0, y: 120 },
      { id: 'i5', name: 'I5', type: 'input', x: 0, y: 145 },
      { id: 'i6', name: 'I6', type: 'input', x: 0, y: 170 },
      { id: 'i7', name: 'I7', type: 'input', x: 0, y: 195 },
      { id: 's0', name: 'S0', type: 'input', x: 35, y: 220 },
      { id: 's1', name: 'S1', type: 'input', x: 70, y: 220 },
      { id: 's2', name: 'S2', type: 'input', x: 105, y: 220 },
      { id: 'y', name: 'Y', type: 'output', x: 140, y: 90 },
      { id: 'y_bar', name: 'Y\'', type: 'output', x: 140, y: 130, invert: true }
    ],
    symbolType: 'box'
  },
  demux_1_8: {
    type: 'demux_1_8',
    name: '1:8 Demultiplexer',
    category: 'combinational',
    description: 'Routes 1 input line to one of 8 output lines (Y0-Y7) using 3 select lines (S0, S1, S2).',
    width: 140,
    height: 220,
    pins: [
      { id: 'in', name: 'IN', type: 'input', x: 0, y: 110 },
      { id: 's0', name: 'S0', type: 'input', x: 35, y: 220 },
      { id: 's1', name: 'S1', type: 'input', x: 70, y: 220 },
      { id: 's2', name: 'S2', type: 'input', x: 105, y: 220 },
      { id: 'y0', name: 'Y0', type: 'output', x: 140, y: 20 },
      { id: 'y1', name: 'Y1', type: 'output', x: 140, y: 45 },
      { id: 'y2', name: 'Y2', type: 'output', x: 140, y: 70 },
      { id: 'y3', name: 'Y3', type: 'output', x: 140, y: 95 },
      { id: 'y4', name: 'Y4', type: 'output', x: 140, y: 120 },
      { id: 'y5', name: 'Y5', type: 'output', x: 140, y: 145 },
      { id: 'y6', name: 'Y6', type: 'output', x: 140, y: 170 },
      { id: 'y7', name: 'Y7', type: 'output', x: 140, y: 195 }
    ],
    symbolType: 'box'
  },
  adder_subtractor_4bit: {
    type: 'adder_subtractor_4bit',
    name: '4-Bit Adder / Subtractor',
    category: 'combinational',
    description: '4-bit ripple carry adder and 2\'s complement subtractor controlled by Mode pin M (0=ADD, 1=SUB).',
    width: 170,
    height: 210,
    pins: [
      { id: 'm', name: 'M (ADD/SUB)', type: 'input', x: 0, y: 25 },
      { id: 'a0', name: 'A0', type: 'input', x: 0, y: 50 },
      { id: 'a1', name: 'A1', type: 'input', x: 0, y: 70 },
      { id: 'a2', name: 'A2', type: 'input', x: 0, y: 90 },
      { id: 'a3', name: 'A3', type: 'input', x: 0, y: 110 },
      { id: 'b0', name: 'B0', type: 'input', x: 0, y: 135 },
      { id: 'b1', name: 'B1', type: 'input', x: 0, y: 155 },
      { id: 'b2', name: 'B2', type: 'input', x: 0, y: 175 },
      { id: 'b3', name: 'B3', type: 'input', x: 0, y: 195 },
      { id: 's0', name: 'S0', type: 'output', x: 170, y: 45 },
      { id: 's1', name: 'S1', type: 'output', x: 170, y: 75 },
      { id: 's2', name: 'S2', type: 'output', x: 170, y: 105 },
      { id: 's3', name: 'S3', type: 'output', x: 170, y: 135 },
      { id: 'cout', name: 'COUT', type: 'output', x: 170, y: 165 },
      { id: 'v', name: 'V (OVR)', type: 'output', x: 170, y: 190 }
    ],
    symbolType: 'box'
  },
  decoder_2421_7seg: {
    type: 'decoder_2421_7seg',
    name: '2421 BCD Decoder',
    category: 'combinational',
    description: 'Decodes self-complementing 2421 (Aiken code) BCD into standard 7 segments for TIL-312 display.',
    width: 150,
    height: 180,
    pins: [
      { id: 'w2_msb', name: '2 (MSB)', type: 'input', x: 0, y: 35 },
      { id: 'w4', name: '4', type: 'input', x: 0, y: 70 },
      { id: 'w2_mid', name: '2', type: 'input', x: 0, y: 105 },
      { id: 'w1_lsb', name: '1 (LSB)', type: 'input', x: 0, y: 140 },
      { id: 'out_a', name: 'a', type: 'output', x: 150, y: 20 },
      { id: 'out_b', name: 'b', type: 'output', x: 150, y: 45 },
      { id: 'out_c', name: 'c', type: 'output', x: 150, y: 70 },
      { id: 'out_d', name: 'd', type: 'output', x: 150, y: 95 },
      { id: 'out_e', name: 'e', type: 'output', x: 150, y: 120 },
      { id: 'out_f', name: 'f', type: 'output', x: 150, y: 145 },
      { id: 'out_g', name: 'g', type: 'output', x: 150, y: 170 }
    ],
    symbolType: 'box'
  },

  // ==================== SEQUENTIAL CIRCUITS ====================
  sr_latch: {
    type: 'sr_latch',
    name: 'SR Latch',
    category: 'sequential',
    description: 'Bistable memory cell with Set (S) and Reset (R) active inputs.',
    width: 120,
    height: 90,
    pins: [
      { id: 's', name: 'S', type: 'input', x: 0, y: 25 },
      { id: 'r', name: 'R', type: 'input', x: 0, y: 65 },
      { id: 'q', name: 'Q', type: 'output', x: 120, y: 25 },
      { id: 'q_bar', name: 'Q\'', type: 'output', x: 120, y: 65, invert: true }
    ],
    defaultState: { q: 0 },
    symbolType: 'box'
  },
  d_flip_flop: {
    type: 'd_flip_flop',
    name: 'D Flip-Flop',
    category: 'sequential',
    description: 'Edge-triggered Data Flip-Flop. Captures D on rising clock edge.',
    width: 120,
    height: 100,
    pins: [
      { id: 'd', name: 'D', type: 'input', x: 0, y: 25 },
      { id: 'clk', name: 'CLK', type: 'input', x: 0, y: 55, isClock: true },
      { id: 'rst', name: 'RST', type: 'input', x: 60, y: 100 },
      { id: 'q', name: 'Q', type: 'output', x: 120, y: 25 },
      { id: 'q_bar', name: 'Q\'', type: 'output', x: 120, y: 65, invert: true }
    ],
    defaultState: { q: 0, lastClk: 0 },
    symbolType: 'box'
  },
  jk_flip_flop: {
    type: 'jk_flip_flop',
    name: 'JK Flip-Flop',
    category: 'sequential',
    description: 'Universal flip-flop with Toggle capability when J=1 and K=1.',
    width: 125,
    height: 110,
    pins: [
      { id: 'j', name: 'J', type: 'input', x: 0, y: 25 },
      { id: 'clk', name: 'CLK', type: 'input', x: 0, y: 55, isClock: true },
      { id: 'k', name: 'K', type: 'input', x: 0, y: 85 },
      { id: 'rst', name: 'CLR', type: 'input', x: 62, y: 110 },
      { id: 'q', name: 'Q', type: 'output', x: 125, y: 25 },
      { id: 'q_bar', name: 'Q\'', type: 'output', x: 125, y: 75, invert: true }
    ],
    defaultState: { q: 0, lastClk: 0 },
    symbolType: 'box'
  },
  t_flip_flop: {
    type: 't_flip_flop',
    name: 'T Flip-Flop',
    category: 'sequential',
    description: 'Toggle Flip-Flop. Toggles state on rising clock edge if T=1.',
    width: 120,
    height: 100,
    pins: [
      { id: 't', name: 'T', type: 'input', x: 0, y: 25 },
      { id: 'clk', name: 'CLK', type: 'input', x: 0, y: 65, isClock: true },
      { id: 'q', name: 'Q', type: 'output', x: 120, y: 25 },
      { id: 'q_bar', name: 'Q\'', type: 'output', x: 120, y: 65, invert: true }
    ],
    defaultState: { q: 0, lastClk: 0 },
    symbolType: 'box'
  },
  counter_4bit: {
    type: 'counter_4bit',
    name: '4-Bit Binary Counter',
    category: 'sequential',
    description: '4-bit synchronous binary up-counter (counts 0 to 15).',
    width: 140,
    height: 130,
    pins: [
      { id: 'clk', name: 'CLK', type: 'input', x: 0, y: 35, isClock: true },
      { id: 'rst', name: 'RST', type: 'input', x: 0, y: 85 },
      { id: 'q0', name: 'Q0', type: 'output', x: 140, y: 20 },
      { id: 'q1', name: 'Q1', type: 'output', x: 140, y: 45 },
      { id: 'q2', name: 'Q2', type: 'output', x: 140, y: 70 },
      { id: 'q3', name: 'Q3', type: 'output', x: 140, y: 95 }
    ],
    defaultState: { count: 0, lastClk: 0 },
    symbolType: 'box'
  },
  decade_counter: {
    type: 'decade_counter',
    name: 'Decade Counter (Mod-10)',
    category: 'sequential',
    description: 'Mod-10 BCD counter (counts 0 to 9) with Terminal Count output.',
    width: 150,
    height: 140,
    pins: [
      { id: 'clk', name: 'CLK', type: 'input', x: 0, y: 40, isClock: true },
      { id: 'rst', name: 'RST', type: 'input', x: 0, y: 90 },
      { id: 'q0', name: 'Q0', type: 'output', x: 150, y: 20 },
      { id: 'q1', name: 'Q1', type: 'output', x: 150, y: 45 },
      { id: 'q2', name: 'Q2', type: 'output', x: 150, y: 70 },
      { id: 'q3', name: 'Q3', type: 'output', x: 150, y: 95 },
      { id: 'tc', name: 'TC', type: 'output', x: 150, y: 120 }
    ],
    defaultState: { count: 0, lastClk: 0 },
    symbolType: 'box'
  },
  shift_reg_4bit: {
    type: 'shift_reg_4bit',
    name: '4-Bit Shift Register',
    category: 'sequential',
    description: 'Serial-in parallel-out (SIPO) and serial-out shift register.',
    width: 150,
    height: 130,
    pins: [
      { id: 'din', name: 'DIN', type: 'input', x: 0, y: 30 },
      { id: 'clk', name: 'CLK', type: 'input', x: 0, y: 65, isClock: true },
      { id: 'rst', name: 'RST', type: 'input', x: 0, y: 95 },
      { id: 'q0', name: 'Q0', type: 'output', x: 150, y: 20 },
      { id: 'q1', name: 'Q1', type: 'output', x: 150, y: 45 },
      { id: 'q2', name: 'Q2', type: 'output', x: 150, y: 70 },
      { id: 'q3', name: 'Q3', type: 'output', x: 150, y: 95 }
    ],
    defaultState: { bits: [0, 0, 0, 0], lastClk: 0 },
    symbolType: 'box'
  },
  clocked_sr_ff: {
    type: 'clocked_sr_ff',
    name: 'Clocked SR Flip-Flop',
    category: 'sequential',
    description: 'SR Flip-Flop enabled with clock/gate signal (S, CLK, R).',
    width: 125,
    height: 110,
    pins: [
      { id: 's', name: 'S', type: 'input', x: 0, y: 25 },
      { id: 'clk', name: 'CLK', type: 'input', x: 0, y: 55, isClock: true },
      { id: 'r', name: 'R', type: 'input', x: 0, y: 85 },
      { id: 'q', name: 'Q', type: 'output', x: 125, y: 25 },
      { id: 'q_bar', name: 'Q\'', type: 'output', x: 125, y: 75, invert: true }
    ],
    defaultState: { q: 0, lastClk: 0 },
    symbolType: 'box'
  },
  ring_counter_4bit: {
    type: 'ring_counter_4bit',
    name: '4-Bit Ring Counter',
    category: 'sequential',
    description: 'Circulating shift register ring counter (1000 -> 0100 -> 0010 -> 0001).',
    width: 150,
    height: 130,
    pins: [
      { id: 'clk', name: 'CLK', type: 'input', x: 0, y: 40, isClock: true },
      { id: 'rst', name: 'PRE/RST', type: 'input', x: 0, y: 85 },
      { id: 'q0', name: 'Q0', type: 'output', x: 150, y: 20 },
      { id: 'q1', name: 'Q1', type: 'output', x: 150, y: 45 },
      { id: 'q2', name: 'Q2', type: 'output', x: 150, y: 70 },
      { id: 'q3', name: 'Q3', type: 'output', x: 150, y: 95 }
    ],
    defaultState: { stateIndex: 0, lastClk: 0 },
    symbolType: 'box'
  },

  // ==================== OUTPUTS ====================
  led: {
    type: 'led',
    name: 'LED (Red)',
    category: 'outputs',
    description: 'Digital LED indicator. Emits bright red glow on Logic 1.',
    width: 70,
    height: 60,
    pins: [
      { id: 'in', name: 'IN', type: 'input', x: 0, y: 30 }
    ],
    defaultState: { color: 'red' },
    symbolType: 'box'
  },
  led_green: {
    type: 'led_green',
    name: 'LED (Green)',
    category: 'outputs',
    description: 'Green digital indicator LED.',
    width: 70,
    height: 60,
    pins: [
      { id: 'in', name: 'IN', type: 'input', x: 0, y: 30 }
    ],
    defaultState: { color: 'green' },
    symbolType: 'box'
  },
  led_blue: {
    type: 'led_blue',
    name: 'LED (Blue)',
    category: 'outputs',
    description: 'Blue digital indicator LED.',
    width: 70,
    height: 60,
    pins: [
      { id: 'in', name: 'IN', type: 'input', x: 0, y: 30 }
    ],
    defaultState: { color: 'blue' },
    symbolType: 'box'
  },
  led_yellow: {
    type: 'led_yellow',
    name: 'LED (Yellow)',
    category: 'outputs',
    description: 'Yellow digital indicator LED.',
    width: 70,
    height: 60,
    pins: [
      { id: 'in', name: 'IN', type: 'input', x: 0, y: 30 }
    ],
    defaultState: { color: 'yellow' },
    symbolType: 'box'
  },
  seven_segment: {
    type: 'seven_segment',
    name: '7-Segment Display',
    category: 'outputs',
    description: 'Standard 7-segment display with direct segment control (a, b, c, d, e, f, g, dp).',
    width: 140,
    height: 180,
    pins: [
      { id: 'a', name: 'a', type: 'input', x: 0, y: 20 },
      { id: 'b', name: 'b', type: 'input', x: 0, y: 40 },
      { id: 'c', name: 'c', type: 'input', x: 0, y: 60 },
      { id: 'd', name: 'd', type: 'input', x: 0, y: 80 },
      { id: 'e', name: 'e', type: 'input', x: 0, y: 100 },
      { id: 'f', name: 'f', type: 'input', x: 0, y: 120 },
      { id: 'g', name: 'g', type: 'input', x: 0, y: 140 },
      { id: 'dp', name: 'dp', type: 'input', x: 0, y: 160 }
    ],
    symbolType: 'box'
  },
  til312_display: {
    type: 'til312_display',
    name: 'TIL-312 7-Segment Display',
    category: 'outputs',
    description: 'Classic Texas Instruments TIL-312 0.3-inch red 7-segment LED display with decimal point.',
    width: 140,
    height: 190,
    pins: [
      { id: 'a', name: 'a', type: 'input', x: 0, y: 20 },
      { id: 'b', name: 'b', type: 'input', x: 0, y: 42 },
      { id: 'c', name: 'c', type: 'input', x: 0, y: 64 },
      { id: 'd', name: 'd', type: 'input', x: 0, y: 86 },
      { id: 'e', name: 'e', type: 'input', x: 0, y: 108 },
      { id: 'f', name: 'f', type: 'input', x: 0, y: 130 },
      { id: 'g', name: 'g', type: 'input', x: 0, y: 152 },
      { id: 'dp', name: 'dp', type: 'input', x: 0, y: 174 }
    ],
    symbolType: 'box'
  },
  bcd_display: {
    type: 'bcd_display',
    name: 'BCD 7-Segment (Auto)',
    category: 'outputs',
    description: 'Single-digit 7-segment display with built-in BCD decoder (inputs D0-D3).',
    width: 110,
    height: 140,
    pins: [
      { id: 'd0', name: 'D0', type: 'input', x: 0, y: 25 },
      { id: 'd1', name: 'D1', type: 'input', x: 0, y: 55 },
      { id: 'd2', name: 'D2', type: 'input', x: 0, y: 85 },
      { id: 'd3', name: 'D3', type: 'input', x: 0, y: 115 }
    ],
    symbolType: 'box'
  },
  buzzer: {
    type: 'buzzer',
    name: 'Audio Buzzer',
    category: 'outputs',
    description: 'Audible beeper that produces an audio tone through your phone speaker when HIGH.',
    width: 85,
    height: 70,
    pins: [
      { id: 'in', name: 'IN', type: 'input', x: 0, y: 35 }
    ],
    symbolType: 'box'
  },
  probe: {
    type: 'probe',
    name: 'Logic State Probe',
    category: 'outputs',
    description: 'Digital logic test probe displaying exact state: 0 (LOW), 1 (HIGH), or Z (FLOATING).',
    width: 80,
    height: 55,
    pins: [
      { id: 'in', name: 'IN', type: 'input', x: 0, y: 27 }
    ],
    symbolType: 'box'
  },
  bar_graph_4: {
    type: 'bar_graph_4',
    name: '4-LED Bar Graph',
    category: 'outputs',
    description: 'Compact 4-bar linear LED indicator.',
    width: 90,
    height: 120,
    pins: [
      { id: 'in0', name: 'L0', type: 'input', x: 0, y: 20 },
      { id: 'in1', name: 'L1', type: 'input', x: 0, y: 50 },
      { id: 'in2', name: 'L2', type: 'input', x: 0, y: 80 },
      { id: 'in3', name: 'L3', type: 'input', x: 0, y: 110 }
    ],
    symbolType: 'box'
  },

  // ==================== 74-SERIES IC CHIPS (VIRTUAL IC PINOUT) ====================
  ic_7400: {
    type: 'ic_7400',
    name: '7400 Quad 2-In NAND',
    category: 'chips74',
    description: 'DIP-14 IC containing four independent 2-input NAND gates.',
    icNumber: '7400',
    width: 170,
    height: 200,
    pins: [
      // Left side (Pins 1-7)
      { id: 'p1', name: '1A', type: 'input', x: 0, y: 30 },
      { id: 'p2', name: '1B', type: 'input', x: 0, y: 55 },
      { id: 'p3', name: '1Y', type: 'output', x: 0, y: 80 },
      { id: 'p4', name: '2A', type: 'input', x: 0, y: 105 },
      { id: 'p5', name: '2B', type: 'input', x: 0, y: 130 },
      { id: 'p6', name: '2Y', type: 'output', x: 0, y: 155 },
      { id: 'p7', name: 'GND', type: 'input', x: 0, y: 180 },
      // Right side (Pins 8-14)
      { id: 'p8', name: '3Y', type: 'output', x: 170, y: 180 },
      { id: 'p9', name: '3A', type: 'input', x: 170, y: 155 },
      { id: 'p10', name: '3B', type: 'input', x: 170, y: 130 },
      { id: 'p11', name: '4Y', type: 'output', x: 170, y: 105 },
      { id: 'p12', name: '4A', type: 'input', x: 170, y: 80 },
      { id: 'p13', name: '4B', type: 'input', x: 170, y: 55 },
      { id: 'p14', name: 'VCC', type: 'input', x: 170, y: 30 }
    ],
    symbolType: 'ic'
  },
  ic_7402: {
    type: 'ic_7402',
    name: '7402 Quad 2-In NOR',
    category: 'chips74',
    description: 'DIP-14 IC containing four independent 2-input NOR gates.',
    icNumber: '7402',
    width: 170,
    height: 200,
    pins: [
      { id: 'p1', name: '1Y', type: 'output', x: 0, y: 30 },
      { id: 'p2', name: '1A', type: 'input', x: 0, y: 55 },
      { id: 'p3', name: '1B', type: 'input', x: 0, y: 80 },
      { id: 'p4', name: '2Y', type: 'output', x: 0, y: 105 },
      { id: 'p5', name: '2A', type: 'input', x: 0, y: 130 },
      { id: 'p6', name: '2B', type: 'input', x: 0, y: 155 },
      { id: 'p7', name: 'GND', type: 'input', x: 0, y: 180 },
      { id: 'p8', name: '3A', type: 'input', x: 170, y: 180 },
      { id: 'p9', name: '3B', type: 'input', x: 170, y: 155 },
      { id: 'p10', name: '3Y', type: 'output', x: 170, y: 130 },
      { id: 'p11', name: '4A', type: 'input', x: 170, y: 105 },
      { id: 'p12', name: '4B', type: 'input', x: 170, y: 80 },
      { id: 'p13', name: '4Y', type: 'output', x: 170, y: 55 },
      { id: 'p14', name: 'VCC', type: 'input', x: 170, y: 30 }
    ],
    symbolType: 'ic'
  },
  ic_7404: {
    type: 'ic_7404',
    name: '7404 Hex Inverter',
    category: 'chips74',
    description: 'DIP-14 IC containing six independent NOT inverters.',
    icNumber: '7404',
    width: 170,
    height: 200,
    pins: [
      { id: 'p1', name: '1A', type: 'input', x: 0, y: 30 },
      { id: 'p2', name: '1Y', type: 'output', x: 0, y: 55 },
      { id: 'p3', name: '2A', type: 'input', x: 0, y: 80 },
      { id: 'p4', name: '2Y', type: 'output', x: 0, y: 105 },
      { id: 'p5', name: '3A', type: 'input', x: 0, y: 130 },
      { id: 'p6', name: '3Y', type: 'output', x: 0, y: 155 },
      { id: 'p7', name: 'GND', type: 'input', x: 0, y: 180 },
      { id: 'p8', name: '4Y', type: 'output', x: 170, y: 180 },
      { id: 'p9', name: '4A', type: 'input', x: 170, y: 155 },
      { id: 'p10', name: '5Y', type: 'output', x: 170, y: 130 },
      { id: 'p11', name: '5A', type: 'input', x: 170, y: 105 },
      { id: 'p12', name: '6Y', type: 'output', x: 170, y: 80 },
      { id: 'p13', name: '6A', type: 'input', x: 170, y: 55 },
      { id: 'p14', name: 'VCC', type: 'input', x: 170, y: 30 }
    ],
    symbolType: 'ic'
  },
  ic_7408: {
    type: 'ic_7408',
    name: '7408 Quad 2-In AND',
    category: 'chips74',
    description: 'DIP-14 IC containing four independent 2-input AND gates.',
    icNumber: '7408',
    width: 170,
    height: 200,
    pins: [
      { id: 'p1', name: '1A', type: 'input', x: 0, y: 30 },
      { id: 'p2', name: '1B', type: 'input', x: 0, y: 55 },
      { id: 'p3', name: '1Y', type: 'output', x: 0, y: 80 },
      { id: 'p4', name: '2A', type: 'input', x: 0, y: 105 },
      { id: 'p5', name: '2B', type: 'input', x: 0, y: 130 },
      { id: 'p6', name: '2Y', type: 'output', x: 0, y: 155 },
      { id: 'p7', name: 'GND', type: 'input', x: 0, y: 180 },
      { id: 'p8', name: '3Y', type: 'output', x: 170, y: 180 },
      { id: 'p9', name: '3A', type: 'input', x: 170, y: 155 },
      { id: 'p10', name: '3B', type: 'input', x: 170, y: 130 },
      { id: 'p11', name: '4Y', type: 'output', x: 170, y: 105 },
      { id: 'p12', name: '4A', type: 'input', x: 170, y: 80 },
      { id: 'p13', name: '4B', type: 'input', x: 170, y: 55 },
      { id: 'p14', name: 'VCC', type: 'input', x: 170, y: 30 }
    ],
    symbolType: 'ic'
  },
  ic_7432: {
    type: 'ic_7432',
    name: '7432 Quad 2-In OR',
    category: 'chips74',
    description: 'DIP-14 IC containing four independent 2-input OR gates.',
    icNumber: '7432',
    width: 170,
    height: 200,
    pins: [
      { id: 'p1', name: '1A', type: 'input', x: 0, y: 30 },
      { id: 'p2', name: '1B', type: 'input', x: 0, y: 55 },
      { id: 'p3', name: '1Y', type: 'output', x: 0, y: 80 },
      { id: 'p4', name: '2A', type: 'input', x: 0, y: 105 },
      { id: 'p5', name: '2B', type: 'input', x: 0, y: 130 },
      { id: 'p6', name: '2Y', type: 'output', x: 0, y: 155 },
      { id: 'p7', name: 'GND', type: 'input', x: 0, y: 180 },
      { id: 'p8', name: '3Y', type: 'output', x: 170, y: 180 },
      { id: 'p9', name: '3A', type: 'input', x: 170, y: 155 },
      { id: 'p10', name: '3B', type: 'input', x: 170, y: 130 },
      { id: 'p11', name: '4Y', type: 'output', x: 170, y: 105 },
      { id: 'p12', name: '4A', type: 'input', x: 170, y: 80 },
      { id: 'p13', name: '4B', type: 'input', x: 170, y: 55 },
      { id: 'p14', name: 'VCC', type: 'input', x: 170, y: 30 }
    ],
    symbolType: 'ic'
  },
  ic_7486: {
    type: 'ic_7486',
    name: '7486 Quad 2-In XOR',
    category: 'chips74',
    description: 'DIP-14 IC containing four independent 2-input XOR gates.',
    icNumber: '7486',
    width: 170,
    height: 200,
    pins: [
      { id: 'p1', name: '1A', type: 'input', x: 0, y: 30 },
      { id: 'p2', name: '1B', type: 'input', x: 0, y: 55 },
      { id: 'p3', name: '1Y', type: 'output', x: 0, y: 80 },
      { id: 'p4', name: '2A', type: 'input', x: 0, y: 105 },
      { id: 'p5', name: '2B', type: 'input', x: 0, y: 130 },
      { id: 'p6', name: '2Y', type: 'output', x: 0, y: 155 },
      { id: 'p7', name: 'GND', type: 'input', x: 0, y: 180 },
      { id: 'p8', name: '3Y', type: 'output', x: 170, y: 180 },
      { id: 'p9', name: '3A', type: 'input', x: 170, y: 155 },
      { id: 'p10', name: '3B', type: 'input', x: 170, y: 130 },
      { id: 'p11', name: '4Y', type: 'output', x: 170, y: 105 },
      { id: 'p12', name: '4A', type: 'input', x: 170, y: 80 },
      { id: 'p13', name: '4B', type: 'input', x: 170, y: 55 },
      { id: 'p14', name: 'VCC', type: 'input', x: 170, y: 30 }
    ],
    symbolType: 'ic'
  },
  ic_7474: {
    type: 'ic_7474',
    name: '7474 Dual D-FF',
    category: 'chips74',
    description: 'DIP-14 IC with two independent D Flip-Flops with Preset and Clear.',
    icNumber: '7474',
    width: 170,
    height: 200,
    pins: [
      { id: 'p1', name: '1CLR', type: 'input', x: 0, y: 30 },
      { id: 'p2', name: '1D', type: 'input', x: 0, y: 55 },
      { id: 'p3', name: '1CLK', type: 'input', x: 0, y: 80, isClock: true },
      { id: 'p4', name: '1PRE', type: 'input', x: 0, y: 105 },
      { id: 'p5', name: '1Q', type: 'output', x: 0, y: 130 },
      { id: 'p6', name: '1Q\'', type: 'output', x: 0, y: 155 },
      { id: 'p7', name: 'GND', type: 'input', x: 0, y: 180 },
      { id: 'p8', name: '2Q\'', type: 'output', x: 170, y: 180 },
      { id: 'p9', name: '2Q', type: 'output', x: 170, y: 155 },
      { id: 'p10', name: '2PRE', type: 'input', x: 170, y: 130 },
      { id: 'p11', name: '2CLK', type: 'input', x: 170, y: 105, isClock: true },
      { id: 'p12', name: '2D', type: 'input', x: 170, y: 80 },
      { id: 'p13', name: '2CLR', type: 'input', x: 170, y: 55 },
      { id: 'p14', name: 'VCC', type: 'input', x: 170, y: 30 }
    ],
    defaultState: { q1: 0, lastClk1: 0, q2: 0, lastClk2: 0 },
    symbolType: 'ic'
  },
  ic_7447: {
    type: 'ic_7447',
    name: '7447 BCD to 7-Segment',
    category: 'chips74',
    description: 'DIP-16 IC BCD to 7-segment decoder/driver (active low outputs).',
    icNumber: '7447',
    width: 175,
    height: 220,
    pins: [
      { id: 'p1', name: 'B', type: 'input', x: 0, y: 25 },
      { id: 'p2', name: 'C', type: 'input', x: 0, y: 50 },
      { id: 'p3', name: 'LT', type: 'input', x: 0, y: 75 },
      { id: 'p4', name: 'BI', type: 'input', x: 0, y: 100 },
      { id: 'p5', name: 'RBI', type: 'input', x: 0, y: 125 },
      { id: 'p6', name: 'D', type: 'input', x: 0, y: 150 },
      { id: 'p7', name: 'A', type: 'input', x: 0, y: 175 },
      { id: 'p8', name: 'GND', type: 'input', x: 0, y: 200 },
      { id: 'p9', name: 'e', type: 'output', x: 175, y: 200 },
      { id: 'p10', name: 'd', type: 'output', x: 175, y: 175 },
      { id: 'p11', name: 'c', type: 'output', x: 175, y: 150 },
      { id: 'p12', name: 'b', type: 'output', x: 175, y: 125 },
      { id: 'p13', name: 'a', type: 'output', x: 175, y: 100 },
      { id: 'p14', name: 'g', type: 'output', x: 175, y: 75 },
      { id: 'p15', name: 'f', type: 'output', x: 175, y: 50 },
      { id: 'p16', name: 'VCC', type: 'input', x: 175, y: 25 }
    ],
    symbolType: 'ic'
  },
  ic_555: {
    type: 'ic_555',
    name: 'NE555 Timer IC',
    category: 'chips74',
    description: 'DIP-8 standard 555 precision timer oscillator/pulse generator.',
    icNumber: '555',
    width: 150,
    height: 140,
    pins: [
      { id: 'p1', name: 'GND', type: 'input', x: 0, y: 25 },
      { id: 'p2', name: 'TRIG', type: 'input', x: 0, y: 55 },
      { id: 'p3', name: 'OUT', type: 'output', x: 0, y: 85 },
      { id: 'p4', name: 'RST', type: 'input', x: 0, y: 115 },
      { id: 'p5', name: 'CTRL', type: 'input', x: 150, y: 115 },
      { id: 'p6', name: 'THR', type: 'input', x: 150, y: 85 },
      { id: 'p7', name: 'DIS', type: 'output', x: 150, y: 55 },
      { id: 'p8', name: 'VCC', type: 'input', x: 150, y: 25 }
    ],
    defaultState: { isOscillating: true, outState: 0 },
    symbolType: 'ic'
  }
};
