
import React, { useState } from 'react';
import { useStore } from '../store';
import { PokemonCard, Button, TypeBadge } from './Shared';
import { Trash2, Heart, X, BarChart2, Star, Box, Download, Edit3, Search, ChevronRight, Shield, Activity } from 'lucide-react';
import { Pokemon, Move, StatBlock, PokemonType } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TYPE_COLORS, ITEMS, NATURES, TYPE_CHART } from '../constants';
import { getPokemonMoves } from '../services/pokeapi';

export const Team = () => {
  const store = useStore();
  const [view, setView] = useState<'party' | 'box'>('party');
  const [selectedMon, setSelectedMon] = useState<Pokemon | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [editorTab, setEditorTab] = useState<'moves' | 'stats' | 'info'>('moves');
  const [availableMoves, setAvailableMoves] = useState<Move[]>([]);
  const [moveLoading, setMoveLoading] = useState(false);
  const [itemSearch, setItemSearch] = useState('');

  const handleMakeLead = () => {
      if (!selectedMon) return;
      const index = store.player.party.findIndex(p => p.uuid === selectedMon.uuid);
      if (index > 0) {
          store.swapPartyPositions(0, index);
          setSelectedMon(null);
          store.addLog(`${selectedMon.name} is now the team leader!`);
      }
  };

  const handleExport = () => {
      const exportText = store.player.party.map(p => {
          const itemText = p.heldItem ? ` @ ${ITEMS[p.heldItem].name}` : '';
          return `${p.name}${itemText}
Level: ${p.level}
Nature: ${p.nature ? p.nature.charAt(0).toUpperCase() + p.nature.slice(1) : 'Serious'}
EVs: ${p.evs.hp} HP / ${p.evs.atk} Atk / ${p.evs.def} Def / ${p.evs.spa} SpA / ${p.evs.spd} SpD / ${p.evs.spe} Spe
${p.moves.map(m => `- ${m.name}`).join('\n')}`;
      }).join('\n\n');
      
      navigator.clipboard.writeText(exportText);
      alert("Team exported to clipboard in Showdown format!");
  };

  const openEditor = async (pokemon: Pokemon) => {
      setEditMode(true);
      setMoveLoading(true);
      try {
          const moves = await getPokemonMoves(pokemon.id);
          setAvailableMoves(moves);
      } catch (e) {
          console.error(e);
      } finally {
          setMoveLoading(false);
      }
  };

  const learnMove = (move: Move) => {
      if (!selectedMon) return;
      if (selectedMon.moves.some(m => m.name === move.name)) return;
      
      let newMoves = [...selectedMon.moves];
      if (newMoves.length >= 4) {
          if(confirm(`Replace ${newMoves[0].name} with ${move.name}?`)) {
              newMoves[0] = move;
          } else {
              return;
          }
      } else {
          newMoves.push(move);
      }
      
      store.updatePokemon(selectedMon.uuid, { moves: newMoves });
      setSelectedMon({ ...selectedMon, moves: newMoves });
  };

  const forgetMove = (moveName: string) => {
      if (!selectedMon) return;
      if (selectedMon.moves.length <= 1) {
          alert("Pokemon must have at least one move!");
          return;
      }
      const newMoves = selectedMon.moves.filter(m => m.name !== moveName);
      store.updatePokemon(selectedMon.uuid, { moves: newMoves });
      setSelectedMon({ ...selectedMon, moves: newMoves });
  };

  const updateEV = (stat: keyof StatBlock, val: string) => {
      if (!selectedMon) return;
      const newValue = Math.min(252, Math.max(0, parseInt(val) || 0));
      const currentTotal = (Object.values(selectedMon.evs) as number[]).reduce((a, b) => a + b, 0);
      const diff = newValue - selectedMon.evs[stat];
      
      if (currentTotal + diff <= 510) {
          const newEvs = { ...selectedMon.evs, [stat]: newValue };
          store.updatePokemon(selectedMon.uuid, { evs: newEvs });
          setSelectedMon({ ...selectedMon, evs: newEvs });
      }
  };

  const updateNature = (nature: string) => {
      if (!selectedMon) return;
      store.updatePokemon(selectedMon.uuid, { nature });
      setSelectedMon({ ...selectedMon, nature });
  };

  const handleEquip = (itemId: string) => {
      if (!selectedMon) return;
      store.equipItem(selectedMon.uuid, itemId);
      setSelectedMon({ ...selectedMon, heldItem: itemId });
      setItemSearch('');
  };

  const handleUnequip = () => {
      if (!selectedMon) return;
      store.unequipItem(selectedMon.uuid);
      setSelectedMon({ ...selectedMon, heldItem: undefined });
  };

  const EditorView = () => (
      <div className="fixed inset-0 bg-gray-100 z-[60] flex flex-col animate-in slide-in-from-right">
          <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center shadow-sm">
              <h3 className="font-bold text-lg">Team Builder: {selectedMon?.name}</h3>
              <button onClick={() => setEditMode(false)} className="bg-gray-100 p-2 rounded-full"><X size={20}/></button>
          </div>
          
          <div className="flex border-b border-gray-200 bg-white">
              <button onClick={() => setEditorTab('moves')} className={`flex-1 py-3 text-sm font-bold border-b-2 ${editorTab === 'moves' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}`}>Moves</button>
              <button onClick={() => setEditorTab('stats')} className={`flex-1 py-3 text-sm font-bold border-b-2 ${editorTab === 'stats' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}`}>Stats & EVs</button>
              <button onClick={() => setEditorTab('info')} className={`flex-1 py-3 text-sm font-bold border-b-2 ${editorTab === 'info' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}`}>Items & Info</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
              
              {editorTab === 'moves' && (
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                      <h4 className="font-bold text-gray-700 mb-3 flex justify-between">
                          <span>Current Moves ({selectedMon?.moves.length}/4)</span>
                      </h4>
                      <div className="space-y-2 mb-4">
                          {selectedMon?.moves.map(m => (
                              <div key={m.name} onClick={() => forgetMove(m.name)} className="bg-gray-50 p-2 rounded border border-gray-200 flex justify-between items-center cursor-pointer hover:bg-red-50 hover:border-red-200 group">
                                  <div>
                                      <div className="font-bold text-sm">{m.name}</div>
                                      <div className="text-xs text-gray-500">{m.type} / Pow: {m.power}</div>
                                  </div>
                                  <Trash2 size={16} className="text-gray-300 group-hover:text-red-500" />
                              </div>
                          ))}
                      </div>

                      <div className="border-t border-gray-100 pt-4">
                          <h5 className="text-xs font-bold uppercase text-gray-400 mb-2">Learn New Move</h5>
                          {moveLoading ? (
                              <div className="text-center text-sm py-4">Loading move pool...</div>
                          ) : (
                              <div className="h-60 overflow-y-auto border border-gray-200 rounded-lg">
                                  {availableMoves.map(m => (
                                      <button 
                                        key={m.name} 
                                        onClick={() => learnMove(m)}
                                        disabled={selectedMon?.moves.some(known => known.name === m.name)}
                                        className="w-full text-left p-2 border-b border-gray-100 hover:bg-blue-50 text-sm flex justify-between items-center disabled:opacity-50 disabled:bg-gray-50"
                                      >
                                          <span>{m.name}</span>
                                          <TypeBadge type={m.type} />
                                      </button>
                                  ))}
                              </div>
                          )}
                      </div>
                  </div>
              )}

              {editorTab === 'stats' && selectedMon && (
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 space-y-6">
                      <div className="text-center">
                          <div className="text-3xl font-bold text-gray-800">{(Object.values(selectedMon.evs) as number[]).reduce((a,b)=>a+b, 0)} / 510</div>
                          <div className="text-xs text-gray-400 uppercase font-bold">Total EVs Used</div>
                      </div>

                      {Object.keys(selectedMon.evs).map((statKey) => {
                          const key = statKey as keyof StatBlock;
                          return (
                              <div key={key}>
                                  <div className="flex justify-between text-sm mb-1">
                                      <span className="font-bold uppercase text-gray-500">{key}</span>
                                      <span className="font-mono font-bold">{selectedMon.evs[key]}</span>
                                  </div>
                                  <input 
                                    type="range" 
                                    min="0" 
                                    max="252" 
                                    value={selectedMon.evs[key]} 
                                    onChange={(e) => updateEV(key, e.target.value)}
                                    className="w-full accent-blue-600"
                                  />
                              </div>
                          )
                      })}
                  </div>
              )}

              {editorTab === 'info' && selectedMon && (
                  <div className="space-y-4">
                      {/* Nature */}
                      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                          <h4 className="font-bold text-gray-700 mb-3">Nature</h4>
                          <select 
                            value={selectedMon.nature} 
                            onChange={(e) => updateNature(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded bg-white capitalize"
                          >
                              {Object.keys(NATURES).map(n => (
                                  <option key={n} value={n}>{n}</option>
                              ))}
                          </select>
                      </div>

                      {/* Item */}
                      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                          <h4 className="font-bold text-gray-700 mb-3">Held Item</h4>
                          {selectedMon.heldItem ? (
                              <div className="flex items-center justify-between bg-blue-50 p-3 rounded border border-blue-200 mb-4">
                                  <div className="font-bold text-blue-800">{ITEMS[selectedMon.heldItem].name}</div>
                                  <button onClick={handleUnequip} className="text-red-500 text-xs font-bold hover:underline">Unequip</button>
                              </div>
                          ) : (
                              <div className="text-sm text-gray-400 mb-4 italic">No item held</div>
                          )}

                          <div className="relative">
                              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                              <input 
                                type="text" 
                                placeholder="Search bag for items..."
                                value={itemSearch}
                                onChange={(e) => setItemSearch(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                              />
                          </div>
                          
                          <div className="mt-2 max-h-40 overflow-y-auto space-y-1">
                              {Object.entries(store.player.items)
                                .filter(([k, qty]) => (qty as number) > 0 && ITEMS[k].name.toLowerCase().includes(itemSearch.toLowerCase()))
                                .map(([k, qty]) => (
                                    <button 
                                        key={k} 
                                        onClick={() => handleEquip(k)}
                                        className="w-full text-left text-sm p-2 hover:bg-gray-50 rounded flex justify-between"
                                    >
                                        <span>{ITEMS[k].name}</span>
                                        <span className="text-gray-400">x{qty}</span>
                                    </button>
                                ))
                              }
                          </div>
                      </div>
                  </div>
              )}
          </div>
      </div>
  );

  const AnalysisView = () => {
      const types = Object.keys(TYPE_CHART) as PokemonType[];
      const analysis = types.map(type => {
          let weak = 0;
          let resist = 0;
          let immune = 0;
          store.player.party.forEach(p => {
              let mult = 1;
              p.types.forEach(defType => {
                  mult *= (TYPE_CHART[type][defType] ?? 1);
              });
              if (mult >= 2) weak++;
              if (mult <= 0.5 && mult > 0) resist++;
              if (mult === 0) immune++;
          });
          return { type, weak, resist, immune };
      });

      return (
          <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-sm rounded-2xl h-[80%] flex flex-col shadow-2xl animate-in zoom-in">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-2xl">
                      <h3 className="font-bold text-lg flex items-center gap-2"><Activity size={20}/> Team Coverage</h3>
                      <button onClick={() => setShowAnalysis(false)} className="bg-white p-1 rounded-full shadow-sm"><X size={20}/></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                      <div className="grid grid-cols-4 gap-2 text-xs font-bold text-gray-500 mb-2 text-center uppercase">
                          <div className="text-left">Type</div>
                          <div className="text-red-500">Weak</div>
                          <div className="text-green-500">Resist</div>
                          <div className="text-gray-800">Immune</div>
                      </div>
                      <div className="space-y-2">
                          {analysis.map(row => (
                              <div key={row.type} className="grid grid-cols-4 gap-2 items-center text-center p-2 rounded bg-gray-50 border border-gray-100">
                                  <div className="text-left"><TypeBadge type={row.type} /></div>
                                  <div className={`font-bold ${row.weak > 2 ? 'text-red-600 bg-red-100 rounded' : row.weak > 0 ? 'text-red-500' : 'text-gray-300'}`}>{row.weak || '-'}</div>
                                  <div className={`font-bold ${row.resist > 2 ? 'text-green-600 bg-green-100 rounded' : row.resist > 0 ? 'text-green-500' : 'text-gray-300'}`}>{row.resist || '-'}</div>
                                  <div className={`font-bold ${row.immune > 0 ? 'text-gray-800 bg-gray-200 rounded' : 'text-gray-300'}`}>{row.immune || '-'}</div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      );
  };

  const PartyView = () => (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {store.player.party.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            Your party is empty.
          </div>
        ) : (
          store.player.party.map((p, index) => (
            <div 
                key={p.uuid} 
                onClick={() => setSelectedMon(p)}
                className={`flex gap-4 bg-white p-3 rounded-xl shadow-sm border items-center cursor-pointer hover:shadow-md transition-all ${index === 0 ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50/50' : 'border-gray-100'}`}
            >
              <div className="font-bold text-gray-300 text-2xl w-8 text-center flex flex-col items-center">
                  {index + 1}
                  {index === 0 && <Star size={12} className="text-yellow-500 fill-yellow-500" />}
              </div>
              <div className="w-20">
                 <PokemonCard pokemon={p} />
              </div>
              <div className="flex-1">
                 <div className="flex justify-between items-center">
                     <h3 className="font-bold capitalize">{p.name}</h3>
                     <span className="text-xs bg-gray-100 px-2 py-1 rounded">Lv.{p.level}</span>
                 </div>
                 <div className="mt-2 text-xs space-y-1">
                     <div className="flex justify-between text-gray-500">
                         <span>HP</span>
                         <span>{Math.floor(p.currentHp)}/{p.maxHp}</span>
                     </div>
                     <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500" style={{width: `${(p.currentHp / p.maxHp) * 100}%`}}></div>
                     </div>
                 </div>
                 {p.heldItem && (
                     <div className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                         <Shield size={10} /> {ITEMS[p.heldItem].name}
                     </div>
                 )}
              </div>
              <ChevronRight className="text-gray-300" />
            </div>
          ))
        )}
        <div className="flex gap-2 mt-4">
             <Button onClick={handleExport} variant="secondary" className="flex-1 flex items-center justify-center gap-2 text-xs bg-gray-200 text-gray-800">
                 <Download size={14}/> Export
             </Button>
             <Button onClick={() => setShowAnalysis(true)} variant="secondary" className="flex-1 flex items-center justify-center gap-2 text-xs bg-purple-100 text-purple-800">
                 <Activity size={14}/> Coverage
             </Button>
        </div>
    </div>
  );

  const BoxView = () => (
      <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-3 gap-3">
              {store.player.box.map(p => (
                  <div key={p.uuid} onClick={() => setSelectedMon(p)} className="relative">
                      <PokemonCard pokemon={p} />
                  </div>
              ))}
              {store.player.box.length === 0 && (
                  <div className="col-span-3 text-center text-gray-400 py-10">PC Box is empty</div>
              )}
          </div>
      </div>
  );

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {editMode && <EditorView />}
      {showAnalysis && <AnalysisView />}
      
      <div className="p-2 bg-white shadow-sm">
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
              <button 
                onClick={() => setView('party')}
                className={`flex-1 py-2 rounded-md text-sm font-bold flex items-center justify-center gap-2 transition-all ${view === 'party' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
              >
                  Party ({store.player.party.length})
              </button>
              <button 
                onClick={() => setView('box')}
                className={`flex-1 py-2 rounded-md text-sm font-bold flex items-center justify-center gap-2 transition-all ${view === 'box' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
              >
                  <Box size={16}/> PC Box ({store.player.box.length})
              </button>
          </div>
      </div>

      {view === 'party' ? <PartyView /> : <BoxView />}

      {/* Bag / Money Summary */}
      <div className="p-4 bg-white border-t border-gray-200 grid grid-cols-2 gap-4 text-sm pb-8">
         <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 flex justify-between items-center">
             <span className="font-bold text-yellow-800">Money</span>
             <span className="font-mono">${store.player.money}</span>
         </div>
         <Button variant="success" onClick={() => store.healParty()} className="flex items-center justify-center gap-1 text-xs">
             <Heart size={14} fill="currentColor" /> Heal Party
        </Button>
      </div>

      {/* Summary / Action Modal */}
      {selectedMon && (
          <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
              <div className="bg-white w-full h-[90%] sm:h-auto sm:max-w-md rounded-t-2xl sm:rounded-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom shadow-2xl">
                  <div className="p-4 bg-gray-900 text-white flex justify-between items-center">
                      <h3 className="font-bold text-lg">Summary</h3>
                      <button onClick={() => setSelectedMon(null)}><X /></button>
                  </div>
                  
                  <div className="p-4 overflow-y-auto flex-1">
                      <div className="flex gap-4 items-center mb-6">
                          <img src={selectedMon.sprite} className="w-24 h-24 bg-gray-100 rounded-full object-contain" />
                          <div>
                              <div className="text-2xl font-bold capitalize">{selectedMon.name}</div>
                              <div className="flex gap-1 mt-1">
                                  {selectedMon.types.map(t => <TypeBadge key={t} type={t} />)}
                              </div>
                              <div className="text-sm text-gray-500 mt-2">Level {selectedMon.level}</div>
                          </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="grid grid-cols-2 gap-3 mb-6">
                          {view === 'party' && (
                              <>
                                <Button 
                                    onClick={() => openEditor(selectedMon)}
                                    className="col-span-2 bg-yellow-400 text-blue-900 font-bold flex justify-center gap-2 hover:bg-yellow-300"
                                >
                                    <Edit3 size={16} /> Edit Team (Builder)
                                </Button>
                                {store.player.party[0].uuid !== selectedMon.uuid && (
                                    <Button onClick={handleMakeLead} className="bg-blue-600 text-white font-bold flex justify-center gap-2 text-xs">
                                        <Star size={16} /> Lead
                                    </Button>
                                )}
                                <Button 
                                    onClick={() => { store.depositPokemon(selectedMon.uuid); setSelectedMon(null); }} 
                                    variant="secondary"
                                    className={store.player.party[0].uuid === selectedMon.uuid ? "col-span-2 text-xs" : "text-xs"}
                                    disabled={store.player.party.length <= 1}
                                >
                                    To Box
                                </Button>
                              </>
                          )}
                          
                          {view === 'box' && (
                             <>
                                <Button 
                                    onClick={() => { store.withdrawPokemon(selectedMon.uuid); setSelectedMon(null); }} 
                                    className="col-span-2 bg-green-600 text-white font-bold"
                                    disabled={store.player.party.length >= 6}
                                >
                                    Withdraw to Party
                                </Button>
                                <Button 
                                    onClick={() => { 
                                        if(confirm(`Release ${selectedMon.name}? This cannot be undone.`)) {
                                            store.releasePokemon(selectedMon.uuid); 
                                            setSelectedMon(null); 
                                        }
                                    }} 
                                    variant="secondary"
                                    className="col-span-2 bg-red-100 text-red-600"
                                >
                                    Release
                                </Button>
                             </>
                          )}
                      </div>

                      <div className="mb-6">
                          <h4 className="font-bold mb-2 flex items-center gap-2 text-sm text-gray-600 uppercase tracking-wide">Stats (IVs/EVs)</h4>
                          <div className="h-32 w-full text-xs">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={[
                                    { name: 'ATK', val: selectedMon.stats.atk },
                                    { name: 'DEF', val: selectedMon.stats.def },
                                    { name: 'SPA', val: selectedMon.stats.spa },
                                    { name: 'SPD', val: selectedMon.stats.spd },
                                    { name: 'SPE', val: selectedMon.stats.spe },
                                ]}>
                                    <XAxis dataKey="name" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px' }} />
                                    <Bar dataKey="val" fill={TYPE_COLORS[selectedMon.types[0]]} radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                          </div>
                      </div>

                      <div>
                          <h4 className="font-bold mb-2 text-sm text-gray-600 uppercase tracking-wide">Moves</h4>
                          <div className="grid grid-cols-1 gap-2">
                              {selectedMon.moves.map((m, i) => (
                                  <div key={i} className="bg-gray-50 p-2 rounded flex justify-between items-center border border-gray-100">
                                      <div>
                                          <div className="font-bold text-sm">{m.name}</div>
                                          <div className="text-xs text-gray-500">{m.description || 'No description'}</div>
                                      </div>
                                      <div className="text-right">
                                          <TypeBadge type={m.type} />
                                          <div className="text-xs font-mono mt-1 text-gray-500">Pow: {m.power}</div>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
