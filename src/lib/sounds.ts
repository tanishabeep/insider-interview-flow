/**
 * Premium, subtle sound design. Synthesized via Web Audio API.
 * No external assets, no install. Tones are short, soft, and tasteful.
 * Honors a global mute via localStorage("ipm.sound") = "off".
 */

let ctx: AudioContext | null = null;
function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (typeof localStorage !== "undefined" && localStorage.getItem("ipm.sound") === "off") return null;
  if (!ctx) {
    const W = window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext };
    const C = W.AudioContext ?? W.webkitAudioContext;
    if (!C) return null;
    ctx = new C();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(freq: number, dur = 0.12, type: OscillatorType = "sine", vol = 0.05, attack = 0.005) {
  const c = ac(); if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type; o.frequency.value = freq;
  const t = c.currentTime;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(c.destination);
  o.start(t); o.stop(t + dur + 0.02);
}

export const sfx = {
  hover: () => tone(880, 0.06, "sine", 0.018),
  click: () => tone(620, 0.07, "triangle", 0.04),
  pick: () => { tone(560, 0.07, "triangle", 0.04); setTimeout(() => tone(740, 0.09, "sine", 0.035), 60); },
  correct: () => { tone(660, 0.09, "sine", 0.05); setTimeout(() => tone(990, 0.16, "sine", 0.05), 80); },
  wrong: () => { tone(300, 0.14, "sawtooth", 0.04); setTimeout(() => tone(220, 0.16, "sine", 0.04), 90); },
  xp: () => { [660, 880, 1175].forEach((f, i) => setTimeout(() => tone(f, 0.12, "sine", 0.045), i * 70)); },
  streak: () => { [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => tone(f, 0.14, "sine", 0.045), i * 80)); },
  panel: () => tone(420, 0.12, "sine", 0.025),
  tick: () => tone(1200, 0.025, "square", 0.012),
  unlock: () => { tone(440, 0.08, "sine", 0.04); setTimeout(() => tone(660, 0.12, "sine", 0.05), 70); setTimeout(() => tone(880, 0.18, "sine", 0.05), 160); },
};

export function setSound(on: boolean) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem("ipm.sound", on ? "on" : "off");
}

export function isSoundOn(): boolean {
  if (typeof localStorage === "undefined") return true;
  return localStorage.getItem("ipm.sound") !== "off";
}