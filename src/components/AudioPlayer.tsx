import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([0.5]);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Simulate audio with a simple oscillator for demo purposes
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
    }
  };

  const togglePlay = () => {
    initAudioContext();
    
    if (isPlaying) {
      // Stop audio
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current = null;
      }
      setIsPlaying(false);
    } else {
      // Start audio - simple ambient sound simulation
      if (audioContextRef.current && gainNodeRef.current) {
        oscillatorRef.current = audioContextRef.current.createOscillator();
        oscillatorRef.current.type = 'sine';
        oscillatorRef.current.frequency.setValueAtTime(200, audioContextRef.current.currentTime);
        oscillatorRef.current.frequency.exponentialRampToValueAtTime(
          100, audioContextRef.current.currentTime + 2
        );
        
        const lfo = audioContextRef.current.createOscillator();
        const lfoGain = audioContextRef.current.createGain();
        
        lfo.frequency.value = 0.5;
        lfoGain.gain.value = 20;
        
        lfo.connect(lfoGain);
        lfoGain.connect(oscillatorRef.current.frequency);
        
        oscillatorRef.current.connect(gainNodeRef.current);
        
        gainNodeRef.current.gain.value = isMuted ? 0 : volume[0] * 0.1;
        
        oscillatorRef.current.start();
        lfo.start();
        
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = !isMuted ? 0 : volume[0] * 0.1;
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume);
    if (gainNodeRef.current && !isMuted) {
      gainNodeRef.current.gain.value = newVolume[0] * 0.1;
    }
  };

  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="backdrop-blur-sm bg-card/90 border-primary/20">
        <div className="p-3">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <Music className="h-4 w-4" />
            </Button>
            
            <Button
              onClick={togglePlay}
              variant="outline"
              size="icon"
              className="h-8 w-8"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 'auto', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="flex items-center gap-3"
                >
                  <Button
                    onClick={toggleMute}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    {isMuted ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Button>
                  
                  <div className="w-16">
                    <Slider
                      value={volume}
                      onValueChange={handleVolumeChange}
                      max={1}
                      step={0.1}
                      className="cursor-pointer"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-xs text-muted-foreground text-center"
            >
              Ambient Focus Sounds
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export { AudioPlayer };