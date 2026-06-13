/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Heart, Sparkles, X } from 'lucide-react';
import { playRomanticLullaby } from '../utils/audio';

interface LoveLetterCapsuleProps {
  onSpamHearts: (count: number) => void;
}

export const LoveLetterCapsule: React.FC<LoveLetterCapsuleProps> = ({
  onSpamHearts,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenEnvelope = () => {
    setIsOpen(!isOpen);
    // When opened, play the soft retro music and release at most 4 hearts
    if (!isOpen) {
      playRomanticLullaby();
      onSpamHearts(4);
    }
  };

  return (
    <div className="bg-love-cream p-5 md:p-6 rounded-2xl pixel-border pixel-shadow w-full flex flex-col gap-5 text-love-dark select-none" id="love-capsule-module">
      <div className="flex flex-col gap-1 text-center">
        <h3 className="font-retro text-xs md:text-sm text-love-red flex items-center justify-center gap-2">
          <Mail size={16} className="animate-bounce" /> ENVELOPE ESPECIAL
        </h3>
        <p className="font-sans text-xs text-love-deep/75 mt-1">
          Renan preparou uma surpresa maravilhosa para você Mary! Toque abaixo para abrir:
        </p>
      </div>

      {/* Decorative Interactive Envelope */}
      <div className="flex flex-col items-center justify-center py-6 bg-love-sugar/30 rounded-xl border border-love-pink/30 relative overflow-hidden min-h-[220px]">
        <div 
          className="relative w-56 h-36 flex items-center justify-center cursor-pointer touch-manipulation hover:scale-105 active:scale-95 transition-transform" 
          onClick={handleOpenEnvelope}
          title="Clique para ler a cartinha"
          id="retro-envelope"
        >
          {/* Back Envelope base body */}
          <div className="absolute bottom-2 w-48 h-28 bg-love-blush border-4 border-love-dark rounded-b-lg flex items-center justify-center shadow-lg">
            <motion.div 
              animate={{ scale: [1, 1.15, 1], rotate: [0, 2, -2, 0] }} 
              transition={{ repeat: Infinity, duration: 2.2 }}
              className="flex flex-col items-center gap-1 text-love-red"
            >
              <Heart size={32} fill="currentColor" className="drop-shadow" />
              <span className="font-retro text-[8px] text-love-dark select-none leading-none mt-1">ABRA-ME</span>
            </motion.div>
          </div>

          {/* Envelope Flap styled using pixel border */}
          <motion.div
            animate={{ rotateX: isOpen ? 180 : 0 }}
            transition={{ duration: 0.35 }}
            style={{ originY: 0 }}
            className="absolute bottom-28 w-48 h-12 bg-love-pink border-t-4 border-x-4 border-love-dark rounded-t-xl z-20"
          />
        </div>

        <button
          onClick={handleOpenEnvelope}
          className="bg-love-red hover:bg-love-red/90 text-white font-retro text-[9px] px-6 py-2.5 rounded-xl border-2 border-love-dark pixel-shadow-sm active:translate-y-0.5 active:translate-x-0.5 cursor-pointer mt-4 transition-colors"
          id="btn-open-envelope-panel"
        >
          Ver Cartinha
        </button>
      </div>

      {/* SCREEN-CENTERED CUPID CHAT OVERLAY (CARTA ABERTA NO MEIO DA TELA) */}
      <AnimatePresence>
        {isOpen && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={handleOpenEnvelope}
            id="modal-backdrop"
          >
            {/* The centered elegant pixelated card layout */}
            <motion.div
              initial={{ scale: 0.82, opacity: 0, y: 35 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.82, opacity: 0, y: 35 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="bg-love-cream p-6 md:p-8 rounded-2xl pixel-border pixel-shadow w-full max-w-sm text-center flex flex-col gap-6 relative select-none cursor-default"
              onClick={(e) => e.stopPropagation()} // Prevent closing outline clicks
              id="centered-love-letter"
            >
              {/* Retro top card ribbon */}
              <div className="flex items-center justify-between border-b-2 border-love-sugar pb-3">
                <span className="font-retro text-[8px] text-love-pink font-bold">DE: RENAN</span>
                <span className="flex gap-0.5 items-center">
                  <Heart size={10} fill="#ff476f" className="text-love-red" />
                  <Heart size={10} fill="#ff7597" className="text-love-pink" />
                </span>
                <span className="font-retro text-[8px] text-love-pink font-bold">PARA: MARY</span>
              </div>

              {/* Main Content Area - displaying prominently "Eu amo vc" */}
              <div className="py-8 px-4 flex flex-col items-center justify-center gap-4 bg-white/90 p-4 rounded-xl border-2 border-love-pink/30 shadow-inner min-h-[160px]">
                <div className="font-retro text-[8px] text-love-pink mb-1 tracking-wider uppercase flex items-center gap-1.5">
                  <Sparkles size={11} className="text-yellow-500 animate-spin" />
                  MENSAGEM SECRETA
                  <Sparkles size={11} className="text-yellow-500 animate-spin" />
                </div>

                <motion.h2 
                  initial={{ scale: 0.9 }}
                  animate={{ scale: [0.95, 1.05, 0.95] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                  className="font-serif italic text-4xl md:text-5xl text-love-red font-black tracking-normal leading-relaxed text-shadow-pink"
                >
                  Eu amo vc
                </motion.h2>

                <div className="w-16 h-1 bg-love-pink/40 rounded-full my-1" />

                <p className="font-sans text-[11px] text-love-deep/85 italic leading-relaxed text-center">
                  Mary, você é o amor eterno de toda a minha vida. <br />
                  De todos os meus dias e todas as minhas fases! 💖
                </p>
              </div>

              {/* Close Button element */}
              <button
                onClick={handleOpenEnvelope}
                className="bg-love-red hover:bg-love-red/90 text-white font-retro text-[10px] py-3.5 rounded-xl border-2 border-love-dark pixel-shadow-sm active:translate-y-0.5 active:translate-x-0.5 transition-all text-center cursor-pointer w-full"
                id="btn-close-letter"
              >
                FECHAR CARTA
              </button>

              {/* Little lock tag */}
              <div className="font-retro text-[7px] text-love-deep/50">
                Pressione para voltar ao Amor em Pixels
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
