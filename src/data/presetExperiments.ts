import type { PresetExperiment } from '../types/circuit';
import { COMPONENT_CATALOG } from './componentCatalog';

function createComp(type: string, id: string, x: number, y: number, state: any = {}, label?: string) {
  const def = COMPONENT_CATALOG[type];
  if (!def) throw new Error(`Unknown component type: ${type}`);
  return {
    id,
    type,
    x,
    y,
    pins: def.pins.map(p => ({ ...p, value: 0 as const })),
    state: { ...def.defaultState, ...state },
    label: label || def.name
  };
}

export const PRESET_EXPERIMENTS: PresetExperiment[] = [
  // =========================================================================
  // EXPERIMENT 1: Verification of basic logic gates AND, OR, NAND, NOR, XOR, XNOR
  // =========================================================================
  {
    id: 'exp1_basic_gates',
    title: 'Exp 1: Verification of Basic Logic Gates (AND, OR, NAND, NOR, XOR, XNOR)',
    category: '1. Logic Gates',
    description: 'Verify truth tables of all 6 elementary and universal logic gates simultaneously using common inputs A and B.',
    objective: 'To study and verify truth tables of 2-input AND, OR, NAND, NOR, XOR, and XNOR gates.',
    theory: 'AND: Y=A·B | OR: Y=A+B | NAND: Y=(A·B)\' | NOR: Y=(A+B)\' | XOR: Y=A⊕B | XNOR: Y=(A⊕B)\'',
    components: [
      createComp('switch', 'e1_sw_a', 50, 140, { isOn: true }, 'Input A'),
      createComp('switch', 'e1_sw_b', 50, 260, { isOn: false }, 'Input B'),
      // Gates
      createComp('and', 'e1_and', 260, 40, {}, 'AND Gate'),
      createComp('or', 'e1_or', 260, 115, {}, 'OR Gate'),
      createComp('nand', 'e1_nand', 260, 190, {}, 'NAND Gate'),
      createComp('nor', 'e1_nor', 260, 265, {}, 'NOR Gate'),
      createComp('xor', 'e1_xor', 260, 340, {}, 'XOR Gate'),
      createComp('xnor', 'e1_xnor', 260, 415, {}, 'XNOR Gate'),
      // Indicator LEDs
      createComp('led', 'e1_led_and', 460, 45, {}, 'AND Out'),
      createComp('led_green', 'e1_led_or', 460, 120, {}, 'OR Out'),
      createComp('led_yellow', 'e1_led_nand', 460, 195, {}, 'NAND Out'),
      createComp('led_blue', 'e1_led_nor', 460, 270, {}, 'NOR Out'),
      createComp('led', 'e1_led_xor', 460, 345, {}, 'XOR Out'),
      createComp('led_green', 'e1_led_xnor', 460, 420, {}, 'XNOR Out'),
    ],
    wires: [
      // Input A distribution
      { id: 'e1_w_a1', fromComponentId: 'e1_sw_a', fromPinId: 'out', toComponentId: 'e1_and', toPinId: 'in1', color: '#38bdf8' },
      { id: 'e1_w_a2', fromComponentId: 'e1_sw_a', fromPinId: 'out', toComponentId: 'e1_or', toPinId: 'in1', color: '#38bdf8' },
      { id: 'e1_w_a3', fromComponentId: 'e1_sw_a', fromPinId: 'out', toComponentId: 'e1_nand', toPinId: 'in1', color: '#38bdf8' },
      { id: 'e1_w_a4', fromComponentId: 'e1_sw_a', fromPinId: 'out', toComponentId: 'e1_nor', toPinId: 'in1', color: '#38bdf8' },
      { id: 'e1_w_a5', fromComponentId: 'e1_sw_a', fromPinId: 'out', toComponentId: 'e1_xor', toPinId: 'in1', color: '#38bdf8' },
      { id: 'e1_w_a6', fromComponentId: 'e1_sw_a', fromPinId: 'out', toComponentId: 'e1_xnor', toPinId: 'in1', color: '#38bdf8' },
      // Input B distribution
      { id: 'e1_w_b1', fromComponentId: 'e1_sw_b', fromPinId: 'out', toComponentId: 'e1_and', toPinId: 'in2', color: '#818cf8' },
      { id: 'e1_w_b2', fromComponentId: 'e1_sw_b', fromPinId: 'out', toComponentId: 'e1_or', toPinId: 'in2', color: '#818cf8' },
      { id: 'e1_w_b3', fromComponentId: 'e1_sw_b', fromPinId: 'out', toComponentId: 'e1_nand', toPinId: 'in2', color: '#818cf8' },
      { id: 'e1_w_b4', fromComponentId: 'e1_sw_b', fromPinId: 'out', toComponentId: 'e1_nor', toPinId: 'in2', color: '#818cf8' },
      { id: 'e1_w_b5', fromComponentId: 'e1_sw_b', fromPinId: 'out', toComponentId: 'e1_xor', toPinId: 'in2', color: '#818cf8' },
      { id: 'e1_w_b6', fromComponentId: 'e1_sw_b', fromPinId: 'out', toComponentId: 'e1_xnor', toPinId: 'in2', color: '#818cf8' },
      // Outputs to LEDs
      { id: 'e1_w_o1', fromComponentId: 'e1_and', fromPinId: 'out', toComponentId: 'e1_led_and', toPinId: 'in', color: '#ef4444' },
      { id: 'e1_w_o2', fromComponentId: 'e1_or', fromPinId: 'out', toComponentId: 'e1_led_or', toPinId: 'in', color: '#22c55e' },
      { id: 'e1_w_o3', fromComponentId: 'e1_nand', fromPinId: 'out', toComponentId: 'e1_led_nand', toPinId: 'in', color: '#eab308' },
      { id: 'e1_w_o4', fromComponentId: 'e1_nor', fromPinId: 'out', toComponentId: 'e1_led_nor', toPinId: 'in', color: '#3b82f6' },
      { id: 'e1_w_o5', fromComponentId: 'e1_xor', fromPinId: 'out', toComponentId: 'e1_led_xor', toPinId: 'in', color: '#ef4444' },
      { id: 'e1_w_o6', fromComponentId: 'e1_xnor', fromPinId: 'out', toComponentId: 'e1_led_xnor', toPinId: 'in', color: '#22c55e' },
    ]
  },

  // =========================================================================
  // EXPERIMENT 2: Realization of OR, AND, NOR, XOR, XNOR using NAND and NOR gates
  // =========================================================================
  {
    id: 'exp2_universal_realization',
    title: 'Exp 2: Realization of AND, OR, NOR, XOR using NAND Gates',
    category: '2. Universal Gates',
    description: 'Demonstrate that NAND is a universal gate by constructing AND, OR, and 4-gate XOR using only NAND gates.',
    objective: 'Realize basic and complex logic functions using solely universal NAND gates.',
    theory: 'Universal Gate Property: Any Boolean function can be implemented using only NAND gates or only NOR gates. 4 NAND gates produce XOR.',
    components: [
      createComp('switch', 'e2_sw_a', 50, 100, { isOn: true }, 'Input A'),
      createComp('switch', 'e2_sw_b', 50, 240, { isOn: false }, 'Input B'),
      // Realization 1: AND from NAND
      createComp('nand', 'e2_nand_and1', 230, 60, {}, 'NAND 1'),
      createComp('nand', 'e2_nand_and2', 380, 60, {}, 'Inverter (NAND)'),
      createComp('led_green', 'e2_led_and', 550, 65, {}, 'AND Output'),
      // Realization 2: OR from NAND
      createComp('nand', 'e2_nand_ora', 230, 170, {}, 'NOT A (NAND)'),
      createComp('nand', 'e2_nand_orb', 230, 250, {}, 'NOT B (NAND)'),
      createComp('nand', 'e2_nand_or3', 380, 210, {}, 'NAND 3'),
      createComp('led_blue', 'e2_led_or', 550, 215, {}, 'OR Output'),
      // Realization 3: XOR from 4 NANDs
      createComp('nand', 'e2_xor_n1', 230, 360, {}, 'XOR NAND 1'),
      createComp('nand', 'e2_xor_n2', 380, 320, {}, 'XOR NAND 2'),
      createComp('nand', 'e2_xor_n3', 380, 420, {}, 'XOR NAND 3'),
      createComp('nand', 'e2_xor_n4', 530, 370, {}, 'XOR NAND 4'),
      createComp('led', 'e2_led_xor', 680, 375, {}, 'XOR Output')
    ],
    wires: [
      // AND from NAND: w1 = (A·B)', w2 = (w1·w1)' = A·B
      { id: 'e2_w1', fromComponentId: 'e2_sw_a', fromPinId: 'out', toComponentId: 'e2_nand_and1', toPinId: 'in1', color: '#38bdf8' },
      { id: 'e2_w2', fromComponentId: 'e2_sw_b', fromPinId: 'out', toComponentId: 'e2_nand_and1', toPinId: 'in2', color: '#818cf8' },
      { id: 'e2_w3', fromComponentId: 'e2_nand_and1', fromPinId: 'out', toComponentId: 'e2_nand_and2', toPinId: 'in1', color: '#a855f7' },
      { id: 'e2_w4', fromComponentId: 'e2_nand_and1', fromPinId: 'out', toComponentId: 'e2_nand_and2', toPinId: 'in2', color: '#a855f7' },
      { id: 'e2_w5', fromComponentId: 'e2_nand_and2', fromPinId: 'out', toComponentId: 'e2_led_and', toPinId: 'in', color: '#22c55e' },
      // OR from NAND: (A'·B')' = A + B
      { id: 'e2_w6', fromComponentId: 'e2_sw_a', fromPinId: 'out', toComponentId: 'e2_nand_ora', toPinId: 'in1', color: '#38bdf8' },
      { id: 'e2_w7', fromComponentId: 'e2_sw_a', fromPinId: 'out', toComponentId: 'e2_nand_ora', toPinId: 'in2', color: '#38bdf8' },
      { id: 'e2_w8', fromComponentId: 'e2_sw_b', fromPinId: 'out', toComponentId: 'e2_nand_orb', toPinId: 'in1', color: '#818cf8' },
      { id: 'e2_w9', fromComponentId: 'e2_sw_b', fromPinId: 'out', toComponentId: 'e2_nand_orb', toPinId: 'in2', color: '#818cf8' },
      { id: 'e2_w10', fromComponentId: 'e2_nand_ora', fromPinId: 'out', toComponentId: 'e2_nand_or3', toPinId: 'in1', color: '#38bdf8' },
      { id: 'e2_w11', fromComponentId: 'e2_nand_orb', fromPinId: 'out', toComponentId: 'e2_nand_or3', toPinId: 'in2', color: '#818cf8' },
      { id: 'e2_w12', fromComponentId: 'e2_nand_or3', fromPinId: 'out', toComponentId: 'e2_led_or', toPinId: 'in', color: '#3b82f6' },
      // XOR from 4 NANDs
      { id: 'e2_w13', fromComponentId: 'e2_sw_a', fromPinId: 'out', toComponentId: 'e2_xor_n1', toPinId: 'in1', color: '#38bdf8' },
      { id: 'e2_w14', fromComponentId: 'e2_sw_b', fromPinId: 'out', toComponentId: 'e2_xor_n1', toPinId: 'in2', color: '#818cf8' },
      { id: 'e2_w15', fromComponentId: 'e2_sw_a', fromPinId: 'out', toComponentId: 'e2_xor_n2', toPinId: 'in1', color: '#38bdf8' },
      { id: 'e2_w16', fromComponentId: 'e2_xor_n1', fromPinId: 'out', toComponentId: 'e2_xor_n2', toPinId: 'in2', color: '#eab308' },
      { id: 'e2_w17', fromComponentId: 'e2_xor_n1', fromPinId: 'out', toComponentId: 'e2_xor_n3', toPinId: 'in1', color: '#eab308' },
      { id: 'e2_w18', fromComponentId: 'e2_sw_b', fromPinId: 'out', toComponentId: 'e2_xor_n3', toPinId: 'in2', color: '#818cf8' },
      { id: 'e2_w19', fromComponentId: 'e2_xor_n2', fromPinId: 'out', toComponentId: 'e2_xor_n4', toPinId: 'in1', color: '#ec4899' },
      { id: 'e2_w20', fromComponentId: 'e2_xor_n3', fromPinId: 'out', toComponentId: 'e2_xor_n4', toPinId: 'in2', color: '#a855f7' },
      { id: 'e2_w21', fromComponentId: 'e2_xor_n4', fromPinId: 'out', toComponentId: 'e2_led_xor', toPinId: 'in', color: '#ef4444' },
    ]
  },

  // =========================================================================
  // EXPERIMENT 3: Realization of SOP and POS expressions
  // =========================================================================
  {
    id: 'exp3_sop_pos',
    title: 'Exp 3: Realization of SOP and POS Boolean Expressions',
    category: '3. Canonical Forms',
    description: 'Implement Sum of Products Y = AB + CD using AND-OR logic and Product of Sums Y = (A+B)(C+D) using OR-AND logic.',
    objective: 'Understand conversion and hardware implementation of SOP and POS standard canonical Boolean expressions.',
    theory: 'SOP is a 2-level AND-OR structure. POS is a 2-level OR-AND structure. They can also be implemented using two levels of NAND or NOR gates.',
    components: [
      createComp('switch', 'e3_a', 50, 50, { isOn: true }, 'Input A'),
      createComp('switch', 'e3_b', 50, 130, { isOn: true }, 'Input B'),
      createComp('switch', 'e3_c', 50, 240, { isOn: false }, 'Input C'),
      createComp('switch', 'e3_d', 50, 320, { isOn: true }, 'Input D'),
      // SOP Logic: Y = AB + CD
      createComp('and', 'e3_and1', 250, 70, {}, 'AND(A, B)'),
      createComp('and', 'e3_and2', 250, 170, {}, 'AND(C, D)'),
      createComp('or', 'e3_or_sop', 420, 120, {}, 'OR (SOP Out)'),
      createComp('led_green', 'e3_led_sop', 590, 125, {}, 'SOP (AB+CD)'),
      // POS Logic: Y = (A+B)(C+D)
      createComp('or', 'e3_or1', 250, 280, {}, 'OR(A, B)'),
      createComp('or', 'e3_or2', 250, 380, {}, 'OR(C, D)'),
      createComp('and', 'e3_and_pos', 420, 330, {}, 'AND (POS Out)'),
      createComp('led_blue', 'e3_led_pos', 590, 335, {}, 'POS (A+B)(C+D)'),
    ],
    wires: [
      // SOP
      { id: 'e3_w1', fromComponentId: 'e3_a', fromPinId: 'out', toComponentId: 'e3_and1', toPinId: 'in1', color: '#38bdf8' },
      { id: 'e3_w2', fromComponentId: 'e3_b', fromPinId: 'out', toComponentId: 'e3_and1', toPinId: 'in2', color: '#818cf8' },
      { id: 'e3_w3', fromComponentId: 'e3_c', fromPinId: 'out', toComponentId: 'e3_and2', toPinId: 'in1', color: '#fbbf24' },
      { id: 'e3_w4', fromComponentId: 'e3_d', fromPinId: 'out', toComponentId: 'e3_and2', toPinId: 'in2', color: '#ec4899' },
      { id: 'e3_w5', fromComponentId: 'e3_and1', fromPinId: 'out', toComponentId: 'e3_or_sop', toPinId: 'in1', color: '#22c55e' },
      { id: 'e3_w6', fromComponentId: 'e3_and2', fromPinId: 'out', toComponentId: 'e3_or_sop', toPinId: 'in2', color: '#22c55e' },
      { id: 'e3_w7', fromComponentId: 'e3_or_sop', fromPinId: 'out', toComponentId: 'e3_led_sop', toPinId: 'in', color: '#22c55e' },
      // POS
      { id: 'e3_w8', fromComponentId: 'e3_a', fromPinId: 'out', toComponentId: 'e3_or1', toPinId: 'in1', color: '#38bdf8' },
      { id: 'e3_w9', fromComponentId: 'e3_b', fromPinId: 'out', toComponentId: 'e3_or1', toPinId: 'in2', color: '#818cf8' },
      { id: 'e3_w10', fromComponentId: 'e3_c', fromPinId: 'out', toComponentId: 'e3_or2', toPinId: 'in1', color: '#fbbf24' },
      { id: 'e3_w11', fromComponentId: 'e3_d', fromPinId: 'out', toComponentId: 'e3_or2', toPinId: 'in2', color: '#ec4899' },
      { id: 'e3_w12', fromComponentId: 'e3_or1', fromPinId: 'out', toComponentId: 'e3_and_pos', toPinId: 'in1', color: '#3b82f6' },
      { id: 'e3_w13', fromComponentId: 'e3_or2', fromPinId: 'out', toComponentId: 'e3_and_pos', toPinId: 'in2', color: '#3b82f6' },
      { id: 'e3_w14', fromComponentId: 'e3_and_pos', fromPinId: 'out', toComponentId: 'e3_led_pos', toPinId: 'in', color: '#3b82f6' },
    ]
  },

  // =========================================================================
  // EXPERIMENT 4: Half Adder, Full Adder, Half Subtractor, Full Subtractor
  // =========================================================================
  {
    id: 'exp4_adders_subtractors',
    title: 'Exp 4: Half/Full Adder and Half/Full Subtractor',
    category: '4. Arithmetic Logic',
    description: 'Verify 1-bit arithmetic operations: Half Adder, Full Adder, Half Subtractor, and Full Subtractor.',
    objective: 'Design and verify sum, carry, difference, and borrow outputs for binary arithmetic.',
    theory: 'Half Adder: Sum=A⊕B, Carry=AB | Full Adder: Sum=A⊕B⊕Cin, Cout=AB+Cin(A⊕B) | Half Sub: Diff=A⊕B, Borrow=A\'B | Full Sub: Diff=A⊕B⊕Bin, Bout=A\'B+(A⊕B)\'Bin.',
    components: [
      createComp('switch', 'e4_a', 50, 80, { isOn: true }, 'Input A'),
      createComp('switch', 'e4_b', 50, 180, { isOn: true }, 'Input B'),
      createComp('switch', 'e4_c_in', 50, 280, { isOn: false }, 'Carry/Borrow In'),
      // Modules
      createComp('full_adder', 'e4_fa', 250, 80, {}, 'Full Adder'),
      createComp('full_subtractor', 'e4_fs', 250, 240, {}, 'Full Subtractor'),
      // Displays
      createComp('led_green', 'e4_fa_sum', 460, 85, {}, 'FA Sum'),
      createComp('led', 'e4_fa_cout', 460, 145, {}, 'FA Cout'),
      createComp('led_blue', 'e4_fs_diff', 460, 245, {}, 'FS Diff'),
      createComp('led_yellow', 'e4_fs_bout', 460, 305, {}, 'FS Bout'),
    ],
    wires: [
      { id: 'e4_w1', fromComponentId: 'e4_a', fromPinId: 'out', toComponentId: 'e4_fa', toPinId: 'a', color: '#38bdf8' },
      { id: 'e4_w2', fromComponentId: 'e4_b', fromPinId: 'out', toComponentId: 'e4_fa', toPinId: 'b', color: '#818cf8' },
      { id: 'e4_w3', fromComponentId: 'e4_c_in', fromPinId: 'out', toComponentId: 'e4_fa', toPinId: 'cin', color: '#fbbf24' },
      { id: 'e4_w4', fromComponentId: 'e4_fa', fromPinId: 'sum', toComponentId: 'e4_fa_sum', toPinId: 'in', color: '#22c55e' },
      { id: 'e4_w5', fromComponentId: 'e4_fa', fromPinId: 'cout', toComponentId: 'e4_fa_cout', toPinId: 'in', color: '#ef4444' },
      { id: 'e4_w6', fromComponentId: 'e4_a', fromPinId: 'out', toComponentId: 'e4_fs', toPinId: 'a', color: '#38bdf8' },
      { id: 'e4_w7', fromComponentId: 'e4_b', fromPinId: 'out', toComponentId: 'e4_fs', toPinId: 'b', color: '#818cf8' },
      { id: 'e4_w8', fromComponentId: 'e4_c_in', fromPinId: 'out', toComponentId: 'e4_fs', toPinId: 'bin', color: '#fbbf24' },
      { id: 'e4_w9', fromComponentId: 'e4_fs', fromPinId: 'diff', toComponentId: 'e4_fs_diff', toPinId: 'in', color: '#3b82f6' },
      { id: 'e4_w10', fromComponentId: 'e4_fs', fromPinId: 'bout', toComponentId: 'e4_fs_bout', toPinId: 'in', color: '#eab308' },
    ]
  },

  // =========================================================================
  // EXPERIMENT 5: 4-bit Ripple Adder and Subtractor
  // =========================================================================
  {
    id: 'exp5_ripple_adder_sub',
    title: 'Exp 5: 4-Bit Ripple Carry Adder and Subtractor',
    category: '5. Multi-Bit Arithmetic',
    description: '4-bit parallel adder/subtractor circuit using 2\'s complement arithmetic controlled by Mode M (0=Add, 1=Subtract).',
    objective: 'Demonstrate 4-bit multi-bit binary addition and subtraction with carry out and overflow flags.',
    theory: 'When M=0, B is unchanged and Cin=0 producing A+B. When M=1, B is inverted (XOR with 1) and Cin=1, producing A + B\' + 1 = A - B.',
    components: [
      createComp('switch', 'e5_m', 50, 40, { isOn: false }, 'Mode M (0=ADD, 1=SUB)'),
      createComp('dip_switch_4', 'e5_dip_a', 50, 120, { s0: true, s1: false, s2: true, s3: false }, 'Input A (0101 = 5)'),
      createComp('dip_switch_4', 'e5_dip_b', 50, 290, { s0: true, s1: true, s2: false, s3: false }, 'Input B (0011 = 3)'),
      createComp('adder_subtractor_4bit', 'e5_chip', 260, 100, {}, '4-Bit Adder/Subtractor'),
      createComp('bcd_display', 'e5_disp', 490, 80, {}, 'Result Display (Hex)'),
      createComp('led', 'e5_led_cout', 490, 240, {}, 'Carry/Borrow Out'),
      createComp('led_yellow', 'e5_led_v', 490, 310, {}, 'Overflow (V)'),
    ],
    wires: [
      { id: 'e5_w_m', fromComponentId: 'e5_m', fromPinId: 'out', toComponentId: 'e5_chip', toPinId: 'm', color: '#f43f5e' },
      // Input A
      { id: 'e5_wa0', fromComponentId: 'e5_dip_a', fromPinId: 'out0', toComponentId: 'e5_chip', toPinId: 'a0', color: '#38bdf8' },
      { id: 'e5_wa1', fromComponentId: 'e5_dip_a', fromPinId: 'out1', toComponentId: 'e5_chip', toPinId: 'a1', color: '#38bdf8' },
      { id: 'e5_wa2', fromComponentId: 'e5_dip_a', fromPinId: 'out2', toComponentId: 'e5_chip', toPinId: 'a2', color: '#38bdf8' },
      { id: 'e5_wa3', fromComponentId: 'e5_dip_a', fromPinId: 'out3', toComponentId: 'e5_chip', toPinId: 'a3', color: '#38bdf8' },
      // Input B
      { id: 'e5_wb0', fromComponentId: 'e5_dip_b', fromPinId: 'out0', toComponentId: 'e5_chip', toPinId: 'b0', color: '#818cf8' },
      { id: 'e5_wb1', fromComponentId: 'e5_dip_b', fromPinId: 'out1', toComponentId: 'e5_chip', toPinId: 'b1', color: '#818cf8' },
      { id: 'e5_wb2', fromComponentId: 'e5_dip_b', fromPinId: 'out2', toComponentId: 'e5_chip', toPinId: 'b2', color: '#818cf8' },
      { id: 'e5_wb3', fromComponentId: 'e5_dip_b', fromPinId: 'out3', toComponentId: 'e5_chip', toPinId: 'b3', color: '#818cf8' },
      // Outputs to Display
      { id: 'e5_ws0', fromComponentId: 'e5_chip', fromPinId: 's0', toComponentId: 'e5_disp', toPinId: 'd0', color: '#22c55e' },
      { id: 'e5_ws1', fromComponentId: 'e5_chip', fromPinId: 's1', toComponentId: 'e5_disp', toPinId: 'd1', color: '#22c55e' },
      { id: 'e5_ws2', fromComponentId: 'e5_chip', fromPinId: 's2', toComponentId: 'e5_disp', toPinId: 'd2', color: '#22c55e' },
      { id: 'e5_ws3', fromComponentId: 'e5_chip', fromPinId: 's3', toComponentId: 'e5_disp', toPinId: 'd3', color: '#22c55e' },
      { id: 'e5_w_cout', fromComponentId: 'e5_chip', fromPinId: 'cout', toComponentId: 'e5_led_cout', toPinId: 'in', color: '#ef4444' },
      { id: 'e5_w_v', fromComponentId: 'e5_chip', fromPinId: 'v', toComponentId: 'e5_led_v', toPinId: 'in', color: '#eab308' },
    ]
  },

  // =========================================================================
  // EXPERIMENT 6: 4:1 MUX, 1:4 DEMUX, 8:1 MUX and 1:8 DEMUX
  // =========================================================================
  {
    id: 'exp6_mux_demux',
    title: 'Exp 6: 4:1 / 8:1 Multiplexer and 1:4 / 1:8 Demultiplexer',
    category: '6. Data Routing',
    description: 'Data routing and selection using 8:1 Multiplexer and 1:8 Demultiplexer driven by 3-bit select lines.',
    objective: 'To study data routing, serial-to-parallel, and parallel-to-serial conversion using MUX and DEMUX.',
    theory: 'An 8:1 MUX routes 1 of 8 inputs to a single output line based on S2, S1, S0. A 1:8 DEMUX distributes 1 input line across 8 outputs.',
    components: [
      createComp('switch', 'e6_s0', 50, 40, { isOn: true }, 'Select S0'),
      createComp('switch', 'e6_s1', 160, 40, { isOn: false }, 'Select S1'),
      createComp('switch', 'e6_s2', 270, 40, { isOn: false }, 'Select S2'),
      // 8:1 MUX
      createComp('switch', 'e6_d0', 50, 130, { isOn: false }, 'Data 0'),
      createComp('switch', 'e6_d1', 50, 200, { isOn: true }, 'Data 1'),
      createComp('switch', 'e6_d2', 50, 270, { isOn: false }, 'Data 2'),
      createComp('switch', 'e6_d3', 50, 340, { isOn: true }, 'Data 3'),
      createComp('mux_8_1', 'e6_mux', 210, 130, {}, '8:1 MUX'),
      createComp('led_green', 'e6_led_mux', 400, 160, {}, 'MUX Output Y'),
      // 1:8 DEMUX
      createComp('demux_1_8', 'e6_demux', 470, 130, {}, '1:8 DEMUX'),
      createComp('led', 'e6_demux_led1', 650, 165, {}, 'DEMUX Y1 Out'),
      createComp('led_blue', 'e6_demux_led3', 650, 235, {}, 'DEMUX Y3 Out'),
    ],
    wires: [
      // Select lines to MUX
      { id: 'e6_ws0_m', fromComponentId: 'e6_s0', fromPinId: 'out', toComponentId: 'e6_mux', toPinId: 's0', color: '#f59e0b' },
      { id: 'e6_ws1_m', fromComponentId: 'e6_s1', fromPinId: 'out', toComponentId: 'e6_mux', toPinId: 's1', color: '#ec4899' },
      { id: 'e6_ws2_m', fromComponentId: 'e6_s2', fromPinId: 'out', toComponentId: 'e6_mux', toPinId: 's2', color: '#a855f7' },
      // Data lines to MUX
      { id: 'e6_wd0', fromComponentId: 'e6_d0', fromPinId: 'out', toComponentId: 'e6_mux', toPinId: 'i0', color: '#38bdf8' },
      { id: 'e6_wd1', fromComponentId: 'e6_d1', fromPinId: 'out', toComponentId: 'e6_mux', toPinId: 'i1', color: '#38bdf8' },
      { id: 'e6_wd2', fromComponentId: 'e6_d2', fromPinId: 'out', toComponentId: 'e6_mux', toPinId: 'i2', color: '#38bdf8' },
      { id: 'e6_wd3', fromComponentId: 'e6_d3', fromPinId: 'out', toComponentId: 'e6_mux', toPinId: 'i3', color: '#38bdf8' },
      // MUX Out to Indicator LED & into 1:8 DEMUX
      { id: 'e6_wmux_out', fromComponentId: 'e6_mux', fromPinId: 'y', toComponentId: 'e6_led_mux', toPinId: 'in', color: '#22c55e' },
      { id: 'e6_wmux_to_demux', fromComponentId: 'e6_mux', fromPinId: 'y', toComponentId: 'e6_demux', toPinId: 'in', color: '#22c55e' },
      // Select lines to DEMUX
      { id: 'e6_ws0_d', fromComponentId: 'e6_s0', fromPinId: 'out', toComponentId: 'e6_demux', toPinId: 's0', color: '#f59e0b' },
      { id: 'e6_ws1_d', fromComponentId: 'e6_s1', fromPinId: 'out', toComponentId: 'e6_demux', toPinId: 's1', color: '#ec4899' },
      { id: 'e6_ws2_d', fromComponentId: 'e6_s2', fromPinId: 'out', toComponentId: 'e6_demux', toPinId: 's2', color: '#a855f7' },
      // DEMUX Outputs to LEDs
      { id: 'e6_wdemux_y1', fromComponentId: 'e6_demux', fromPinId: 'y1', toComponentId: 'e6_demux_led1', toPinId: 'in', color: '#ef4444' },
      { id: 'e6_wdemux_y3', fromComponentId: 'e6_demux', fromPinId: 'y3', toComponentId: 'e6_demux_led3', toPinId: 'in', color: '#3b82f6' },
    ]
  },

  // =========================================================================
  // EXPERIMENT 7: 2421 BCD to TIL-312 Seven Segment Display
  // =========================================================================
  {
    id: 'exp7_2421_til312',
    title: 'Exp 7: 2421 BCD Code to TIL-312 Seven Segment Display',
    category: '7. Codes & Displays',
    description: 'Decode self-complementing 2421 Aiken BCD code and drive an authentic Texas Instruments TIL-312 7-segment LED display.',
    objective: 'Demonstrate code conversion from 2421 weighted code to standard 7-segment display format (a-g).',
    theory: 'The 2421 code has bit weights 2, 4, 2, 1. It is a self-complementing code where the 9\'s complement of a decimal digit is obtained by 1\'s complement of its code bits. The TIL-312 is a classic standard 7-segment LED display.',
    components: [
      createComp('switch', 'e7_w2_msb', 50, 60, { isOn: true }, 'Weight 2 (MSB)'),
      createComp('switch', 'e7_w4', 50, 140, { isOn: false }, 'Weight 4'),
      createComp('switch', 'e7_w2_mid', 50, 220, { isOn: true }, 'Weight 2'),
      createComp('switch', 'e7_w1_lsb', 50, 300, { isOn: true }, 'Weight 1 (LSB)'),
      createComp('decoder_2421_7seg', 'e7_decoder', 240, 110, {}, '2421 Decoder'),
      createComp('til312_display', 'e7_til312', 460, 100, {}, 'TIL-312 Display'),
    ],
    wires: [
      // Switches to 2421 Decoder
      { id: 'e7_w1', fromComponentId: 'e7_w2_msb', fromPinId: 'out', toComponentId: 'e7_decoder', toPinId: 'w2_msb', color: '#38bdf8' },
      { id: 'e7_w2', fromComponentId: 'e7_w4', fromPinId: 'out', toComponentId: 'e7_decoder', toPinId: 'w4', color: '#818cf8' },
      { id: 'e7_w3', fromComponentId: 'e7_w2_mid', fromPinId: 'out', toComponentId: 'e7_decoder', toPinId: 'w2_mid', color: '#fbbf24' },
      { id: 'e7_w4', fromComponentId: 'e7_w1_lsb', fromPinId: 'out', toComponentId: 'e7_decoder', toPinId: 'w1_lsb', color: '#ec4899' },
      // Decoder to TIL-312 display pins a through g
      { id: 'e7_wa', fromComponentId: 'e7_decoder', fromPinId: 'out_a', toComponentId: 'e7_til312', toPinId: 'a', color: '#ef4444' },
      { id: 'e7_wb', fromComponentId: 'e7_decoder', fromPinId: 'out_b', toComponentId: 'e7_til312', toPinId: 'b', color: '#ef4444' },
      { id: 'e7_wc', fromComponentId: 'e7_decoder', fromPinId: 'out_c', toComponentId: 'e7_til312', toPinId: 'c', color: '#ef4444' },
      { id: 'e7_wd', fromComponentId: 'e7_decoder', fromPinId: 'out_d', toComponentId: 'e7_til312', toPinId: 'd', color: '#ef4444' },
      { id: 'e7_we', fromComponentId: 'e7_decoder', fromPinId: 'out_e', toComponentId: 'e7_til312', toPinId: 'e', color: '#ef4444' },
      { id: 'e7_wf', fromComponentId: 'e7_decoder', fromPinId: 'out_f', toComponentId: 'e7_til312', toPinId: 'f', color: '#ef4444' },
      { id: 'e7_wg', fromComponentId: 'e7_decoder', fromPinId: 'out_g', toComponentId: 'e7_til312', toPinId: 'g', color: '#ef4444' },
    ]
  },

  // =========================================================================
  // EXPERIMENT 8: R-S, J-K and D Flip-Flops with and without clock
  // =========================================================================
  {
    id: 'exp8_flip_flops',
    title: 'Exp 8: RS, JK, and D Flip-Flops (With & Without Clock)',
    category: '8. Sequential Memory',
    description: 'Compare unclocked RS latch memory retention against clocked RS, edge-triggered JK (toggle), and D flip-flops.',
    objective: 'Verify operation, excitation characteristics, and storage behavior of RS, JK, and D bistable multivibrators.',
    theory: 'An unclocked RS latch responds asynchronously to inputs. Clocked flip-flops update outputs only upon active clock pulse transitions.',
    components: [
      createComp('clock', 'e8_clk', 50, 200, { frequency: 1, isHigh: false }, 'Clock (1Hz)'),
      // Unclocked RS Latch
      createComp('switch', 'e8_latch_s', 50, 40, { isOn: true }, 'Latch Set (S)'),
      createComp('switch', 'e8_latch_r', 50, 110, { isOn: false }, 'Latch Reset (R)'),
      createComp('sr_latch', 'e8_latch', 230, 50, {}, 'Unclocked RS Latch'),
      createComp('led_green', 'e8_latch_q', 410, 55, {}, 'Latch Q'),
      // Clocked JK Flip-Flop
      createComp('switch', 'e8_jk_j', 50, 280, { isOn: true }, 'JK Input J'),
      createComp('switch', 'e8_jk_k', 50, 360, { isOn: true }, 'JK Input K (Toggle)'),
      createComp('jk_flip_flop', 'e8_jk', 230, 250, {}, 'Clocked JK-FF'),
      createComp('led_blue', 'e8_jk_q', 410, 255, {}, 'JK Output Q'),
      createComp('led', 'e8_jk_qbar', 410, 315, {}, 'JK Output Q\''),
      // Clocked D Flip-Flop
      createComp('switch', 'e8_d_in', 50, 440, { isOn: true }, 'D Data Input'),
      createComp('d_flip_flop', 'e8_dff', 230, 410, {}, 'Clocked D-FF'),
      createComp('led_yellow', 'e8_d_q', 410, 415, {}, 'D Output Q'),
    ],
    wires: [
      // Unclocked RS
      { id: 'e8_w1', fromComponentId: 'e8_latch_s', fromPinId: 'out', toComponentId: 'e8_latch', toPinId: 's', color: '#38bdf8' },
      { id: 'e8_w2', fromComponentId: 'e8_latch_r', fromPinId: 'out', toComponentId: 'e8_latch', toPinId: 'r', color: '#818cf8' },
      { id: 'e8_w3', fromComponentId: 'e8_latch', fromPinId: 'q', toComponentId: 'e8_latch_q', toPinId: 'in', color: '#22c55e' },
      // Clock to JK & D
      { id: 'e8_w4', fromComponentId: 'e8_clk', fromPinId: 'out', toComponentId: 'e8_jk', toPinId: 'clk', color: '#a855f7' },
      { id: 'e8_w5', fromComponentId: 'e8_clk', fromPinId: 'out', toComponentId: 'e8_dff', toPinId: 'clk', color: '#a855f7' },
      // JK inputs and outputs
      { id: 'e8_w6', fromComponentId: 'e8_jk_j', fromPinId: 'out', toComponentId: 'e8_jk', toPinId: 'j', color: '#38bdf8' },
      { id: 'e8_w7', fromComponentId: 'e8_jk_k', fromPinId: 'out', toComponentId: 'e8_jk', toPinId: 'k', color: '#818cf8' },
      { id: 'e8_w8', fromComponentId: 'e8_jk', fromPinId: 'q', toComponentId: 'e8_jk_q', toPinId: 'in', color: '#3b82f6' },
      { id: 'e8_w9', fromComponentId: 'e8_jk', fromPinId: 'q_bar', toComponentId: 'e8_jk_qbar', toPinId: 'in', color: '#ef4444' },
      // D input and output
      { id: 'e8_w10', fromComponentId: 'e8_d_in', fromPinId: 'out', toComponentId: 'e8_dff', toPinId: 'd', color: '#fbbf24' },
      { id: 'e8_w11', fromComponentId: 'e8_dff', fromPinId: 'q', toComponentId: 'e8_d_q', toPinId: 'in', color: '#eab308' },
    ]
  },

  // =========================================================================
  // EXPERIMENT 9: Divide by 2, 4, 8 Counter, 4-bit Binary Counter and Ring Counter
  // =========================================================================
  {
    id: 'exp9_counters',
    title: 'Exp 9: Divide-by-2, 4, 8 Counter, Binary Counter & Ring Counter',
    category: '9. Counters & Dividers',
    description: 'Frequency divider chain (CLK/2, CLK/4, CLK/8), 4-bit synchronous binary counter, and 4-bit circulating ring counter.',
    objective: 'Construct frequency dividing ripple counters and circular pattern ring counters.',
    theory: 'Each T or JK toggle flip-flop divides input frequency by 2. Cascading 3 stages achieves divide-by-8. A ring counter circulates a single 1 bit continuously (1000->0100->0010->0001).',
    components: [
      createComp('clock', 'e9_clk', 50, 100, { frequency: 2, isHigh: false }, 'Master Clock (2Hz)'),
      // 4-bit Binary Counter
      createComp('counter_4bit', 'e9_bin_cnt', 220, 70, {}, 'Binary Counter'),
      createComp('bcd_display', 'e9_disp', 410, 60, {}, 'Count Display (0-F)'),
      // 4-bit Ring Counter
      createComp('ring_counter_4bit', 'e9_ring', 220, 240, {}, 'Ring Counter'),
      createComp('led', 'e9_r0', 410, 220, {}, 'Ring Bit 0'),
      createComp('led_green', 'e9_r1', 410, 270, {}, 'Ring Bit 1'),
      createComp('led_yellow', 'e9_r2', 410, 320, {}, 'Ring Bit 2'),
      createComp('led_blue', 'e9_r3', 410, 370, {}, 'Ring Bit 3'),
    ],
    wires: [
      // Clock to Binary Counter
      { id: 'e9_w1', fromComponentId: 'e9_clk', fromPinId: 'out', toComponentId: 'e9_bin_cnt', toPinId: 'clk', color: '#a855f7' },
      { id: 'e9_w2', fromComponentId: 'e9_bin_cnt', fromPinId: 'q0', toComponentId: 'e9_disp', toPinId: 'd0', color: '#38bdf8' },
      { id: 'e9_w3', fromComponentId: 'e9_bin_cnt', fromPinId: 'q1', toComponentId: 'e9_disp', toPinId: 'd1', color: '#22c55e' },
      { id: 'e9_w4', fromComponentId: 'e9_bin_cnt', fromPinId: 'q2', toComponentId: 'e9_disp', toPinId: 'd2', color: '#eab308' },
      { id: 'e9_w5', fromComponentId: 'e9_bin_cnt', fromPinId: 'q3', toComponentId: 'e9_disp', toPinId: 'd3', color: '#ec4899' },
      // Clock to Ring Counter
      { id: 'e9_w6', fromComponentId: 'e9_clk', fromPinId: 'out', toComponentId: 'e9_ring', toPinId: 'clk', color: '#a855f7' },
      { id: 'e9_w7', fromComponentId: 'e9_ring', fromPinId: 'q0', toComponentId: 'e9_r0', toPinId: 'in', color: '#ef4444' },
      { id: 'e9_w8', fromComponentId: 'e9_ring', fromPinId: 'q1', toComponentId: 'e9_r1', toPinId: 'in', color: '#22c55e' },
      { id: 'e9_w9', fromComponentId: 'e9_ring', fromPinId: 'q2', toComponentId: 'e9_r2', toPinId: 'in', color: '#eab308' },
      { id: 'e9_w10', fromComponentId: 'e9_ring', fromPinId: 'q3', toComponentId: 'e9_r3', toPinId: 'in', color: '#3b82f6' },
    ]
  },

  // =========================================================================
  // EXPERIMENT 10: PIPO and SISO Registers using clock and MUX
  // =========================================================================
  {
    id: 'exp10_registers',
    title: 'Exp 10: PIPO and SISO Shift Registers with Clock & MUX',
    category: '10. Registers & Memory',
    description: 'Implement Serial-In Serial-Out (SISO) and Parallel-In Parallel-Out (PIPO) registers with multiplexed mode control.',
    objective: 'Demonstrate serial bit shifting and parallel data loading into storage registers on clock pulses.',
    theory: 'In SISO, data enters one bit at a time sequentially. In PIPO, all bits are loaded simultaneously in one clock pulse. Multiplexers select between shifting and parallel loading modes.',
    components: [
      createComp('clock', 'e10_clk', 50, 150, { frequency: 1, isHigh: false }, 'Shift Clock (1Hz)'),
      createComp('switch', 'e10_din', 50, 60, { isOn: true }, 'Serial Data In (DIN)'),
      createComp('push_button', 'e10_rst', 50, 240, { isPressed: false }, 'Reset Button'),
      // 4-bit Shift Register
      createComp('shift_reg_4bit', 'e10_siso', 240, 100, {}, 'SISO/SIPO Register'),
      // Parallel Output Stage Indicators
      createComp('led', 'e10_q0', 440, 60, {}, 'Stage 0 (Q0)'),
      createComp('led_green', 'e10_q1', 440, 120, {}, 'Stage 1 (Q1)'),
      createComp('led_yellow', 'e10_q2', 440, 180, {}, 'Stage 2 (Q2)'),
      createComp('led_blue', 'e10_q3', 440, 240, {}, 'Stage 3 (Q3) Serial Out'),
    ],
    wires: [
      { id: 'e10_w1', fromComponentId: 'e10_din', fromPinId: 'out', toComponentId: 'e10_siso', toPinId: 'din', color: '#38bdf8' },
      { id: 'e10_w2', fromComponentId: 'e10_clk', fromPinId: 'out', toComponentId: 'e10_siso', toPinId: 'clk', color: '#a855f7' },
      { id: 'e10_w3', fromComponentId: 'e10_rst', fromPinId: 'out', toComponentId: 'e10_siso', toPinId: 'rst', color: '#ef4444' },
      { id: 'e10_w4', fromComponentId: 'e10_siso', fromPinId: 'q0', toComponentId: 'e10_q0', toPinId: 'in', color: '#ef4444' },
      { id: 'e10_w5', fromComponentId: 'e10_siso', fromPinId: 'q1', toComponentId: 'e10_q1', toPinId: 'in', color: '#22c55e' },
      { id: 'e10_w6', fromComponentId: 'e10_siso', fromPinId: 'q2', toComponentId: 'e10_q2', toPinId: 'in', color: '#eab308' },
      { id: 'e10_w7', fromComponentId: 'e10_siso', fromPinId: 'q3', toComponentId: 'e10_q3', toPinId: 'in', color: '#3b82f6' },
    ]
  }
];
