import React, { useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Clock, Headphones } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProgressBar } from '@/components/ProgressBar';

const sampleContent = {
  'productivity': {
    title: 'The Power of Now',
    author: 'Eckhart Tolle',
    duration: '7h 37m',
    description: 'A guide to spiritual enlightenment and living in the present moment',
    image: '📖',
    episodes: [
      { title: 'Chapter 1: You Are Not Your Mind', duration: '45m' },
      { title: 'Chapter 2: Consciousness', duration: '38m' },
      { title: 'Chapter 3: Moving Deeply into the Now', duration: '42m' }
    ]
  },
  'learning': {
    title: 'The Tim Ferriss Show',
    author: 'Tim Ferriss',
    duration: '2h 15m',
    description: 'World-class performers share their tactics and routines',
    image: '🎧',
    episodes: [
      { title: 'Naval on Meditation and Tactic #1', duration: '55m' },
      { title: 'Morning Routines of Billionaires', duration: '48m' },
      { title: 'Learning Strategies from Josh Waitzkin', duration: '52m' }
    ]
  },
  'relaxation': {
    title: 'Calm Meditations',
    author: 'Calm App',
    duration: '30m',
    description: 'Guided meditations for stress relief and better sleep',
    image: '🧘',
    episodes: [
      { title: 'Daily Calm: Letting Go', duration: '10m' },
      { title: 'Sleep Story: Forest Rain', duration: '25m' },
      { title: 'Breathing Exercise: 4-7-8', duration: '8m' }
    ]
  }
};

export const AudioScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof sampleContent>('productivity');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedEpisode, setSelectedEpisode] = useState(0);
  
  const currentContent = sampleContent[selectedCategory];
  const currentEpisode = currentContent.episodes[selectedEpisode];
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      // Simulate progress
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            clearInterval(interval);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-bg pb-20">
      <div className="max-w-md mx-auto p-4">
        {/* Header */}
        <div className="text-center mb-6 pt-4">
          <h1 className="text-2xl font-bold text-foreground mb-2">Audio Content</h1>
          <p className="text-muted-foreground">Curated content for your growth journey</p>
        </div>

        {/* Category Selection */}
        <Card className="p-4 mb-6 bg-surface border-card-border">
          <div className="flex items-center gap-3 mb-3">
            <Headphones className="h-5 w-5 text-primary" />
            <span className="font-medium text-foreground">Choose your focus</span>
          </div>
          <Select value={selectedCategory} onValueChange={(value: keyof typeof sampleContent) => setSelectedCategory(value)}>
            <SelectTrigger className="bg-muted border-border text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-surface border-border">
              <SelectItem value="productivity" className="text-foreground">🚀 Productivity</SelectItem>
              <SelectItem value="learning" className="text-foreground">📚 Learning</SelectItem>
              <SelectItem value="relaxation" className="text-foreground">🧘 Relaxation</SelectItem>
            </SelectContent>
          </Select>
        </Card>

        {/* Now Playing */}
        <Card className="p-4 mb-6 bg-gradient-primary text-primary-foreground border-none shadow-glow">
          <div className="text-center">
            <div className="text-4xl mb-3">{currentContent.image}</div>
            <h2 className="text-lg font-bold mb-1">{currentContent.title}</h2>
            <p className="text-sm opacity-90 mb-1">{currentContent.author}</p>
            <p className="text-xs opacity-75 mb-4">{currentContent.description}</p>
            
            <div className="mb-4">
              <div className="text-sm mb-2">Now Playing: {currentEpisode.title}</div>
              <ProgressBar 
                current={currentTime} 
                max={100} 
                showNumbers={false}
                variant="xp"
              />
              <div className="flex justify-between text-xs mt-1 opacity-75">
                <span>{Math.floor(currentTime * 0.45)}:{String(Math.floor((currentTime * 0.45) % 1 * 60)).padStart(2, '0')}</span>
                <span>{currentEpisode.duration}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-primary-foreground hover:bg-white/20 rounded-full h-10 w-10 p-0"
                onClick={() => setSelectedEpisode(Math.max(0, selectedEpisode - 1))}
              >
                <SkipBack className="h-5 w-5" />
              </Button>
              
              <Button
                onClick={togglePlay}
                className="bg-white/20 hover:bg-white/30 text-primary-foreground rounded-full h-12 w-12 p-0"
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-primary-foreground hover:bg-white/20 rounded-full h-10 w-10 p-0"
                onClick={() => setSelectedEpisode(Math.min(currentContent.episodes.length - 1, selectedEpisode + 1))}
              >
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Episode List */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-3">Episodes</h2>
          <div className="space-y-2">
            {currentContent.episodes.map((episode, index) => (
              <Card
                key={index}
                className={`p-3 cursor-pointer transition-all duration-300 border border-card-border
                  ${index === selectedEpisode 
                    ? 'bg-primary/10 border-primary/30' 
                    : 'bg-surface hover:bg-surface-elevated'
                  }
                `}
                onClick={() => setSelectedEpisode(index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className={`font-medium text-sm ${index === selectedEpisode ? 'text-primary' : 'text-foreground'}`}>
                      {episode.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span className="text-xs">{episode.duration}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Suggestions */}
        <Card className="p-4 bg-accent/10 border-accent/30">
          <h3 className="font-semibold text-foreground mb-2">💡 Smart Suggestion</h3>
          <p className="text-sm text-muted-foreground">
            Based on your 15-minute commute, we recommend starting with "Daily Calm: Letting Go" - 
            perfect for arriving refreshed and focused!
          </p>
        </Card>
      </div>
    </div>
  );
};