
import React from 'react';
import { Button } from './Shared';
import { Trophy, Shield, Zap, Users, Download, ArrowRight } from 'lucide-react';

export const Home = ({ onNavigate }: { onNavigate?: (tab: string) => void }) => {
  return (
    <div className="min-h-full bg-gradient-to-b from-blue-600 to-blue-400 text-white">
      {/* Hero Section */}
      <div className="p-6 pt-10 flex flex-col items-center text-center">
        <div className="w-32 h-32 bg-white rounded-full border-4 border-yellow-400 flex items-center justify-center shadow-xl mb-6 relative">
          <div className="absolute inset-0 rounded-full border-4 border-blue-600 opacity-20 animate-pulse"></div>
          <Shield size={64} className="text-blue-600" fill="currentColor" />
          <div className="absolute -bottom-2 bg-yellow-400 text-blue-900 text-xs font-bold px-3 py-1 rounded-full border border-white">
            EST. 2025
          </div>
        </div>
        
        <h1 className="text-3xl font-extrabold mb-2 tracking-tight drop-shadow-md">
          SARANDA <br/><span className="text-yellow-300">POKÉMON LEAGUE</span>
        </h1>
        <p className="text-blue-100 max-w-xs mx-auto mb-8 text-sm font-medium">
          Build your dream team, battle through the region, and become the Champion of the Saranda League!
        </p>

        <Button 
           variant="secondary" 
           className="bg-yellow-400 text-blue-900 hover:bg-yellow-300 border-b-4 border-yellow-600 active:border-b-0 active:translate-y-1 transition-all w-full max-w-[200px] flex items-center justify-center gap-2 shadow-lg"
           onClick={() => onNavigate && onNavigate('game')}
        >
           <Zap size={20} fill="currentColor"/> Start Journey
        </Button>
      </div>

      {/* Info Cards */}
      <div className="bg-gray-50 rounded-t-3xl p-6 text-gray-800 pb-20 space-y-6 shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
        
        <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold flex items-center gap-2">
                <Trophy className="text-yellow-500" /> League Info
            </h2>
        </div>

        {/* Card 1: Format */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                <Shield className="text-blue-600" />
            </div>
            <div>
                <h3 className="font-bold text-lg">Gen 6 OU Format</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                    Teams must be compatible with Generation 6 OverUsed rules. Mega Evolutions (up to XYZ series) are allowed!
                </p>
            </div>
        </div>

        {/* Card 2: Team Building */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                <Users className="text-green-600" />
            </div>
            <div>
                <h3 className="font-bold text-lg">Team Builder</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-2">
                    Create your strategy. Select moves, items, and perfect your stats using the in-app editor.
                </p>
                <button 
                    onClick={() => onNavigate && onNavigate('team')}
                    className="text-green-600 text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:underline"
                >
                    Go to Builder <ArrowRight size={12} />
                </button>
            </div>
        </div>

        {/* Card 3: Showdown */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                <Download className="text-purple-600" />
            </div>
            <div>
                <h3 className="font-bold text-lg">Export Compatible</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                    Easily export your team to Pokémon Showdown text format for official tournament validation.
                </p>
            </div>
        </div>

        <div className="text-center pt-4">
             <div className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Sponsored By</div>
             <div className="font-bold text-gray-300 text-xl">SARANDA CORP</div>
        </div>

      </div>
    </div>
  );
};
