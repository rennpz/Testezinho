/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface HeartParticle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  life: number;
  maxLife: number;
  heartType: number; // Index to render different pixel styles
}

export interface CustomLetter {
  id: string;
  sender: string;
  recipient: string;
  message: string;
  stampStyle: string; // 'heart' | 'rose' | 'letter' | 'star'
  opened: boolean;
  dateStr?: string;
}

export interface SoundPreset {
  name: string;
  notes: string[]; // Note names like 'C4', 'E4', 'G4', etc.
  description: string;
}
