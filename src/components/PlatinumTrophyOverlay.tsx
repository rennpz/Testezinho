/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Star, Heart, Sparkles } from 'lucide-react';
import { playMilestoneFanfare } from '../utils/audio';

interface PlatinumTrophyOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  sender: string;
  recipient: string;
}

export const PlatinumTrophyOverlay: React.FC<PlatinumTrophyOverlayProps> = ({
  isOpen,
  onClose,
  sender,
  recipient,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none touch-manipulation"
          onClick={onClose}
          id="platinum-trophy-overlay"
        >
          {/* Neon/Chrono retro shining modal */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotate: -3 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.8, opacity: 0, rotate: 3 }}
            transition={{ type: 'spring', damping: 20, stiffness: 180 }}
            className="bg-[#2a111b] text-white p-6 md:p-8 rounded-3xl border-4 border-love-pink relative shadow-[0_0_40px_rgba(255,117,151,0.5)] max-w-sm w-full text-center flex flex-col items-center gap-5 cursor-default pixel-shadow"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Retro Sparkles */}
            <div className="absolute top-4 left-4 text-[#4ecdc4] animate-pulse">
              <Sparkles size={20} />
            </div>
            <div className="absolute top-4 right-4 text-[#ffb703] animate-pulse">
              <Sparkles size={20} />
            </div>

            <div className="font-retro text-[8px] tracking-widest text-[#4ecdc4] uppercase">
              🏆 PLATINUM CO-OP UNLOCKED 🏆
            </div>

            {/* Radiant Platinum Trophy container */}
            <div className="relative my-4 flex items-center justify-center p-5 bg-white/5 rounded-2xl border-2 border-[#4ecdc4]/40 w-32 h-32">
              <div className="absolute inset-0 bg-radial-gradient from-[#4ecdc4]/10 to-transparent animate-pulse rounded-full" />
              
              {/* Star sparkles orbiting the trophy */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                className="absolute inset-0 flex items-center justify-between pointer-events-none p-1"
              >
                <Star size={12} fill="#ffb703" className="text-[#ffb703]" />
                <Star size={12} fill="#4ecdc4" className="text-[#4ecdc4]" />
              </motion.div>

              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                className="relative z-10 text-slate-100 flex items-center justify-center"
              >
                {/* Custom Platinum Colored Trophy overlay */}
                <Trophy 
                  size={72} 
                  className="filter drop-shadow-[0_0_15px_rgba(78,205,196,0.8)] stroke-[#4ecdc4] text-slate-100 fill-slate-200"
                  style={{ strokeWidth: 1.5 }}
                />
                
                {/* Glowing hearth on center of the trophy */}
                <span className="absolute top-[22px] flex items-center justify-center text-love-red">
                  <Heart size={18} fill="#ff476f" className="animate-ping absolute" />
                  <Heart size={18} fill="#ff476f" className="relative" />
                </span>
              </motion.div>
            </div>

            {/* Romantic message: "те amo para todo sempre" */}
            <div className="flex flex-col gap-2">
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-retro text-xs md:text-sm text-love-pink leading-relaxed uppercase tracking-wider"
              >
                CONQUISTA SUPREMA!
              </motion.h2>

              <motion.h3 
                animate={{ scale: [0.98, 1.02, 0.98] }}
                transition={{ repeat: Infinity, duration: 2.0 }}
                className="font-serif italic text-3xl md:text-4xl text-shadow-pink font-black text-[#ff476f]"
              >
                te amo para todo sempre
              </motion.h3>

              <p className="font-sans text-xs text-love-sugar/80 mt-2 leading-relaxed">
                {sender} & {recipient} alcançaram a conexão máxima cósmica! Nada pode separar nossa parceria na vida real ou em pixels. 🌟
              </p>
            </div>

            {/* Close button with classic feedback */}
            <button
              onClick={onClose}
              className="mt-2 bg-[#ff476f] hover:bg-[#ff7597] text-white font-retro text-[9px] py-3.5 px-6 rounded-xl border-2 border-white pixel-shadow active:translate-y-0.5 active:translate-x-0.5 cursor-pointer w-full transition-all"
              id="btn-close-platinum-trophy"
            >
              FECHAR TROFÉU
            </button>

            <span className="font-retro text-[6px] text-love-sugar/40">
              Salvo para todo sempre com amor eterno ♥
            </span>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
