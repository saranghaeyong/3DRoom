/**
 * Procedural Web Audio synthesizer for ambient room atmosphere and interactive clicks
 * Completely client-side, zero external assets, muted/OFF by default.
 */

class SoundManager {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private isMuted: boolean = true;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (!this.isMuted) {
      this.startAmbient();
      this.playClick(660);
    } else {
      this.stopAmbient();
    }
    return !this.isMuted;
  }

  public getIsPlaying(): boolean {
    return !this.isMuted;
  }

  private startAmbient() {
    try {
      this.initContext();
      if (!this.ctx) return;

      this.stopAmbient();

      // Master ambient gain node - very gentle, warm, and soft
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.ambientGain.gain.exponentialRampToValueAtTime(0.035, this.ctx.currentTime + 3);
      this.ambientGain.connect(this.ctx.destination);

      // Warm soothing chord frequencies (F major 7th / gentle pentatonic harmony)
      const frequencies = [174.61, 220.0, 261.63, 329.63]; // F3, A3, C4, E4

      frequencies.forEach((freq) => {
        if (!this.ctx || !this.ambientGain) return;
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();

        // Low-pass filter for soft warm acoustic bedroom tone
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 420;

        osc.type = 'sine';
        osc.frequency.value = freq;
        oscGain.gain.value = 0.25;

        osc.connect(filter);
        filter.connect(oscGain);
        oscGain.connect(this.ambientGain);

        osc.start();
        this.oscillators.push(osc);
      });
    } catch {
      // Audio autoplay policy handled silently
    }
  }

  private stopAmbient() {
    if (this.ambientGain && this.ctx) {
      try {
        this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, this.ctx.currentTime);
        this.ambientGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);
      } catch {
        // Safe catch
      }
    }
    setTimeout(() => {
      this.oscillators.forEach(osc => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // ignore
        }
      });
      this.oscillators = [];
    }, 900);
  }

  public playClick(freq = 520) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.3, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.13);
    } catch {
      // ignore
    }
  }

  public playInspect() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.07, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.24);
    } catch {
      // ignore
    }
  }
}

export const soundManager = new SoundManager();
