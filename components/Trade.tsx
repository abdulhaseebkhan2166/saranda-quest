
import React, { useState } from 'react';
import { useStore } from '../store';
import { generateWildPokemon } from '../services/pokeapi';
import { PokemonCard, Button } from './Shared';
import { RefreshCw } from 'lucide-react';

export const Trade = () => {
  const store = useStore();
  const [loading, setLoading] = useState(false);
  const [selectedUuid, setSelectedUuid] = useState<string | null>(null);

  const handleTrade = async () => {
     if (!selectedUuid) return;
     setLoading(true);
     
     // Simulate network delay
     setTimeout(async () => {
         try {
             // Generate random new pokemon from any region (1-493)
             const newMon = await generateWildPokemon(Math.floor(Math.random() * 50) + 5, [1, 493]);
             store.tradePokemon(selectedUuid, newMon);
             setSelectedUuid(null);
             alert(`Trade complete! Received ${newMon.name}!`);
         } catch (e) {
             console.error(e);
             alert("Trade failed due to connection error.");
         } finally {
             setLoading(false);
         }
     }, 2000);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="p-4 bg-white shadow-sm font-bold text-lg flex items-center gap-2">
          <RefreshCw size={20} /> Wonder Trade
      </div>
      <div className="p-4 text-sm text-gray-500">
          Select a Pokémon from your party to trade for a random one from around the world!
      </div>

      <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-4">
          {store.player.party.map(p => (
              <div 
                key={p.uuid} 
                onClick={() => !loading && setSelectedUuid(p.uuid)}
                className={`relative border-2 rounded-xl transition-all ${selectedUuid === p.uuid ? 'border-blue-500 bg-blue-50' : 'border-transparent'}`}
              >
                  <PokemonCard pokemon={p} />
              </div>
          ))}
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
          <Button 
            className="w-full h-12 text-lg" 
            disabled={!selectedUuid || loading}
            onClick={handleTrade}
          >
              {loading ? 'Trading...' : 'Confirm Trade'}
          </Button>
      </div>
    </div>
  );
};
