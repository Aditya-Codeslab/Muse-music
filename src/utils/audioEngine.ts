/**
 * Web Audio synthesizer fallback engine.
 * Generates pleasant ambient melodic patterns if an external MP3 stream fails or is blocked by CORS.
 */
class SynthEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timer: number | null = null;
  private gainNode: GainNode | null = null;
  private tempo = 100;
  private noteIndex = 0;

  private notes = [
    261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25,
    392.0, 329.63, 440.0, 392.0, 329.63, 293.66, 261.63, 329.63,
  ];

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public play() {
    if (this.isPlaying) return;
    try {
      const ctx = this.getContext();
      this.isPlaying = true;
      this.gainNode = ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
      this.gainNode.connect(ctx.destination);

      const step = () => {
        if (!this.isPlaying || !this.ctx || !this.gainNode) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        // Harmonious chord voicing
        const freq = this.notes[this.noteIndex % this.notes.length];
        osc.type = this.noteIndex % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        noteGain.gain.setValueAtTime(0.001, now);
        noteGain.gain.exponentialRampToValueAtTime(0.12, now + 0.05);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        osc.connect(noteGain);
        noteGain.connect(this.gainNode);

        osc.start(now);
        osc.stop(now + 0.5);

        this.noteIndex++;
        const intervalMs = (60 / this.tempo) * 500;
        this.timer = window.setTimeout(step, intervalMs);
      };

      step();
    } catch {
      // AudioContext might be blocked until user gesture
    }
  }

  public pause() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  public setVolume(vol: number) {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, vol * 0.2)), this.ctx.currentTime);
    }
  }
}

export const fallbackSynth = new SynthEngine();
