import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Sparkles, Music, Waves, CloudRain, Brain, Wind, Maximize2 } from 'lucide-react';
import { motion } from 'framer-motion';

export interface TrackOption {
  id: string;
  name: string;
  type: 'youtube' | 'synth';
  youtubeId?: string;
  synthType?: 'rain' | 'binaural' | 'waves' | 'brown_noise';
  icon: any;
  color: string;
}

export const TRACK_PRESETS: TrackOption[] = [
  {
    id: 'lofi-girl',
    name: 'Lofi Girl Live Radio',
    type: 'youtube',
    youtubeId: 'lTRiuFIWV54',
    icon: Music,
    color: 'text-purple-500 bg-purple-500/10 border-purple-500/20'
  },
  {
    id: 'rain-synth',
    name: 'Gentle Rain',
    type: 'synth',
    synthType: 'rain',
    icon: CloudRain,
    color: 'text-blue-500 bg-blue-500/10 border-blue-500/20'
  },
  {
    id: 'binaural-synth',
    name: '432Hz Deep Focus',
    type: 'synth',
    synthType: 'binaural',
    icon: Brain,
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
  },
  {
    id: 'waves-synth',
    name: 'Ocean Waves',
    type: 'synth',
    synthType: 'waves',
    icon: Waves,
    color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20'
  },
  {
    id: 'forest-synth',
    name: 'Forest Wind',
    type: 'synth',
    synthType: 'brown_noise',
    icon: Wind,
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20'
  }
];

interface FocusAudioPlayerProps {
  onOpenRelaxationMode?: () => void;
  compact?: boolean;
}

export const FocusAudioPlayer: React.FC<FocusAudioPlayerProps> = ({ onOpenRelaxationMode, compact = false }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedTrack, setSelectedTrack] = useState<TrackOption>(TRACK_PRESETS[0]);
  const [volume, setVolume] = useState<number>(70); // 0 - 100
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Web Audio Context for synths
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthNodesRef = useRef<{ gain?: GainNode; osc1?: OscillatorNode; osc2?: OscillatorNode; noiseNode?: AudioBufferSourceNode; filter?: BiquadFilterNode }>({});

  // Stop web audio noise
  const stopWebAudio = () => {
    try {
      if (synthNodesRef.current.osc1) {
        synthNodesRef.current.osc1.stop();
        synthNodesRef.current.osc1.disconnect();
      }
      if (synthNodesRef.current.osc2) {
        synthNodesRef.current.osc2.stop();
        synthNodesRef.current.osc2.disconnect();
      }
      if (synthNodesRef.current.noiseNode) {
        synthNodesRef.current.noiseNode.stop();
        synthNodesRef.current.noiseNode.disconnect();
      }
      synthNodesRef.current = {};
    } catch (e) {
      // ignore stop errors
    }
  };

  // Start web audio synth based on track type
  const startWebAudio = (track: TrackOption) => {
    stopWebAudio();
    if (track.type !== 'synth') return;

    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const gainNode = ctx.createGain();
      const currentVol = isMuted ? 0 : (volume / 100) * 0.4;
      gainNode.gain.setValueAtTime(currentVol, ctx.currentTime);
      gainNode.connect(ctx.destination);
      synthNodesRef.current.gain = gainNode;

      if (track.synthType === 'binaural') {
        // Binaural theta beat (100Hz and 106Hz)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(216, ctx.currentTime);
        osc2.frequency.setValueAtTime(222, ctx.currentTime);

        osc1.connect(gainNode);
        osc2.connect(gainNode);

        osc1.start();
        osc2.start();

        synthNodesRef.current.osc1 = osc1;
        synthNodesRef.current.osc2 = osc2;
      } else if (track.synthType === 'rain' || track.synthType === 'brown_noise' || track.synthType === 'waves') {
        // Create 2-second buffer of pink/brown noise
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);

        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          lastOut = (lastOut + 0.02 * white) / 1.02;
          output[i] = lastOut * 3.5;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(
          track.synthType === 'rain' ? 1200 : track.synthType === 'waves' ? 600 : 400,
          ctx.currentTime
        );

        whiteNoise.connect(filter);
        filter.connect(gainNode);
        whiteNoise.start();

        synthNodesRef.current.noiseNode = whiteNoise;
        synthNodesRef.current.filter = filter;
      }
    } catch (e) {
      console.warn('Web Audio init error:', e);
    }
  };

  // Update volume on gain node
  useEffect(() => {
    if (synthNodesRef.current.gain && audioCtxRef.current) {
      const currentVol = isMuted ? 0 : (volume / 100) * 0.4;
      synthNodesRef.current.gain.gain.setValueAtTime(currentVol, audioCtxRef.current.currentTime);
    }
  }, [volume, isMuted]);

  // Track / Play change listener
  useEffect(() => {
    if (isPlaying) {
      if (selectedTrack.type === 'synth') {
        startWebAudio(selectedTrack);
      } else {
        stopWebAudio();
      }
    } else {
      stopWebAudio();
    }

    return () => {
      stopWebAudio();
    };
  }, [isPlaying, selectedTrack]);

  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  const handleSelectTrack = (track: TrackOption) => {
    setSelectedTrack(track);
    setIsPlaying(true);
  };

  return (
    <div className={`bg-surface border border-border/10 rounded-2xl p-6 shadow-sm space-y-5 ${compact ? 'p-4' : 'p-6'}`}>
      {/* Invisible YouTube iframe audio embed when YouTube track is selected */}
      {selectedTrack.type === 'youtube' && isPlaying && (
        <iframe
          className="hidden"
          width="1"
          height="1"
          src={`https://www.youtube.com/embed/${selectedTrack.youtubeId}?autoplay=1&enablejsapi=1&loop=1&playlist=${selectedTrack.youtubeId}`}
          title="Focus YouTube Audio"
          allow="autoplay"
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-500/20">
            <Music className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
              Focus Audio & Ambient Beats
              {isPlaying && (
                <span className="flex gap-0.5 items-end h-3 ml-1">
                  <span className="w-0.5 bg-purple-500 animate-[bounce_1s_infinite_100ms] h-full" />
                  <span className="w-0.5 bg-purple-500 animate-[bounce_1s_infinite_300ms] h-2/3" />
                  <span className="w-0.5 bg-purple-500 animate-[bounce_1s_infinite_200ms] h-full" />
                </span>
              )}
            </h3>
            <p className="text-[11px] text-text-muted">Enhance focus & reduce distraction during study sessions</p>
          </div>
        </div>

        {onOpenRelaxationMode && (
          <button
            onClick={onOpenRelaxationMode}
            className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Relaxation Mode</span>
          </button>
        )}
      </div>

      {/* Presets Slider / Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {TRACK_PRESETS.map((track) => {
          const Icon = track.icon;
          const isSelected = selectedTrack.id === track.id;
          return (
            <button
              key={track.id}
              onClick={() => handleSelectTrack(track)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 border ${
                isSelected
                  ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                  : 'bg-surfaceHighlight text-text-secondary border-border/10 hover:text-text-primary hover:border-border/30'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{track.name}</span>
            </button>
          );
        })}
      </div>

      {/* Primary Controls Row */}
      <div className="flex items-center justify-between bg-surfaceHighlight/50 border border-border/10 rounded-xl p-3">
        {/* Track Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={togglePlay}
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-transform active:scale-95 shadow-md ${
              isPlaying
                ? 'bg-purple-600 text-white'
                : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 hover:bg-purple-500/20'
            }`}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>

          <div className="truncate">
            <p className="text-xs font-bold text-text-primary truncate">{selectedTrack.name}</p>
            <p className="text-[10px] text-text-muted font-mono">
              {isPlaying ? 'Playing • Active Focus Sound' : 'Paused • Tap Play to listen'}
            </p>
          </div>
        </div>

        {/* Volume & Mute */}
        <div className="flex items-center gap-2 shrink-0 ml-4">
          <button
            onClick={() => setIsMuted(prev => !prev)}
            className="p-1.5 text-text-muted hover:text-text-primary transition-colors"
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
            className="w-20 accent-purple-600 cursor-pointer h-1.5 rounded-lg bg-surfaceHighlight"
          />
        </div>
      </div>
    </div>
  );
};
