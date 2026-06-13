/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Sparkles, 
  Music, 
  Volume2, 
  VolumeX, 
  Trophy, 
  Gift, 
  User, 
  Calendar, 
  ChevronRight, 
  RotateCw, 
  Smartphone,
  Keyboard
} from 'lucide-react';

import { HeartParticlesController, FloatingHeart } from './components/HeartParticlesController';
import { LoveLetterCapsule } from './components/LoveLetterCapsule';
import { LoveBoard } from './components/LoveBoard';
import { PlatinumTrophyOverlay } from './components/PlatinumTrophyOverlay';
import { playHeartPop, playRetroNote, playCuteArpeggio, playRomanticLullaby, playMilestoneFanfare } from './utils/audio';

const DECORATIVE_STARS = [
  { top: '10%', left: '8%', delay: 0 },
  { top: '22%', right: '12%', delay: 0.5 },
  { top: '75%', left: '5%', delay: 1.2 },
  { top: '82%', right: '10%', delay: 0.8 },
  { top: '45%', left: '15%', delay: 2.1 },
  { top: '65%', right: '18%', delay: 1.7 }
];

export default function App() {
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);
  const [totalClicks, setTotalClicks] = useState<number>(() => {
    const saved = localStorage.getItem('cupido_clicks');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [senderName] = useState<string>('Renan');
  const [recipientName] = useState<string>('Mary');
  const [isPlayingSynthMusic, setIsPlayingSynthMusic] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Custom Platinum Trophy State Tracker
  const [showPlatinumTrophy, setShowPlatinumTrophy] = useState<boolean>(false);
  const [hasSeenPlatinumTrophy, setHasSeenPlatinumTrophy] = useState<boolean>(() => {
    return localStorage.getItem('seen_platinum_trophy') === 'true';
  });

  // Sync clicks to localStorage
  useEffect(() => {
    localStorage.setItem('cupido_clicks', totalClicks.toString());
  }, [totalClicks]);

  // Trigger Platinum Trophy when she hits 300 total clicks
  useEffect(() => {
    if (totalClicks >= 300 && !hasSeenPlatinumTrophy) {
      setShowPlatinumTrophy(true);
      setHasSeenPlatinumTrophy(true);
      localStorage.setItem('seen_platinum_trophy', 'true');
      if (soundEnabled) {
        playMilestoneFanfare();
      }
    }
  }, [totalClicks, hasSeenPlatinumTrophy, soundEnabled]);

  // Handle romantic ambient background score player looping
  useEffect(() => {
    if (isPlayingSynthMusic) {
      // Warm nostalgic arpeggio theme sequence looping
      const playMelodyInstance = () => {
        // Melodic cute chords sequence
        const chords = [
          ['C4', 'E4', 'G4', 'C5'],
          ['A3', 'C4', 'E4', 'A4'],
          ['F3', 'A3', 'C4', 'F4'],
          ['G3', 'B3', 'D4', 'G4']
        ];
        
        let chordIdx = 0;
        const interval = setInterval(() => {
          if (!isPlayingSynthMusic) return;
          const currentChord = chords[chordIdx % chords.length];
          playCuteArpeggio(currentChord, 160);
          chordIdx++;
        }, 3200);

        return interval;
      };

      const id = playMelodyInstance();
      return () => clearInterval(id);
    }
  }, [isPlayingSynthMusic]);

  // Core launcher to spawn floating pixel hearts on coordinates - capped strictly to at most 4 at a time!
  const spawnHeartsAtCoordinates = (clientX: number, clientY: number, count = 4) => {
    const finalCount = Math.min(count, 4); // Capped strictly to a maximum of 4 concurrent hearts for optimal performance!
    const palette = ['#ff476f', '#ff7597', '#fec5bb', '#ffb703', '#7209b7', '#ffa6c9'];
    const newHearts: FloatingHeart[] = [];

    for (let i = 0; i < finalCount; i++) {
      // Add slight randomized offsets around coordinate
      const offsetDirectionX = (Math.random() - 0.5) * 45;
      const offsetDirectionY = (Math.random() - 0.5) * 45;
      
      newHearts.push({
        id: `${Date.now()}-${Math.random()}`,
        x: clientX + offsetDirectionX,
        y: clientY + offsetDirectionY,
        size: Math.floor(Math.random() * 20) + 14, // 14px to 34px
        color: palette[Math.floor(Math.random() * palette.length)],
        type: Math.floor(Math.random() * 4), // Renders randomized shapes (full, empty, star, nest)
        drift: Math.random() * 2, // Drift multiplier
        speedY: Math.random() * 2.0 + 1.8, // Upward floating velocity
        rotation: Math.random() * 360,
        opacity: 1,
      });
    }

    setHearts((prev) => [...prev, ...newHearts]);
    
    if (soundEnabled) {
      playHeartPop();
    }
  };

  // Click handler that captures clicks anywhere on the screen - strictly capped to at most 4 hearts for optimal, high-performance offline execution
  const handleGlobalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent spawning hearts if clicking active UI components (buttons, links, inputs, textarea)
    const target = e.target as HTMLElement;
    const tagName = target.tagName.toLowerCase();
    
    // Check if within any button, input, textarea, or anchor tag
    if (
      tagName === 'button' || 
      tagName === 'input' || 
      tagName === 'textarea' || 
      tagName === 'a' ||
      target.closest('button') ||
      target.closest('input') ||
      target.closest('textarea') ||
      target.closest('a') ||
      target.closest('#pixel-canvas') // Handled specifically by LoveBoard
    ) {
      return;
    }

    setTotalClicks((prev) => prev + 1);
    spawnHeartsAtCoordinates(e.clientX, e.clientY, 4);
  };

  // Spawn an intensive heart eruption strictly capped to 4 hearts for high performance
  const spawnHeartVolcano = (clientX: number, clientY: number, count = 4) => {
    spawnHeartsAtCoordinates(clientX, clientY, 4);
    if (soundEnabled) {
      playMilestoneFanfare();
    }
  };

  // Formulate couple ranks/titles based on click milestone levels
  const getLoveLevelTitle = () => {
    if (totalClicks < 10) return "Primeiros Cliques fofos 🌱";
    if (totalClicks < 50) return "Sintonia Conectada ✨";
    if (totalClicks < 150) return "Amor em Ultra-Res 💖";
    if (totalClicks < 300) return "Bug de Amor no Sistema 👾";
    if (totalClicks < 600) return "Renan & Mary Infinitos 🏆";
    return "Dimensão Paralela Doce 🌌";
  };

  const clearClicksHistory = () => {
    setTotalClicks(0);
    setHasSeenPlatinumTrophy(false);
    localStorage.removeItem('seen_platinum_trophy');
    playCuteArpeggio(['C4', 'A3', 'F3'], 100);
  };

  return (
    <div 
      onClick={handleGlobalClick} 
      className="min-h-screen bg-[#ffe5ec] bg-wedding-grid pb-12 pt-6 px-4 md:px-8 font-sans transition-colors relative cursor-default overflow-x-hidden"
      id="main-app-container"
    >
      {/* Decorative stars / magical pixel light glows in the background */}
      {DECORATIVE_STARS.map((star, idx) => (
        <motion.div
          key={idx}
          className="absolute text-love-pink/20 select-none pointer-events-none hidden md:block"
          style={{ top: star.top, left: star.left || 'auto', right: star.right || 'auto' }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ repeat: Infinity, duration: 3, delay: star.delay }}
        >
          <Sparkles size={24} />
        </motion.div>
      ))}

      {/* Embedded Heart Particle overlay rendering loop */}
      <HeartParticlesController hearts={hearts} setHearts={setHearts} />

      <div className="max-w-5xl mx-auto flex flex-col gap-6" id="dashboard-layout">
        
        {/* ROW 1: HEADER & CONSOLE BOARD */}
        <header className="flex flex-col gap-4 text-center items-center relative" id="header-love-nest">
          
          {/* Decorative Float Header Emblem */}
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="flex items-center gap-1 text-love-red bg-white px-4 py-2 rounded-full border-2 border-love-dark pixel-shadow-sm mt-3"
            id="emblem-container"
          >
            <Heart size={16} fill="currentColor" className="animate-pulse" />
            <span className="font-retro text-[9px] font-bold text-love-dark">DIA DOS NAMORADOS 2026</span>
            <Heart size={16} fill="currentColor" className="animate-pulse" />
          </motion.div>

          <h1 className="font-retro text-2xl md:text-4xl text-love-dark tracking-wide font-black uppercase text-shadow-pink leading-snug drop-shadow-sm mt-1">
            Amor em Pixels
          </h1>
          
          <p className="font-sans text-xs md:text-sm text-love-deep max-w-lg leading-relaxed bg-white/70 px-4 py-2 rounded-xl border border-love-pink/20 inline-block">
            Um cantinho interativo fofo do casal. <b className="text-love-red">Clique em qualquer lugar vazio na tela</b> e assista a corações em pixel se espalharem feito mágica! ✨
          </p>
        </header>

        {/* CONTAINER BENTO BOX GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* COLUMN 1 (LEFT SECTION): RANK, NAMES & SCORE COUPE */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* SCORE CARD MACHINE */}
            <div className="bg-love-cream p-5 md:p-6 rounded-2xl pixel-border pixel-shadow text-love-dark flex flex-col gap-5 relative overflow-hidden" id="couple-arcade-console">
              {/* Cute corner screw decorations for arcade look */}
              <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-love-pink rounded-full" />
              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-love-pink rounded-full" />
              <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-love-pink rounded-full" />
              <div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-love-pink rounded-full" />

              <div className="flex justify-between items-center bg-love-dark text-love-sugar px-3 py-1.5 rounded-lg border border-love-pink/30">
                <span className="font-retro text-[8px] tracking-widest text-[#4ecdc4]">P1: Renan</span>
                <span className="font-retro text-[8px] animate-pulse text-love-pink">♥</span>
                <span className="font-retro text-[8px] tracking-widest text-love-pink">P2: Mary</span>
              </div>

              {/* Big Arcade LED Counter */}
              <div className="flex flex-col items-center justify-center bg-love-dark p-4 rounded-xl border-4 border-love-deep text-center relative">
                <div className="absolute top-1 left-2 font-mono text-[7px] text-[#ffb703] tracking-widest uppercase">CORAÇÕES DISPARADOS LED</div>
                
                <h4 className="font-retro text-2xl md:text-3xl text-love-red tracking-widest select-none pt-2 animate-pulse">
                  {totalClicks.toString().padStart(6, '0')}
                </h4>
                
                <span className="font-retro text-[8px] text-[#4ecdc4] mt-2 block tracking-wider uppercase font-semibold">
                  STATUS: {getLoveLevelTitle()}
                </span>
              </div>

              {/* Custom Dedicated Couple Badge */}
              <div className="bg-white p-4 rounded-xl border-2 border-love-dark flex flex-col gap-1 items-center text-center">
                <div className="flex items-center gap-1.5 font-retro text-[8px] text-love-red">
                  <Heart size={10} fill="currentColor" className="animate-bounce" /> DEDICAÇÃO EXCLUSIVA
                </div>
                <div className="font-sans text-xs text-love-dark mt-1 font-semibold">
                  De: <span className="text-love-red font-bold">Renan</span> para sua amada <span className="text-love-red font-bold">Mary</span>
                </div>
                <div className="font-sans text-[10px] text-love-deep/60 mt-0.5">
                  Conectados eternamente no Amor em Pixels 🔒
                </div>
              </div>

              {/* QUICK MUSIC CONTROLLER */}
              <div className="bg-love-sugar/30 p-3.5 rounded-xl border border-love-pink/20 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-retro text-[8px] text-love-deep tracking-wider flex items-center gap-1">
                    <Music size={12} /> CONTROLES RETRÔ DE ÁUDIO
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSoundEnabled(!soundEnabled);
                      if (!soundEnabled) {
                        setTimeout(() => playRetroNote(523, 0.1, 'sine'), 100);
                      }
                    }}
                    className={`flex-1 border-2 border-love-dark rounded-lg p-2 font-retro text-[8px] active:translate-y-0.5 pixel-shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      soundEnabled ? 'bg-[#ff7597] text-white' : 'bg-white text-love-dark'
                    }`}
                    id="btn-toggle-sfx"
                  >
                    {soundEnabled ? <Volume2 size={10} /> : <VolumeX size={10} />}
                    {soundEnabled ? 'Sons: Ligar' : 'Sons: Mutado'}
                  </button>

                  <button
                    onClick={() => {
                      setIsPlayingSynthMusic(!isPlayingSynthMusic);
                      if (!isPlayingSynthMusic && soundEnabled) {
                        playRomanticLullaby();
                      }
                    }}
                    className={`flex-1 border-2 border-love-dark rounded-lg p-2 font-retro text-[8px] active:translate-y-0.5 pixel-shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isPlayingSynthMusic ? 'bg-love-red text-white animate-pulse' : 'bg-white text-love-dark'
                    }`}
                    id="btn-toggle-music"
                  >
                    <Music size={10} />
                    {isPlayingSynthMusic ? 'Trilha: Parar':'Trilha: Tocar'}
                  </button>
                </div>
              </div>
            </div>

            {/* MILESTONE TROPHIES */}
            <div className="bg-love-cream p-5 md:p-6 rounded-2xl pixel-border pixel-shadow text-love-dark flex flex-col gap-4" id="milestones-trophies-module">
              <h3 className="font-retro text-xs md:text-sm text-love-red flex items-center gap-2">
                <Trophy size={16} /> CONQUISTAS CO-OP
              </h3>
              <p className="font-sans text-[11px] text-love-deep/80 leading-relaxed">
                Clique nas conquistas liberadas para comemorar com uma explosão fofa de corações mágicos! 🎉
              </p>

              <div className="flex flex-col gap-3">
                {[
                  { count: 10, title: "Primeira Faísca ✨", msg: "Chegaram a 10 corações!", icon: Sparkles },
                  { count: 50, title: "Sintonia Perfeita 💞", msg: "Atingiram 50 clics românticos!", icon: Heart },
                  { count: 150, title: "Conexão de Fibra 📶", msg: "Sincronia total de 150!", icon: RotateCw },
                  { count: 300, title: "Amor Infinito 🏆", msg: "Uau, 300 corações na tela!", icon: Gift }
                ].map((m, idx) => {
                  const isUnlocked = totalClicks >= m.count;
                  const IconComp = m.icon;

                  return (
                    <div
                      key={idx}
                      onClick={(e) => {
                        if (isUnlocked) {
                          spawnHeartVolcano(e.clientX, e.clientY, 35);
                        }
                      }}
                      className={`p-3 rounded-xl border-2 border-love-dark flex items-center justify-between transition-all select-none ${
                        isUnlocked 
                          ? 'bg-love-sugar hover:scale-[1.02] cursor-pointer' 
                          : 'bg-gray-100 opacity-60 border-dashed border-gray-400 cursor-not-allowed'
                      }`}
                      id={`milestone-${m.count}`}
                      title={isUnlocked ? 'Clique para disparar fogos de coração!' : `Faltam ${m.count - totalClicks} cliques.`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg border ${isUnlocked ? 'bg-love-red text-white':'bg-gray-300'}`}>
                          <IconComp size={16} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-retro text-[9px] text-love-dark">{m.title}</span>
                          <span className="font-sans text-[10px] text-love-deep/80">{m.msg}</span>
                        </div>
                      </div>
                      <div>
                        {isUnlocked ? (
                          <span className="font-retro text-[8px] text-green-600 bg-green-100 px-2 py-0.5 rounded-full border border-green-500">OK!</span>
                        ) : (
                          <span className="font-retro text-[8px] text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">{totalClicks}/{m.count}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {totalClicks >= 300 && (
                <motion.button
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setShowPlatinumTrophy(true);
                    if (soundEnabled) {
                      playMilestoneFanfare();
                    }
                  }}
                  className="w-full bg-[#2a111b] border-2 border-[#ff7597] text-[#4ecdc4] font-retro text-[8px] py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all pixel-shadow select-none shadow-[0_0_15px_rgba(78,205,196,0.3)] my-1 mt-1 text-center font-bold"
                  id="btn-show-platinum-directly"
                >
                  🏆 REEXIBIR TROFÉU DE PLATINA 🏆
                </motion.button>
              )}

              {/* Clear statistics history safely */}
              <button
                onClick={clearClicksHistory}
                className="text-[9px] hover:underline hover:text-love-red font-mono text-center text-love-deep/50 mt-1 cursor-pointer block"
                id="btn-reset-history"
              >
                Limpar histórico de cliques locais
              </button>
            </div>

          </div>

          {/* COLUMN 2 (RIGHT SECTION): LOVE LETTER ENVELOPE & PIXEL CANVAS */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* LOVE LETTER MODULE */}
            <LoveLetterCapsule
              onSpamHearts={(count) => {
                // Spawn cascade from center area
                const bounds = document.getElementById('love-capsule-module')?.getBoundingClientRect();
                if (bounds) {
                  spawnHeartsAtCoordinates(
                    bounds.left + bounds.width / 2,
                    bounds.top + bounds.height / 3,
                    4
                  );
                }
              }}
            />

            {/* INTERACTIVE PAINTING CANVAS BOARD */}
            <LoveBoard 
              onSpawnFountain={(x, y, count) => {
                spawnHeartsAtCoordinates(x, y, 4);
                setTotalClicks((prev) => prev + 1);
              }}
            />

          </div>

        </div>

        {/* SYSTEM FOOTER WITH FLOATING HIPS & INTERACTIVE INSTRUCTION */}
        <footer className="text-center py-6 mt-6 border-t-2 border-love-pink/20 text-love-dark/70 font-mono text-xs flex flex-col items-center justify-center gap-3">
          <div className="flex items-center gap-1.5">
            <Heart size={14} fill="#ff476f" className="text-love-red animate-pulse" />
            <span>Feito com amor e muito carinho para celebrar momentos inesquecíveis de Renan & Mary.</span>
            <Heart size={14} fill="#ff476f" className="text-love-red animate-pulse" />
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <span className="bg-love-sugar/60 border border-love-pink/30 px-3 py-1 rounded-full text-[10px]">
              💖 <span className="font-retro uppercase text-[7px] text-love-red mr-1">Dica:</span> Mary, toque no envelope acima para ler a cartinha!
            </span>
          </div>
        </footer>

      </div>

      {/* PLATINUM CONGRATULATIONS TROPHY OVERLAY */}
      <PlatinumTrophyOverlay
        isOpen={showPlatinumTrophy}
        onClose={() => setShowPlatinumTrophy(false)}
        sender={senderName}
        recipient={recipientName}
      />
    </div>
  );
}
