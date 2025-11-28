
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Pokedex } from './components/Pokedex';
import { Game } from './components/Game';
import { Team } from './components/Team';
import { Bag } from './components/Bag';
import { Shop } from './components/Shop';
import { Trade } from './components/Trade';
import { Home } from './components/Home';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Home onNavigate={setActiveTab} />;
      case 'pokedex': return <Pokedex />;
      case 'game': return <Game />;
      case 'team': return <Team />;
      case 'bag': return <Bag />;
      case 'shop': return <Shop />;
      case 'trade': return <Trade />;
      default: return <Home />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

export default App;
