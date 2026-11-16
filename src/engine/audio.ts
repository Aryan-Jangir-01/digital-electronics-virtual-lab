// Web Audio API Synthesizer and Mobile Haptics

class SoundEngine {
  private ctx: AudioContext | null = null;
  private buzzerOsc: OscillatorNode | null = null;
  private buzzerGain: GainNode | null = null;
  public soundEnabled: boolean = true;
  public hapticsEnabled: boolean = true;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Trigger mobile haptic vibration
  public vibrate(pattern: number | number[] = 20) {
    if (this.hapticsEnabled && typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Ignore if forbidden by browser
      }
    }
  }

  // Click sound for toggle switches and buttons
  public playClick(highPitch: boolean = false) {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(highPitch ? 880 : 440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // Audio fallback
    }
  }

  // Positive chime for connecting wires or completing tests
  public playConnect() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, this.ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, this.ctx.currentTime + 0.06); // A5

      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.16);
    } catch {}
  }

  // Delete sound
  public playDelete() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch {}
  }

  // Manage continuous buzzer component sound
  public setBuzzerActive(active: boolean) {
    if (!this.soundEnabled || !active) {
      if (this.buzzerOsc) {
        try {
          this.buzzerOsc.stop();
          this.buzzerOsc.disconnect();
        } catch {}
        this.buzzerOsc = null;
      }
      return;
    }

    this.initContext();
    if (!this.ctx) return;

    if (!this.buzzerOsc) {
      try {
        this.buzzerOsc = this.ctx.createOscillator();
        this.buzzerGain = this.ctx.createGain();

        this.buzzerOsc.type = 'square';
        this.buzzerOsc.frequency.setValueAtTime(1000, this.ctx.currentTime); // 1kHz tone

        this.buzzerGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

        this.buzzerOsc.connect(this.buzzerGain);
        this.buzzerGain.connect(this.ctx.destination);

        this.buzzerOsc.start();
      } catch {
        this.buzzerOsc = null;
      }
    }
  }
}

export const soundEngine = new SoundEngine();
