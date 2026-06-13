/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, Palette, Trash2, Heart, Star, Flame } from 'lucide-react';
import { playRetroNote, playCuteArpeggio, NOTES } from '../utils/audio';

// Constants for painting
const BOARD_SIZE = 12;
const PALETTE_COLORS = [
  '#ff476f', // Ruby Red
  '#ff7597', // Soft Pink
  '#fec5bb', // Pastel Blush
  '#ffb703', // Warm Gold
  '#7209b7', // Purple
  '#4361ee', // Blue
  '#4ecdc4', // Emerald Aqua
  '#2a111b', // Outline Dark
];

const HEART_MATRIX = [
  [0,1,1,0,0,0,0,1,1,0],
  [1,1,1,1,0,0,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1],
  [0,1,1,1,1,1,1,1,1,0],
  [0,0,1,1,1,1,1,1,0,0],
  [0,0,0,1,1,1,1,0,0,0],
  [0,0,0,0,1,1,0,0,0,0],
];

const makeCoords = (matrix: number[][]): number[][] => {
  const coords: number[][] = [];
  matrix.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) {
        coords.push([y + 2, x + 1]);
      }
    });
  });
  return coords;
};

// Presets mapped to 12x12 coordinates
const COMPASS_PRESETS: Record<string, { name: string; color: string; coordMap: number[][] }> = {
  heart: {
    name: 'Coração de Pixel',
    color: '#ff476f',
    coordMap: makeCoords(HEART_MATRIX),
  },
  star: {
    name: 'Brilho Estrelar',
    color: '#ffb703',
    coordMap: [
      [5, 2], [4, 3], [5, 3], [6, 3], // center cross
      [5, 4], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5],
      [4, 7], [5, 7], [6, 7], [5, 8]
    ]
  },
  love: {
    name: 'L-O-V-E',
    color: '#7209b7',
    coordMap: [
      // Letter L
      [2,1], [3,1], [4,1], [5,1], [6,1], [6,2], [6,3],
      // Letter O
      [3,5], [4,5], [5,5], [2,6], [6,6], [3,7], [4,7], [5,7],
      // Letter V
      [2,9], [3,9], [4,9], [5,10], [6,10]
    ]
  }
};

interface LoveBoardProps {
  onSpawnFountain: (clientX: number, clientY: number, count: number) => void;
}

export const LoveBoard: React.FC<LoveBoardProps> = ({ onSpawnFountain }) => {
  // Initialize board with state persisted from localStorage
  const [grid, setGrid] = useState<(string | null)[]>(() => {
    const saved = localStorage.getItem('cupido_board_pixels');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse board pixels", e);
      }
    }
    return Array(BOARD_SIZE * BOARD_SIZE).fill(null);
  });
  const [selectedColor, setSelectedColor] = useState('#ff476f');
  const [isDrawing, setIsDrawing] = useState(false);

  // Auto-sync coordinates to local storage when changed
  useEffect(() => {
    localStorage.setItem('cupido_board_pixels', JSON.stringify(grid));
  }, [grid]);

  // Play nice tone based on Row position (pentatonic scale for safety)
  const playPixelTone = (rowIdx: number) => {
    const scale = ['C4', 'D4', 'E4', 'G4', 'A4', 'C5', 'D5', 'E5', 'G5', 'A5', 'C6', 'D6'];
    const note = scale[rowIdx % scale.length];
    const freq = NOTES[note] || 220;
    playRetroNote(freq, 0.18, 'sine');
  };

  const handleCellInteract = (index: number, e: React.MouseEvent) => {
    // Determine matrix row
    const rowIdx = Math.floor(index / BOARD_SIZE);
    playPixelTone(rowIdx);

    // Get click coordinates to trigger heart eruption at the exact spot!
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    onSpawnFountain(x, y, 4);

    setGrid((prev) => {
      const next = [...prev];
      // Toggle paint or apply active color
      if (next[index] === selectedColor) {
        next[index] = null; // erase if matching
      } else {
        next[index] = selectedColor;
      }
      return next;
    });
  };

  const clearCanvas = () => {
    setGrid(Array(BOARD_SIZE * BOARD_SIZE).fill(null));
    playCuteArpeggio(['A3', 'F3', 'D3'], 120);
  };

  const loadPreset = (presetKey: string) => {
    const preset = COMPASS_PRESETS[presetKey];
    if (!preset) return;

    const newGrid = Array(BOARD_SIZE * BOARD_SIZE).fill(null);
    let delay = 0;

    // Set the state quickly
    preset.coordMap.forEach(([y, x]) => {
      const index = y * BOARD_SIZE + x;
      if (index >= 0 && index < BOARD_SIZE * BOARD_SIZE) {
        newGrid[index] = preset.color;
      }
    });

    setGrid(newGrid);

    // Beautiful animated acoustic feedback
    if (presetKey === 'heart') {
      playCuteArpeggio(['C4', 'E4', 'G4', 'C5', 'E5', 'C6'], 85);
    } else if (presetKey === 'star') {
      playCuteArpeggio(['F4', 'A4', 'C5', 'F5', 'A5'], 85);
    } else {
      playCuteArpeggio(['G4', 'B4', 'D5', 'G5'], 100);
    }

    // Trigger central fountain blast
    const loveContainer = document.getElementById('pixel-canvas');
    if (loveContainer) {
      const rect = loveContainer.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      onSpawnFountain(cx, cy, 25);
    }
  };

  return (
    <div className="bg-love-cream p-5 md:p-6 rounded-2xl pixel-border pixel-shadow w-full flex flex-col gap-5 text-love-dark select-none" id="love-board-module">
      <div className="flex flex-col gap-1">
        <h3 className="font-retro text-xs md:text-sm text-love-red flex items-center gap-2">
          <Palette size={16} /> PAINEL PIXEL DE AMOR
        </h3>
        <p className="font-sans text-xs text-love-deep/75">
          Desenhe corações ou carregue presets românticos. Cada toque toca um som fofinho de sintetizador!
        </p>
      </div>

      {/* Retro Presets Panel */}
      <div className="flex flex-wrap gap-2 justify-center py-2 border-b-2 border-love-sugar">
        <button
          onClick={() => loadPreset('heart')}
          className="bg-love-sugar hover:bg-love-pink/20 text-love-red font-retro text-[9px] px-3 py-1.5 rounded-lg border-2 border-love-dark active:translate-y-0.5 flex items-center gap-1.5 transition-colors cursor-pointer"
          id="btn-preset-heart"
        >
          <Heart size={10} fill="currentColor" /> Coração
        </button>
        <button
          onClick={() => loadPreset('star')}
          className="bg-love-sugar hover:bg-love-pink/20 text-love-red/80 font-retro text-[9px] px-3 py-1.5 rounded-lg border-2 border-love-dark active:translate-y-0.5 flex items-center gap-1.5 transition-colors cursor-pointer"
          id="btn-preset-star"
        >
          <Star size={10} fill="currentColor" /> Estrela
        </button>
        <button
          onClick={() => loadPreset('love')}
          className="bg-love-sugar hover:bg-love-pink/20 text-love-red/80 font-retro text-[9px] px-3 py-1.5 rounded-lg border-2 border-love-dark active:translate-y-0.5 flex items-center gap-1.5 transition-colors cursor-pointer"
          id="btn-preset-love"
        >
          <Sparkles size={10} /> L-O-V-E
        </button>
        <button
          onClick={clearCanvas}
          className="bg-white hover:bg-red-50 text-red-600 font-retro text-[9px] px-3 py-1.5 rounded-lg border-2 border-love-dark active:translate-y-0.5 flex items-center gap-1.5 ml-auto transition-colors cursor-pointer"
          title="Limpar quadro"
          id="btn-clear-canvas"
        >
          <Trash2 size={10} /> Limpar
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-5 items-center">
        {/* The Grid Board */}
        <div 
          className="bg-love-sugar p-2 rounded-xl border-4 border-love-dark pixel-shadow-sm flex items-center justify-center relative"
          id="pixel-canvas"
        >
          <div className="grid grid-cols-12 gap-[1px]">
            {grid.map((cellColor, index) => {
              const xPos = index % BOARD_SIZE;
              const yPos = Math.floor(index / BOARD_SIZE);
              
              return (
                <div
                  key={index}
                  onClick={(e) => handleCellInteract(index, e)}
                  className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer border-[1px] border-love-dark/15 transition-all hover:brightness-95 hover:scale-105"
                  style={{
                    backgroundColor: cellColor || '#fdfaf6',
                  }}
                  id={`pixel-cell-${yPos}-${xPos}`}
                  title={`Pixel ${xPos}, ${yPos}`}
                />
              );
            })}
          </div>
        </div>

        {/* Color Palette & Customizer info */}
        <div className="flex flex-row md:flex-col gap-3 flex-wrap md:flex-nowrap justify-center w-full md:w-auto">
          <div className="font-retro text-[8px] text-love-pink text-center md:text-left w-full">COR SELECIONADA:</div>
          <div className="flex flex-row md:grid md:grid-cols-4 gap-2 justify-center">
            {PALETTE_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-7 h-7 rounded-md border-2 border-love-dark flex items-center justify-center transition-all ${
                  selectedColor === color ? 'ring-4 ring-love-pink scale-110' : 'hover:scale-105'
                }`}
                style={{ backgroundColor: color }}
                title={color}
                id={`palette-color-${color.replace('#', '')}`}
              >
                {selectedColor === color && (
                  <div className="w-1.5 h-1.5 bg-white rounded-full mix-blend-difference" />
                )}
              </button>
            ))}
          </div>

          <div className="hidden md:block bg-white p-3 rounded-lg border-2 border-love-dark text-[10px] font-sans leading-relaxed text-love-deep/80 mt-2">
            <p className="font-semibold text-love-red mb-1">🎮 Teclas de Cores:</p>
            Clique nos pixels para pintar ou apagar. Invente as iniciais do casal e envie corações digitais à tela!
          </div>
        </div>
      </div>
    </div>
  );
};
