/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  
  return audioCtx;
}

// Map note names to frequencies
export const NOTES: Record<string, number> = {
  'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
  'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
  'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
  'C6': 1046.50, 'D6': 1174.66, 'E6': 1318.51, 'F6': 1396.91, 'G6': 1567.98
};

/**
 * Play a single sweet retro note with a customized synthesizer envelope.
 */
export function playRetroNote(freq: number, duration = 0.15, type: 'sine' | 'triangle' | 'square' = 'triangle') {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Simple warm 8-bit envelope: rapid attack, gentle decay
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    console.warn("Audio failed to play due to interaction policies", e);
  }
}

/**
 * Plays a beautiful 8-bit arpeggio sequence based on custom notes.
 */
export function playCuteArpeggio(notesArray: string[], speedMs = 110) {
  notesArray.forEach((noteName, idx) => {
    const freq = NOTES[noteName];
    if (freq) {
      setTimeout(() => {
        playRetroNote(freq, 0.45, 'triangle');
      }, idx * speedMs);
    }
  });
}

/**
 * Romantic short lullaby theme arpeggio
 */
export function playRomanticLullaby() {
  const theme = ['C4', 'E4', 'G4', 'C5', 'E5', 'C5', 'G4', 'E4', 'C4'];
  playCuteArpeggio(theme, 130);
}

/**
 * High-pitched sweet heart spawn chip chord
 */
export function playHeartPop() {
  // A tiny light sparkle chord
  const freqs = [NOTES['G5'], NOTES['C6'], NOTES['E6']];
  const ctx = getAudioContext();
  if (!ctx) return;

  freqs.forEach((freq, idx) => {
    setTimeout(() => {
      playRetroNote(freq, 0.12, 'sine');
    }, idx * 45);
  });
}

/**
 * Secret/Milestone chime
 */
export function playMilestoneFanfare() {
  const fanfare = ['C5', 'E5', 'G5', 'C6', 'E6', 'G6', 'C6'];
  playCuteArpeggio(fanfare, 90);
}
