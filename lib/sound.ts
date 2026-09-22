"use client";

export type SoundName = "click" | "success" | "warning" | "cash" | "level";

let audioContext: AudioContext | null = null;
let muted = false;

export function setMuted(value: boolean) { muted = value; }
export function isMuted() { return muted; }

export function playSound(name: SoundName) {
  if (muted || typeof window === "undefined") return;
  const AudioCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtor) return;
  audioContext ??= new AudioCtor();
  const ctx = audioContext;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  const frequencies: Record<SoundName, number[]> = {
    click: [420], success: [520, 720], warning: [220, 180], cash: [600, 820, 1000], level: [440, 660, 880],
  };
  const notes = frequencies[name];
  oscillator.type = name === "warning" ? "sawtooth" : "sine";
  oscillator.frequency.setValueAtTime(notes[0], ctx.currentTime);
  notes.slice(1).forEach((frequency, index) => oscillator.frequency.setValueAtTime(frequency, ctx.currentTime + (index + 1) * 0.09));
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
  oscillator.connect(gain).connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.32);
}
