import type { JiaobeiOutcome } from '../types';

let sharedCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  if (!sharedCtx) {
    sharedCtx = new Ctx();
  }
  if (sharedCtx.state === 'suspended') {
    sharedCtx.resume().catch(() => {});
  }
  return sharedCtx;
}

/** Call from a user gesture so later, gesture-less sounds are allowed on iOS. */
export function warmUpAudio(): void {
  getAudioContext();
}

export function playThrowWhoosh(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const duration = 0.24;
  const bufferSize = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    const env = Math.sin((i / bufferSize) * Math.PI);
    data[i] = (Math.random() * 2 - 1) * env * 0.28;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(420, now);
  filter.frequency.exponentialRampToValueAtTime(1150, now + duration);
  filter.Q.value = 1.4;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.01, now);
  gain.gain.linearRampToValueAtTime(0.22, now + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  noise.start(now);
}

function triggerWoodClack(ctx: AudioContext, startTime: number, pitchHz: number, volume: number): void {
  // Primary wood body resonance
  const osc = ctx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(pitchHz, startTime);
  osc.frequency.exponentialRampToValueAtTime(pitchHz * 0.48, startTime + 0.075);

  const oscGain = ctx.createGain();
  oscGain.gain.setValueAtTime(volume, startTime);
  oscGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.085);

  // Crisp transient click
  const clickLen = Math.floor(ctx.sampleRate * 0.018);
  const clickBuf = ctx.createBuffer(1, clickLen, ctx.sampleRate);
  const clickData = clickBuf.getChannelData(0);
  for (let i = 0; i < clickLen; i++) {
    clickData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (clickLen * 0.28));
  }
  const clickSrc = ctx.createBufferSource();
  clickSrc.buffer = clickBuf;

  const bandpass = ctx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.setValueAtTime(pitchHz * 2.1, startTime);
  bandpass.Q.value = 2.6;

  const clickGain = ctx.createGain();
  clickGain.gain.setValueAtTime(volume * 0.85, startTime);
  clickGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.022);

  osc.connect(oscGain);
  oscGain.connect(ctx.destination);
  clickSrc.connect(bandpass);
  bandpass.connect(clickGain);
  clickGain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + 0.09);
  clickSrc.start(startTime);
}

function triggerOutcomeTone(ctx: AudioContext, startTime: number, outcome: JiaobeiOutcome): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  if (outcome === '圣茭') {
    // Clear warm bell-wood harmonic
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, startTime); // D5
    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(0.11, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.55);
  } else if (outcome === '笑茭') {
    // Light double wood chime
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(493.88, startTime); // B4
    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(0.08, startTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);
  } else {
    // Low muted wooden resonance
    osc.type = 'sine';
    osc.frequency.setValueAtTime(246.94, startTime); // B3
    osc.frequency.exponentialRampToValueAtTime(210, startTime + 0.28);
    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(0.11, startTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.34);
  }

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(startTime);
  osc.stop(startTime + 0.6);
}

export function playWoodLand(outcome: JiaobeiOutcome): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Twin blocks clatter slightly staggered + subtle second bounce
  triggerWoodClack(ctx, now, 620, 0.34);
  triggerWoodClack(ctx, now + 0.065, 530, 0.3);
  triggerWoodClack(ctx, now + 0.145, 670, 0.14);
  triggerWoodClack(ctx, now + 0.205, 560, 0.09);

  // Outcome differentiating subtle prompt tone
  triggerOutcomeTone(ctx, now + 0.24, outcome);
}

export function playMeditationComplete(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(528, now);
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.14, now + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0008, now + 1.1);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 1.15);
}
