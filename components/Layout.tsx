
import React, { useState } from 'react';
import { Home, Sword, Map, ShoppingBag, Backpack, Users, RefreshCw, Settings as SettingsIcon } from 'lucide-react';
import { clsx } from 'clsx';
import { Settings } from './Settings';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const NavItem = ({ icon: Icon, label, id, active, onClick }: any) => (
  <button
    onClick={() => onClick(id)}
    className={clsx(
      "flex flex-col items-center justify-center min-w-[60px] h-full space-y-1 snap-center transition-colors",
      active ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
    )}
  >
    <Icon size={22} strokeWidth={active ? 2.5 : 2} />
    <span className="text-[9px] font-medium uppercase tracking-tight">{label}</span>
  </button>
);

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-gray-50 max-w-md mx-auto shadow-2xl overflow-hidden relative border-x border-gray-800">
      
      {/* Header */}
      <header className="bg-blue-600 text-white p-3 shadow-md z-20 flex justify-between items-center shrink-0 h-14">
        <div className="flex items-center gap-2" onClick={() => onTabChange('home')}>
            <div className="w-8 h-8 bg-yellow-400 rounded-full border-2 border-white relative flex items-center justify-center shadow-sm">
                <span className="font-bold text-blue-800 text-xs">S</span>
            </div>
            <h1 className="font-bold text-lg tracking-tight">Saranda League</h1>
        </div>
        <div className="flex items-center gap-2">
             <div className="text-[10px] bg-blue-800 px-2 py-0.5 rounded font-mono uppercase text-yellow-300 font-bold hidden sm:block">Gen 6 OU</div>
             <button onClick={() => setShowSettings(true)} className="p-1 hover:bg-blue-500 rounded">
                 <SettingsIcon size={20} />
             </button>
        </div>
      </header>

      {/* Main Content Area - Critical for scrolling */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth bg-gray-100">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 h-16 shrink-0 z-30 pb-safe">
        <div className="flex h-full px-2 gap-1 items-center justify-between overflow-x-auto no-scrollbar">
          <NavItem icon={Home} label="Home" id="home" active={activeTab === 'home'} onClick={onTabChange} />
          <NavItem icon={Sword} label="Dex" id="pokedex" active={activeTab === 'pokedex'} onClick={onTabChange} />
          <NavItem icon={Users} label="Team" id="team" active={activeTab === 'team'} onClick={onTabChange} />
          <NavItem icon={Map} label="Game" id="game" active={activeTab === 'game'} onClick={onTabChange} />
          <NavItem icon={Backpack} label="Bag" id="bag" active={activeTab === 'bag'} onClick={onTabChange} />
          <NavItem icon={ShoppingBag} label="Shop" id="shop" active={activeTab === 'shop'} onClick={onTabChange} />
          <NavItem icon={RefreshCw} label="Trade" id="trade" active={activeTab === 'trade'} onClick={onTabChange} />
        </div>
      </nav>

      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
    </div>
  );
};
