import React, { useState } from 'react';
import { GameProvider } from '@/contexts/GameContext';
import { Navigation } from '@/components/Navigation';
import { HomeScreen } from '@/screens/HomeScreen';
import { TasksScreen } from '@/screens/TasksScreen';
import { RewardsScreen } from '@/screens/RewardsScreen';
import { AudioScreen } from '@/screens/AudioScreen';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState('home');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onNavigate={setCurrentScreen} />;
      case 'tasks':
        return <TasksScreen />;
      case 'rewards':
        return <RewardsScreen />;
      case 'audio':
        return <AudioScreen />;
      default:
        return <HomeScreen onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <GameProvider>
      <div className="min-h-screen bg-background">
        {renderScreen()}
        <Navigation currentScreen={currentScreen} onNavigate={setCurrentScreen} />
      </div>
    </GameProvider>
  );
};

export default Index;
