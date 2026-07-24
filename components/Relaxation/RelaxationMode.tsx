import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Sparkles, X, Trees, Heart, Wind, Headphones, CloudRain, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RelaxationModeProps {
  onExit: () => void;
}

const RELAXATION_QUOTES = [
  "Take a deep breath. Let go of every thought that doesn't serve your growth.",
  "Nature does not hurry, yet everything is accomplished.",
  "Peace comes from within. Feel the tranquility of the forest.",
  "You don't have to figure everything out right now. Just breathe.",
  "Small steps every day lead to remarkable transformations.",
  "Quiet the mind, and the soul will speak."
];

export const RelaxationMode: React.FC<RelaxationModeProps> = ({ onExit }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(80); // 0-100
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeTrack, setActiveTrack] = useState<'lofi' | 'rain' | 'forest'>('lofi');
  const [quoteIdx, setQuoteIdx] = useState<number>(0);
  const [breathingPhase, setBreathingPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathingTimer, setBreathingTimer] = useState<number>(4);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Rotate quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIdx((prev) => (prev + 1) % RELAXATION_QUOTES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Breathing timer cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setBreathingTimer((prev) => {
        if (prev <= 1) {
          if (breathingPhase === 'Inhale') {
            setBreathingPhase('Hold');
            return 4;
          } else if (breathingPhase === 'Hold') {
            setBreathingPhase('Exhale');
            return 4;
          } else {
            setBreathingPhase('Inhale');
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [breathingPhase]);

  // Floating Leaves Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Create 65 floating organic leaves
    const leafColors = [
      'rgba(74, 222, 128, 0.75)',  // emerald green
      'rgba(134, 239, 172, 0.7)',   // light green
      'rgba(52, 211, 153, 0.8)',   // mint teal
      'rgba(163, 230, 53, 0.65)',  // lime green
      'rgba(250, 204, 21, 0.6)'    // golden autumn green
    ];

    const leaves = Array.from({ length: 65 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 12 + 8,
      color: leafColors[Math.floor(Math.random() * leafColors.length)],
      angle: Math.random() * Math.PI * 2,
      angularVelocity: (Math.random() - 0.5) * 0.03,
      vx: (Math.random() - 0.5) * 0.8,
      vy: Math.random() * 0.8 + 0.4, // float downwards
      swayFrequency: Math.random() * 0.02 + 0.01,
      swayAmplitude: Math.random() * 1.5 + 0.5,
      time: Math.random() * 100
    }));

    // Draw single leaf path
    const drawLeaf = (x: number, y: number, size: number, angle: number, color: string) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      ctx.beginPath();
      // Curved leaf shape
      ctx.moveTo(0, -size);
      ctx.quadraticCurveTo(size * 0.6, -size * 0.3, size * 0.2, size * 0.8);
      ctx.quadraticCurveTo(0, size, 0, size);
      ctx.quadraticCurveTo(-size * 0.2, size * 0.8, -size * 0.6, -size * 0.3);
      ctx.quadraticCurveTo(0, -size, 0, -size);

      ctx.fillStyle = color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(34, 197, 94, 0.3)';
      ctx.fill();

      // Leaf vein
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.8);
      ctx.lineTo(0, size * 0.8);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      leaves.forEach((l) => {
        l.time += l.swayFrequency;
        l.x += l.vx + Math.sin(l.time) * l.swayAmplitude;
        l.y += l.vy;
        l.angle += l.angularVelocity;

        // Wrap around screen
        if (l.y > height + 20) {
          l.y = -20;
          l.x = Math.random() * width;
        }
        if (l.x < -20) l.x = width + 20;
        if (l.x > width + 20) l.x = -20;

        drawLeaf(l.x, l.y, l.size, l.angle, l.color);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <motion.div
      initial={{ scale: 0.8, rotateX: 20, rotateY: 20, opacity: 0 }}
      animate={{ scale: 1, rotateX: 0, rotateY: 0, opacity: 1 }}
      exit={{ scale: 0.1, rotateZ: -15, opacity: 0, filter: 'blur(20px)' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 bg-gradient-to-b from-emerald-950 via-teal-950 to-green-950 text-emerald-100 flex flex-col justify-between p-6 overflow-hidden select-none"
    >
      {/* Floating Leaves Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Ambient Forest Light Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-emerald-500/20 rounded-full blur-[150px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-lime-500/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-10 left-10 w-[350px] h-[350px] bg-teal-500/15 rounded-full blur-[110px] pointer-events-none" />

      {/* Silhouetted Tree Canopy Pattern at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 opacity-20 pointer-events-none bg-gradient-to-t from-emerald-950 to-transparent flex justify-around items-end overflow-hidden">
        <Trees className="w-48 h-48 text-emerald-700 transform -translate-y-4" />
        <Trees className="w-64 h-64 text-green-800 transform translate-y-2" />
        <Trees className="w-56 h-56 text-teal-800 transform -translate-y-2" />
        <Trees className="w-40 h-40 text-emerald-700 transform translate-y-4" />
      </div>

      {/* Invisible YouTube Audio Stream for Lofi Girl (https://www.youtube.com/watch?v=lTRiuFIWV54) */}
      {isPlaying && activeTrack === 'lofi' && (
        <iframe
          className="hidden"
          width="1"
          height="1"
          src={`https://www.youtube.com/embed/lTRiuFIWV54?autoplay=1&enablejsapi=1&loop=1&playlist=lTRiuFIWV54`}
          title="Lofi Girl YouTube Stream"
          allow="autoplay"
        />
      )}

      {/* Top Header Controls Bar */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 shadow-glow">
            <Trees className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-2 tracking-tight">
              Forest Relaxation Sanctuary <Sparkles className="w-4 h-4 text-emerald-300 animate-spin" />
            </h2>
            <p className="text-xs text-emerald-300/80">Lofi Beats, Nature Ambience & Floating Leaves</p>
          </div>
        </div>

        {/* Floating Exit Button on the side */}
        <button
          onClick={onExit}
          className="px-4 py-2 bg-emerald-950/80 hover:bg-emerald-900 text-white border border-emerald-700/60 rounded-full text-xs font-bold shadow-xl backdrop-blur-md transition-all flex items-center gap-2 hover:scale-105 active:scale-95 group"
        >
          <span>Exit Sanctuary</span>
          <div className="w-5 h-5 rounded-full bg-emerald-800 flex items-center justify-center group-hover:bg-red-500/20 group-hover:text-red-400 transition-colors">
            <X className="w-3.5 h-3.5" />
          </div>
        </button>
      </div>

      {/* Center Breathing Visualizer & Quote */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto space-y-8 max-w-lg mx-auto text-center">
        {/* Breathing Orb with Leaf Theme */}
        <div className="relative flex items-center justify-center">
          <motion.div
            animate={{
              scale: breathingPhase === 'Inhale' ? 1.4 : breathingPhase === 'Hold' ? 1.4 : 0.95,
              opacity: breathingPhase === 'Inhale' ? 0.85 : 0.55
            }}
            transition={{ duration: 4, ease: 'easeInOut' }}
            className="w-48 h-48 rounded-full bg-gradient-to-tr from-emerald-600/40 via-teal-500/30 to-lime-500/30 border border-emerald-400/40 shadow-[0_0_90px_rgba(34,197,94,0.35)] flex items-center justify-center backdrop-blur-md"
          >
            <div className="text-center space-y-1">
              <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-200 opacity-90">
                {breathingPhase}
              </span>
              <div className="text-3xl font-extrabold font-mono text-white">
                {breathingTimer}s
              </div>
            </div>
          </motion.div>

          {/* Pulsing Nature Wave Rings */}
          <div className="absolute -inset-4 rounded-full border border-emerald-500/30 animate-ping opacity-25 pointer-events-none" />
        </div>

        {/* Dynamic Quote Box */}
        <AnimatePresence mode="wait">
          <motion.div
            key={quoteIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-emerald-950/70 border border-emerald-500/30 rounded-2xl p-4 backdrop-blur-md text-sm text-emerald-100 font-medium leading-relaxed italic shadow-xl"
          >
            "{RELAXATION_QUOTES[quoteIdx]}"
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Floating Control Bar */}
      <div className="relative z-10 max-w-xl mx-auto w-full bg-emerald-950/80 border border-emerald-500/30 rounded-2xl p-4 backdrop-blur-xl shadow-2xl space-y-3">
        {/* Track Switcher */}
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => { setActiveTrack('lofi'); setIsPlaying(true); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTrack === 'lofi'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'bg-emerald-900/60 text-emerald-300 hover:text-white'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" /> Lofi Girl Radio
          </button>
          <button
            onClick={() => { setActiveTrack('rain'); setIsPlaying(true); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTrack === 'rain'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'bg-emerald-900/60 text-emerald-300 hover:text-white'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" /> Gentle Rain
          </button>
          <button
            onClick={() => { setActiveTrack('forest'); setIsPlaying(true); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTrack === 'forest'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'bg-emerald-900/60 text-emerald-300 hover:text-white'
            }`}
          >
            <Wind className="w-3.5 h-3.5" /> Forest Breeze
          </button>
        </div>

        {/* Play/Pause & Volume Slider Row */}
        <div className="flex items-center justify-between pt-1 border-t border-emerald-800/60">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(prev => !prev)}
              className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center font-bold shadow-lg transition-transform active:scale-95"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
            <div className="text-xs">
              <p className="font-bold text-white">
                {activeTrack === 'lofi' ? 'Lofi Girl Live Stream' : activeTrack === 'rain' ? 'Relaxing Rain' : 'Forest Breeze'}
              </p>
              <p className="text-[10px] text-emerald-300/70 font-mono">
                {isPlaying ? '♪ Playing Serene Nature Sound' : 'Paused'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(prev => !prev)}
              className="p-1.5 text-emerald-300 hover:text-white transition-colors"
            >
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(Number(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              className="w-24 accent-emerald-500 cursor-pointer h-1.5 rounded-lg bg-emerald-900"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
