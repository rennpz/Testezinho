/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface HeartPixelArtProps {
  size?: number;
  color?: string;
  outlineColor?: string;
  type?: number;
  className?: string;
}

export const HeartPixelArt: React.FC<HeartPixelArtProps> = ({
  size = 32,
  color = '#ff476f',
  outlineColor = '#2a111b',
  type = 0,
  className = '',
}) => {
  // Let's model different 8x8 configurations of pixel-art hearts.
  // 1 represents the solid color, 2 represents the highlight/accent (white/light pink), 3 is outline, 0 is transparent.
  
  // Style 0: Classic thick-bordered retro heart
  const heart0 = [
    [0, 3, 3, 0, 0, 3, 3, 0],
    [3, 2, 1, 3, 3, 1, 1, 3],
    [3, 1, 1, 1, 1, 1, 1, 3],
    [3, 1, 1, 1, 1, 1, 1, 3],
    [0, 3, 1, 1, 1, 1, 3, 0],
    [0, 0, 3, 1, 1, 3, 0, 0],
    [0, 0, 0, 3, 3, 0, 0, 0],
  ];

  // Style 1: Floating mini solid heart
  const heart1 = [
    [0, 1, 1, 0, 0, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
  ];

  // Style 2: Sparkling star/heart hybrid
  const heart2 = [
    [0, 0, 3, 3, 3, 3, 0, 0],
    [0, 3, 1, 1, 2, 1, 3, 0],
    [3, 1, 1, 2, 2, 1, 1, 3],
    [3, 1, 2, 2, 1, 1, 1, 3],
    [3, 1, 1, 1, 1, 1, 1, 3],
    [0, 3, 1, 1, 1, 1, 3, 0],
    [0, 0, 3, 1, 1, 3, 0, 0],
    [0, 0, 0, 3, 3, 0, 0, 0],
  ];

  // Style 3: Double nesting mini pixel heart
  const heart3 = [
    [0, 3, 3, 0, 0, 3, 3, 0],
    [3, 1, 1, 3, 3, 1, 1, 3],
    [3, 1, 2, 1, 1, 2, 1, 3],
    [3, 1, 1, 2, 2, 1, 1, 3],
    [0, 3, 1, 1, 1, 1, 3, 0],
    [0, 0, 3, 1, 1, 3, 0, 0],
    [0, 0, 0, 3, 3, 0, 0, 0],
  ];

  const grids = [heart0, heart1, heart2, heart3];
  const grid = grids[type] || heart0;

  const rows = grid.length;
  const cols = grid[0].length;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${cols} ${rows}`}
      className={`shape-rendering-crisp-edges ${className}`}
      style={{ imageRendering: 'pixelated' }}
    >
      {grid.map((rowArr, rIdx) =>
        rowArr.map((cell, cIdx) => {
          if (cell === 0) return null;
          
          let fillVal = color;
          if (cell === 2) fillVal = '#ffffff'; // Sparkle highlight
          if (cell === 3) fillVal = outlineColor; // Retro dark contour

          return (
            <rect
              key={`${rIdx}-${cIdx}`}
              x={cIdx}
              y={rIdx}
              width={1}
              height={1}
              fill={fillVal}
            />
          );
        })
      )}
    </svg>
  );
};
