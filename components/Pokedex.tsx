
import React, { useEffect, useState, useMemo } from 'react';
import { getPokemonList, getPokemonDetails, getItemList, getItemDetails, getEvolutionChain } from '../services/pokeapi';
import { PokemonCard, Button, TypeBadge } from './Shared';
import { Pokemon, PokemonType } from '../types';
import { Search, Filter, X, ChevronDown, ChevronRight } from 'lucide-react';
import { TYPE_COLORS, TYPE_CHART } from '../constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const Pokedex = () => {
  const [mode, setMode] = useState<'pokemon' | 'items'>('pokemon');
  const [pokemonList, setPokemonList] = useState<{name: string, url: string}[]>([]);
  const [itemList, setItemList] = useState<{name: string, url: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [evolutionChain, setEvolutionChain] = useState<{name: string, url: string}[]>([]);
  const [selectedItemDetails, setSelectedItemDetails] = useState<any>(null);

  // Load Pokemon (Infinite Scroll logic base)
  useEffect(() => {
    if (mode === 'pokemon' && pokemonList.length === 0) {
        setLoading(true);
        getPokemonList(151, 0)
          .then(res => {
            setPokemonList(res);
            setLoading(false);
          })
          .catch(() => setLoading(false));
    } else if (mode === 'items' && itemList.length === 0) {
        setLoading(true);
        getItemList(100, 0)
          .then(res => {
              setItemList(res);
              setLoading(false);
          })
          .catch(() => setLoading(false));
    }
  }, [mode]);

  const loadMore = () => {
      setLoading(true);
      if (mode === 'pokemon') {
          const nextOffset = pokemonList.length;
          getPokemonList(50, nextOffset).then(res => {
              setPokemonList(prev => [...prev, ...res]);
              setLoading(false);
          });
      } else {
          const nextOffset = itemList.length;
          getItemList(50, nextOffset).then(res => {
              setItemList(prev => [...prev, ...res]);
              setLoading(false);
          });
      }
  };

  const handleSelectPokemon = async (index: number) => {
    try {
        const details = await getPokemonDetails(index + 1);
        setSelectedPokemon(details);
        
        // Fetch Evolution
        const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${index+1}/`;
        const chain = await getEvolutionChain(speciesUrl);
        setEvolutionChain(chain);
        
    } catch(e) {
        console.error("Failed to load details", e);
    }
  };

  const handleSelectItem = async (name: string) => {
      const details = await getItemDetails(name);
      setSelectedItemDetails(details);
  };

  const filteredPokemon = useMemo(() => {
    return pokemonList
      .map((p, i) => ({ ...p, id: i + 1 })) // Map simplified ID based on index for speed
      .filter(p => p.name.includes(search.toLowerCase()));
  }, [pokemonList, search]);

  const filteredItems = useMemo(() => {
      return itemList.filter(i => i.name.includes(search.toLowerCase()));
  }, [itemList, search]);

  const calculateWeaknesses = (types: PokemonType[]) => {
      const weaknesses: string[] = [];
      const resistances: string[] = [];
      
      Object.keys(TYPE_CHART).forEach(type => {
          let multiplier = 1;
          types.forEach(t => {
              const attacker = TYPE_CHART[type as PokemonType] || {};
              multiplier *= (attacker[t as PokemonType] ?? 1);
          });
          
          if (multiplier >= 2) weaknesses.push(type);
          if (multiplier <= 0.5) resistances.push(type);
      });
      return { weaknesses, resistances };
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <div className="bg-white p-3 shadow-sm z-10 space-y-2">
        <div className="flex gap-2">
            <button 
                onClick={() => setMode('pokemon')}
                className={`flex-1 py-1 text-xs font-bold rounded-full ${mode === 'pokemon' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-500'}`}
            >
                Pokémon
            </button>
            <button 
                onClick={() => setMode('items')}
                className={`flex-1 py-1 text-xs font-bold rounded-full ${mode === 'items' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}`}
            >
                Items
            </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder={mode === 'pokemon' ? "Search Pokémon..." : "Search Items..."}
            className="w-full bg-gray-100 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3" onScroll={(e) => {
          const bottom = e.currentTarget.scrollHeight - e.currentTarget.scrollTop === e.currentTarget.clientHeight;
          if (bottom && !loading && !search) loadMore();
      }}>
        {mode === 'pokemon' ? (
            <div className="grid grid-cols-3 gap-3 pb-20">
                {filteredPokemon.map((p, i) => {
                   // Correct ID extraction from URL if available, else fallback
                   const id = parseInt(p.url.split('/').filter(Boolean).pop() || '0');
                   return (
                    <div 
                      key={p.name}
                      onClick={() => handleSelectPokemon(id - 1)}
                      className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center cursor-pointer hover:bg-gray-50 active:bg-gray-100"
                    >
                      <img 
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`} 
                        className="w-20 h-20 object-contain pixelated"
                        loading="lazy"
                        alt={p.name}
                      />
                      <div className="text-xs font-bold text-gray-400">#{String(id).padStart(3, '0')}</div>
                      <div className="font-bold capitalize text-sm truncate w-full text-center">{p.name}</div>
                    </div>
                   );
                })}
                {loading && <div className="col-span-3 text-center py-4 text-gray-400">Loading...</div>}
            </div>
        ) : (
            <div className="space-y-2 pb-20">
                {filteredItems.map((item, i) => (
                    <div 
                        key={i} 
                        onClick={() => handleSelectItem(item.name)}
                        className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer"
                    >
                         <div className="capitalize font-bold text-sm">{item.name.replace(/-/g, ' ')}</div>
                         <ChevronRight size={16} className="text-gray-300" />
                    </div>
                ))}
                {loading && <div className="text-center py-4 text-gray-400">Loading items...</div>}
            </div>
        )}
      </div>

      {/* Item Details Modal */}
      {selectedItemDetails && (
          <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl relative">
                  <button onClick={() => setSelectedItemDetails(null)} className="absolute top-4 right-4"><X /></button>
                  <div className="flex flex-col items-center text-center">
                      <img src={selectedItemDetails.sprite} className="w-16 h-16 mb-4" />
                      <h2 className="text-xl font-bold capitalize mb-2">{selectedItemDetails.name}</h2>
                      <p className="text-sm text-gray-600 mb-4">{selectedItemDetails.description}</p>
                      <div className="bg-gray-100 px-4 py-2 rounded-full text-xs font-bold uppercase text-gray-500">
                          {selectedItemDetails.category}
                      </div>
                      {selectedItemDetails.cost > 0 && <div className="mt-2 text-blue-600 font-bold">${selectedItemDetails.cost}</div>}
                  </div>
              </div>
          </div>
      )}

      {/* Pokemon Details Modal */}
      {selectedPokemon && (
        <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white w-full h-[90%] sm:h-auto sm:max-w-md rounded-t-2xl sm:rounded-2xl overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
            
            <div className="relative h-40 p-4 flex justify-center items-center" style={{ backgroundColor: TYPE_COLORS[selectedPokemon.types[0]] || '#777' }}>
               <button 
                onClick={() => setSelectedPokemon(null)}
                className="absolute top-4 right-4 bg-white/20 p-1 rounded-full text-white hover:bg-white/40 z-10"
              >
                <X size={24} />
              </button>
              <img src={selectedPokemon.sprite} className="w-48 h-48 object-contain absolute -bottom-10 pixelated drop-shadow-lg z-0" />
              <div className="absolute top-4 left-4 text-white font-bold text-3xl opacity-20">#{selectedPokemon.id}</div>
            </div>

            <div className="pt-12 px-6 pb-6 overflow-y-auto flex-1 bg-white">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold capitalize text-gray-800">{selectedPokemon.name}</h2>
                <div className="flex gap-2 justify-center mt-2">
                  {selectedPokemon.types.map(t => <TypeBadge key={t} type={t} />)}
                </div>
              </div>

              {/* Evolution Chain */}
              {evolutionChain.length > 0 && (
                  <div className="mb-6">
                      <h3 className="font-bold text-gray-700 mb-3 text-sm">Evolution Chain</h3>
                      <div className="flex items-center justify-center gap-2 overflow-x-auto">
                          {evolutionChain.map((evo, idx) => (
                              <React.Fragment key={evo.name}>
                                  <div className={`text-xs font-bold capitalize px-2 py-1 rounded ${evo.name === selectedPokemon.name ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-500'}`}>
                                      {evo.name}
                                  </div>
                                  {idx < evolutionChain.length - 1 && <ChevronRight size={12} className="text-gray-300" />}
                              </React.Fragment>
                          ))}
                      </div>
                  </div>
              )}

              <div className="mb-6">
                <h3 className="font-bold text-gray-700 mb-3 text-sm">Base Stats</h3>
                <div className="h-40 w-full text-xs">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                            { name: 'HP', val: selectedPokemon.baseStats?.hp },
                            { name: 'ATK', val: selectedPokemon.baseStats?.atk },
                            { name: 'DEF', val: selectedPokemon.baseStats?.def },
                            { name: 'SPA', val: selectedPokemon.baseStats?.spa },
                            { name: 'SPD', val: selectedPokemon.baseStats?.spd },
                            { name: 'SPE', val: selectedPokemon.baseStats?.spe },
                        ]}>
                            <XAxis dataKey="name" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px' }} />
                            <Bar dataKey="val" fill={TYPE_COLORS[selectedPokemon.types[0]]} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
              </div>

              {/* Matchups */}
              <div className="mb-6">
                  <h3 className="font-bold text-gray-700 mb-3 text-sm">Type Matchups</h3>
                  {(() => {
                      const { weaknesses, resistances } = calculateWeaknesses(selectedPokemon.types);
                      return (
                          <div className="space-y-2">
                              {weaknesses.length > 0 && (
                                  <div className="flex flex-wrap gap-1 items-center">
                                      <span className="text-xs text-red-500 font-bold w-12">Weak:</span>
                                      {weaknesses.map(t => <TypeBadge key={t} type={t} />)}
                                  </div>
                              )}
                              {resistances.length > 0 && (
                                  <div className="flex flex-wrap gap-1 items-center">
                                      <span className="text-xs text-green-500 font-bold w-12">Resist:</span>
                                      {resistances.map(t => <TypeBadge key={t} type={t} />)}
                                  </div>
                              )}
                          </div>
                      );
                  })()}
              </div>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
