import React, { useState } from 'react';
import { useStore } from '../store';
import { ITEMS } from '../constants';
import { Button, PokemonCard } from './Shared';
import { X, Check } from 'lucide-react';

export const Bag = () => {
  const store = useStore();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const items = Object.entries(store.player.items).filter(([_, count]) => (count as number) > 0);

  const handleUse = (pokemonUuid: string) => {
    if (selectedItem) {
        store.useItem(selectedItem, pokemonUuid);
        setSelectedItem(null); // Close modal
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="p-4 bg-white shadow-sm font-bold text-lg">My Bag</div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {items.length === 0 ? (
            <div className="text-center text-gray-400 mt-10">Your bag is empty.</div>
        ) : (
            <div className="space-y-3">
                {items.map(([key, count]) => {
                    const item = ITEMS[key];
                    if (!item) return null;
                    return (
                        <div key={key} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-gray-100`}>
                                    {item.category === 'ball' ? '🔴' : item.category === 'medicine' ? '💊' : '💎'}
                                </div>
                                <div>
                                    <div className="font-bold text-sm">{item.name}</div>
                                    <div className="text-xs text-gray-500">x{count}</div>
                                </div>
                            </div>
                            {(item.category === 'medicine' || item.category === 'status') && (
                                <Button variant="primary" className="text-xs px-3 py-1" onClick={() => setSelectedItem(key)}>Use</Button>
                            )}
                        </div>
                    );
                })}
            </div>
        )}
      </div>

      {/* Pokemon Selector Modal */}
      {selectedItem && (
        <div className="absolute inset-0 z-50 bg-black/50 flex flex-col justify-end">
            <div className="bg-white rounded-t-2xl p-4 h-2/3 animate-in slide-in-from-bottom">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold">Use {ITEMS[selectedItem].name} on?</h3>
                    <button onClick={() => setSelectedItem(null)}><X /></button>
                </div>
                <div className="grid grid-cols-2 gap-3 overflow-y-auto h-full pb-10">
                    {store.player.party.map(p => (
                        <div key={p.uuid} className="relative" onClick={() => handleUse(p.uuid)}>
                            <PokemonCard pokemon={p} showHp />
                            {/* Overlay if fainted and item isn't revive */}
                            {p.currentHp === 0 && selectedItem !== 'revive' && (
                                <div className="absolute inset-0 bg-white/50 cursor-not-allowed" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};