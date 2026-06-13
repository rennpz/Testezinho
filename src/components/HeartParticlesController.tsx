/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { HeartPixelArt } from './HeartPixelArt';

export interface FloatingHeart {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  type: number;
  drift: number; // horizontal zig-zag factor
  speedY: number; // upward progress velocity
  rotation: number; // spin direction
  opacity: number;
}

interface HeartParticlesControllerProps {
  hearts: FloatingHeart[];
  setHearts: React.Dispatch<React.SetStateAction<FloatingHeart[]>>;
}

export const HeartParticlesController: React.FC<HeartParticlesControllerProps> = ({
  hearts,
  setHearts,
}) => {
  // Drive particle positions with a lightweight tick loop
  useEffect(() => {
    let animationId: number;

    const updateParticles = () => {
      setHearts((prevHearts) => {
        if (prevHearts.length === 0) return prevHearts;

        return prevHearts
          .map((h) => {
            // Drift left and right with a gentle sine-wave-like wiggle
            const timeOffset = Date.now() / 150;
            const horizontalDrift = Math.sin(timeOffset + h.drift) * 1.5;

            return {
              ...h,
              y: h.y - h.speedY, // Float upwards
              x: h.x + horizontalDrift,
              rotation: h.rotation + (h.drift > 0.5 ? 1 : -1), // Slow rotation
              opacity: h.opacity - 0.012, // Slowly fade out
            };
          })
          .filter((h) => h.opacity > 0 && h.y > -50); // Remove when fully faded or offscreen
      });

      animationId = requestAnimationFrame(updateParticles);
    };

    animationId = requestAnimationFrame(updateParticles);
    return () => cancelAnimationFrame(animationId);
  }, [setHearts]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" id="heart-fountain-system">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute select-none will-change-transform"
          style={{
            left: heart.x,
            top: heart.y,
            transform: `translate(-50%, -50%) rotate(${heart.rotation}deg)`,
            opacity: heart.opacity,
            transition: 'opacity 0.05s linear',
          }}
        >
          <HeartPixelArt
            size={heart.size}
            color={heart.color}
            type={heart.type}
            outlineColor="#2a111b"
          />
        </div>
      ))}
    </div>
  );
};
