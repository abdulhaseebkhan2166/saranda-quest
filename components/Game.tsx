
import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { generateWildPokemon, getPokemonDetails, checkEvolution, evolvePokemonData } from '../services/pokeapi';
import { Button, TypeBadge, PokemonCard } from './Shared';
import { Move, Pokemon, Gym, PokemonType } from '../types';
import { getEffectiveness, TYPE_COLORS, REGIONS } from '../constants';
import { MapPin, Trophy, Navigation, Footprints, Heart, Repeat, Crown, Sparkles } from 'lucide-react';

const BattleView = ({ onBattleEnd }: { onBattleEnd: () => void }) => {
  const store = useStore();
  const fighter = store.player.party[0]; 
  const opponent = store.game.opponent!;
  const [selectedMove, setSelectedMove] = useState<Move | null>(null);
  const [showSwitchMenu, setShowSwitchMenu] = useState(false);

  useEffect(() => {
     if (!fighter || fighter.currentHp <= 0) {
        const hasAlive = store.player.party.some(p => p.currentHp > 0);
        if (hasAlive && !showSwitchMenu) {
            setShowSwitchMenu(true);
        }
     }
  }, [fighter, store.player.party]);

  const handleSwitch = (index: number) => {
      if (index === 0) return; 
      if (store.player.party[index].currentHp <= 0) return; 

      store.addLog(`Come back ${fighter.name}! Go ${store.player.party[index].name}!`);
      store.swapPartyPositions(0, index);
      setShowSwitchMenu(false);
      
      setTimeout(() => {
          if (opponent && opponent.currentHp > 0) {
            executeOpponentTurn(store.player.party[index]);
          }
      }, 1000);
  };

  const calculateDamage = (attacker: Pokemon, defender: Pokemon, move: Move) => {
    const effect = getEffectiveness(move.type, defender.types);
    const stab = attacker.types.includes(move.type) ? 1.5 : 1;
    const random = (Math.floor(Math.random() * 16) + 85) / 100;
    
    // Held Item modifiers
    let atkMod = 1;
    if (move.category === 'physical' && attacker.heldItem === 'choiceband') atkMod = 1.5;
    if (move.category === 'special' && attacker.heldItem === 'choicespecs') atkMod = 1.5;
    if (attacker.heldItem === 'lifeorb') atkMod = 1.3;

    const levelFactor = (2 * attacker.level) / 5 + 2;
    const statRatio = move.category === 'physical' 
        ? (attacker.stats.atk * atkMod) / defender.stats.def 
        : (attacker.stats.spa * atkMod) / defender.stats.spd;
    
    let dmg = ((levelFactor * move.power * statRatio) / 50 + 2) * effect * stab * random;
    return Math.floor(dmg);
  };

  const handleAttack = (move: Move) => {
    store.addLog(`${fighter.name} used ${move.name}!`);
    
    let damage = calculateDamage(fighter, opponent, move);
    store.addLog(`It dealt ${damage} damage!`);
    
    const newOppHp = Math.max(0, opponent.currentHp - damage);
    store.setOpponent({ ...opponent, currentHp: newOppHp });

    if (newOppHp <= 0) {
      setTimeout(() => {
        handleVictory(opponent);
      }, 1000);
      return;
    }

    setTimeout(() => {
        executeOpponentTurn(fighter);
    }, 1000);
  };

  const handleVictory = (defeated: Pokemon) => {
        store.setBattleState('victory');
        grantRewards(defeated, 'defeated');
        onBattleEnd();
  };

  // Centralized Reward Logic for Defeat AND Catch
  const grantRewards = (pokemon: Pokemon, reason: 'caught' | 'defeated') => {
      // 1. XP
      const baseExp = pokemon.level * 20; 
      const bonus = store.game.activeRoute === 'gym' ? 500 : store.game.activeRoute === 'league' ? 1000 : 100;
      const totalExp = baseExp + bonus;
      store.gainExp(totalExp);
      
      // 2. Money
      // Base money for wild encounters, higher for trainers
      let moneyReward = pokemon.level * 10;
      if (store.game.activeRoute === 'gym' || store.game.activeRoute === 'league') {
          moneyReward = pokemon.level * 30; // Trainers give more money
          if (store.game.activeRoute === 'league') moneyReward += 2000;
      }
      store.earnMoney(moneyReward);

      if (reason === 'caught') {
          store.addLog(`Gotcha! Caught ${pokemon.name}! (+${totalExp} XP, +$${moneyReward})`);
      } else {
          store.addLog(`${pokemon.name} fainted! (+${totalExp} XP, +$${moneyReward})`);
      }

      // 3. Item Drops
      handleDrops(pokemon.types);
  };

  const handleDrops = (types: PokemonType[]) => {
      const dropChance = 0.5; // 50% chance
      if (Math.random() < dropChance) {
          const rand = Math.random();
          let item = 'oranberry';
          
          // Type specific drops
          if (types.includes('fire')) item = rand > 0.7 ? 'firestone' : 'charcoal';
          else if (types.includes('water')) item = rand > 0.7 ? 'waterstone' : 'mysticwater'; // mysticwater fallback to generic
          else if (types.includes('electric')) item = rand > 0.7 ? 'thunderstone' : 'magnet';
          else if (types.includes('grass')) item = rand > 0.7 ? 'leafstone' : 'miracleseed';
          else if (types.includes('ice')) item = 'icestone';
          else if (types.includes('fighting')) item = 'protein';
          else if (types.includes('psychic')) item = 'calcium';
          
          // General pool if no type match or RNG fallback
          if (!item || item === 'oranberry') {
               const pool = ['potion', 'superpotion', 'pokeball', 'greatball', 'xattack', 'xspeed', 'sitrusberry', 'lumberry', 'iron', 'zinc', 'hpup'];
               item = pool[Math.floor(Math.random() * pool.length)];
          }

          // Ensure item exists in DB
          // @ts-ignore
          if (!store.player.items[item] && store.player.items[item] !== 0) { 
              // Basic check, store.addItem handles key existence usually, but let's be safe
          }

          store.addItem(item, 1);
          store.addLog(`Wild ${opponent.name} dropped a ${item}!`);
      }
  };

  const executeOpponentTurn = (target: Pokemon) => {
      if (!opponent || opponent.currentHp <= 0) return;
      
      const enemyMove = opponent.moves[Math.floor(Math.random() * opponent.moves.length)];
      store.addLog(`${opponent.name} used ${enemyMove.name}!`);
      
      const dmgToPlayer = calculateDamage(opponent, target, enemyMove);
      store.addLog(`It dealt ${dmgToPlayer} damage to ${target.name}!`);
      
      const newPlayerHp = Math.max(0, target.currentHp - dmgToPlayer);
      store.updatePokemon(target.uuid, { currentHp: newPlayerHp });

      if (newPlayerHp <= 0) {
        store.faintPokemon(target.uuid);
        store.addLog(`${target.name} fainted!`);
        if (!store.player.party.some(p => p.currentHp > 0)) {
            setTimeout(() => {
                store.setBattleState('defeat');
                store.healParty(); 
                store.earnMoney(-100);
                setTimeout(() => store.setBattleState('idle'), 2000);
            }, 1000);
        } else {
            setShowSwitchMenu(true);
        }
      } else {
          // END OF TURN EFFECTS
          handleEndTurnEffects(target);
      }
  };

  const handleEndTurnEffects = (playerMon: Pokemon) => {
      // 1. Leftovers
      if (playerMon.heldItem === 'leftovers' && playerMon.currentHp > 0 && playerMon.currentHp < playerMon.maxHp) {
          const heal = Math.floor(playerMon.maxHp / 16);
          store.updatePokemon(playerMon.uuid, { currentHp: Math.min(playerMon.maxHp, playerMon.currentHp + heal) });
          store.addLog(`${playerMon.name} restored HP with Leftovers!`);
      }

      // 2. Status Damage (Burn/Poison)
      if (playerMon.status === 'burn' || playerMon.status === 'poison') {
          const dmg = Math.floor(playerMon.maxHp / 8);
          const nextHp = Math.max(0, playerMon.currentHp - dmg);
          store.updatePokemon(playerMon.uuid, { currentHp: nextHp });
          store.addLog(`${playerMon.name} is hurt by its ${playerMon.status}!`);
          if(nextHp === 0) store.faintPokemon(playerMon.uuid);
      }
  };

  const handleCatch = () => {
    if (store.game.activeRoute === 'gym' || store.game.activeRoute === 'league') {
        store.addLog("You can't catch a trainer's Pokémon!");
        return;
    }

    const chance = (1 - (opponent.currentHp / opponent.maxHp)) * 0.8 + 0.1; 
    store.addLog(`Threw a Pokéball...`);
    store.useItem('pokeball');

    if (Math.random() < chance) {
      setTimeout(() => {
        store.addToParty({ ...opponent, uuid: crypto.randomUUID(), currentHp: opponent.currentHp }); 
        grantRewards(opponent, 'caught'); // Trigger XP, Money, Drops
        store.setBattleState('caught');
        onBattleEnd();
      }, 1500);
    } else {
      setTimeout(() => {
        store.addLog(`Darn! The Pokémon broke free!`);
        executeOpponentTurn(fighter);
      }, 1500);
    }
  };

  const currentLevelExpBase = Math.pow(fighter.level, 3);
  const nextLevelExpBase = Math.pow(fighter.level + 1, 3);
  const expProgress = fighter.exp - currentLevelExpBase;
  const expNeeded = nextLevelExpBase - currentLevelExpBase;
  const expPercent = Math.min(100, (expProgress / expNeeded) * 100);

  if (!fighter) return <div>Loading...</div>;

  return (
    <div className="flex flex-col h-full bg-slate-800 text-white relative">
      <div className="flex-1 relative overflow-hidden bg-gradient-to-b from-blue-400 to-green-300">
        
        {/* Opponent HUD */}
        <div className="absolute top-10 right-4 p-3 bg-white/90 text-gray-800 rounded-xl shadow-lg w-40">
          <div className="flex justify-between font-bold text-sm">
            <span>{opponent.name}</span>
            <span>Lv.{opponent.level}</span>
          </div>
          <div className="w-full bg-gray-300 h-2 rounded-full mt-1 overflow-hidden">
            <div 
                className="bg-red-500 h-full transition-all duration-500" 
                style={{width: `${(opponent.currentHp / opponent.maxHp) * 100}%`}}
            />
          </div>
        </div>
        <img src={opponent.sprite} className="absolute top-24 right-10 w-32 h-32 object-contain animate-bounce-slow pixelated" />

        {/* Player HUD */}
        <div className="absolute bottom-32 left-4 p-3 bg-white/90 text-gray-800 rounded-xl shadow-lg w-48 z-10">
          <div className="flex justify-between font-bold text-sm">
            <span>{fighter.name}</span>
            <span>Lv.{fighter.level}</span>
          </div>
          <div className="text-xs text-right mb-1">{fighter.currentHp}/{fighter.maxHp} HP</div>
          <div className="w-full bg-gray-300 h-2 rounded-full overflow-hidden mb-1">
            <div 
                className={`h-full transition-all duration-500 ${fighter.currentHp < fighter.maxHp*0.2 ? 'bg-red-500' : 'bg-green-500'}`} 
                style={{width: `${(fighter.currentHp / fighter.maxHp) * 100}%`}}
            />
          </div>
          <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
             <div className="bg-blue-400 h-full transition-all duration-500" style={{width: `${expPercent}%`}}></div>
          </div>
        </div>
        <img src={fighter.sprite} className="absolute bottom-4 left-10 w-40 h-40 object-contain pixelated scale-x-[-1]" />
      </div>

      <div className="h-20 bg-black/80 px-4 py-2 overflow-y-auto text-xs font-mono text-green-400 border-t border-white/10">
        {store.game.log.slice(-3).map((l, i) => <div key={i}>{l}</div>)}
      </div>

      <div className="bg-white text-gray-800 p-4 grid grid-cols-2 gap-3 rounded-t-xl z-20 pb-8">
        {selectedMove ? (
           <>
             <div className="col-span-2 text-center font-bold mb-1">Use {selectedMove.name}?</div>
             <Button variant="secondary" onClick={() => setSelectedMove(null)}>Back</Button>
             <Button variant="primary" onClick={() => { handleAttack(selectedMove); setSelectedMove(null); }}>Attack!</Button>
           </> 
        ) : (
            <>
                <div className="col-span-2 grid grid-cols-2 gap-2 h-24 overflow-y-auto">
                    {fighter.moves.map((m, i) => (
                        <button key={i} onClick={() => setSelectedMove(m)} className="p-2 rounded border border-gray-200 bg-gray-50 text-left text-sm hover:bg-gray-100">
                            <span className="font-bold block">{m.name}</span>
                            <span className="text-[10px] text-gray-500 flex justify-between">
                                <span>{m.type}</span>
                                <span>{m.power > 0 ? `Pow ${m.power}` : '-'}</span>
                            </span>
                        </button>
                    ))}
                </div>
                <div className="col-span-2 grid grid-cols-3 gap-2">
                    <Button variant="secondary" className="bg-yellow-100 text-yellow-800" onClick={handleCatch}>Bag</Button>
                    <Button variant="secondary" className="bg-purple-100 text-purple-800" onClick={() => setShowSwitchMenu(true)}>Switch</Button>
                    <Button variant="secondary" onClick={() => store.setBattleState('idle')}>Run</Button>
                </div>
            </>
        )}
      </div>

      {showSwitchMenu && (
          <div className="absolute inset-0 bg-black/80 z-50 p-4 flex flex-col justify-center">
              <h2 className="text-white font-bold text-center mb-4">Switch Pokémon</h2>
              <div className="space-y-2 overflow-y-auto max-h-[60%]">
                  {store.player.party.map((p, idx) => (
                      <div 
                        key={p.uuid} 
                        onClick={() => handleSwitch(idx)}
                        className={`bg-white text-gray-800 p-3 rounded-lg flex items-center justify-between ${idx === 0 ? 'opacity-50' : 'cursor-pointer hover:bg-gray-100'} ${p.currentHp <= 0 ? 'grayscale opacity-60' : ''}`}
                      >
                          <div className="flex items-center gap-2">
                              <img src={p.sprite} className="w-10 h-10" />
                              <div>
                                  <div className="font-bold">{p.name}</div>
                                  <div className="text-xs">Lv.{p.level} • {p.currentHp}/{p.maxHp} HP</div>
                              </div>
                          </div>
                          {idx === 0 && <span className="text-xs font-bold text-blue-500">Active</span>}
                      </div>
                  ))}
              </div>
              <Button className="mt-4" variant="secondary" onClick={() => setShowSwitchMenu(false)}>Cancel</Button>
          </div>
      )}
    </div>
  );
};

export const Game = () => {
  const store = useStore();
  const { battleState, activeRegion, activeRoute, activeGymId } = store.game;
  const [evolvingPokemon, setEvolvingPokemon] = useState<{ original: Pokemon, targetName: string, newId: number } | null>(null);
  const [evolutionPending, setEvolutionPending] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
        store.tickRegen();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleBattleEnd = () => {
      // Check for evolution in a moment to let XP animation finish mentally
      setTimeout(() => {
          checkPartyForEvolution();
      }, 1000);
  };

  const checkPartyForEvolution = async () => {
      // Iterate through party and check if anyone can evolve
      for (const p of store.player.party) {
          const evo = await checkEvolution(p);
          if (evo) {
              setEvolvingPokemon({ original: p, targetName: evo.newSpeciesName, newId: evo.newId });
              setEvolutionPending(true);
              return; // Handle one at a time
          }
      }
  };

  const confirmEvolution = async () => {
      if (!evolvingPokemon) return;
      
      try {
          // Perform evolution
          const newForm = await evolvePokemonData(evolvingPokemon.original, evolvingPokemon.newId);
          store.evolvePokemon(evolvingPokemon.original.uuid, newForm);
          store.addLog(`${evolvingPokemon.original.name} evolved into ${newForm.name}!`);
      } catch (e) {
          console.error("Evolution error", e);
      } finally {
          setEvolutionPending(false);
          setEvolvingPokemon(null);
          // Check if anyone else needs to evolve
          setTimeout(checkPartyForEvolution, 500);
      }
  };

  const currentRegion = REGIONS.find(r => r.id === activeRegion) || REGIONS[0];
  const gymData = currentRegion.gyms.find(g => g.id === activeGymId);

  const handleSearch = async () => {
    store.setBattleState('searching');
    store.clearLog();
    
    setTimeout(async () => {
        try {
            if (Math.random() > 0.2) {
                const routeNum = typeof activeRoute === 'number' ? activeRoute : 1;
                const baseLevel = (routeNum % 25) + ((currentRegion.generation - 1) * 8) + 3;
                const level = Math.min(95, Math.floor(baseLevel + Math.random() * 5));

                const wildMon = await generateWildPokemon(level, currentRegion.idRange); 
                store.setOpponent(wildMon);
                store.setBattleState('battle');
                store.addLog(`A wild ${wildMon.name} appeared!`);
            } else {
                store.setBattleState('idle');
                store.addLog("Nothing found...");
            }
        } catch (e) {
            console.error("Encounter error", e);
            store.setBattleState('idle');
            store.addLog("Failed to find Pokémon (Network Error)");
        }
    }, 1000);
  };

  const startGymBattle = async (gym: Gym) => {
      store.setBattleState('searching');
      store.setActiveGym(gym.id);
      
      try {
          const bossId = gym.pokemon[Math.floor(Math.random() * gym.pokemon.length)];
          const boss = await generateWildPokemon(gym.requiredLevel + 2, currentRegion.idRange, bossId);
          boss.maxHp = Math.floor(boss.maxHp * 1.5);
          boss.currentHp = boss.maxHp;
          boss.name = "Leader's " + boss.name;
          
          setTimeout(() => {
              store.setOpponent(boss);
              store.setBattleState('battle');
              store.addLog(`Gym Leader ${gym.leaderName} sent out ${boss.name}!`);
          }, 1500);
      } catch (e) {
          store.setBattleState('idle');
          store.addLog("Gym is currently closed (Network Error)");
      }
  };

  const startLeagueBattle = async () => {
      store.setBattleState('searching');
      store.setRoute('league');
      try {
          const bossId = Math.floor(Math.random() * 100) + 1; 
          const boss = await generateWildPokemon(75, [1, 1025], bossId); 
          boss.maxHp = Math.floor(boss.maxHp * 2); 
          boss.currentHp = boss.maxHp;
          boss.name = "Elite Four's " + boss.name;
          boss.heldItem = 'sitrusberry'; 
          
          setTimeout(() => {
              store.setOpponent(boss);
              store.setBattleState('battle');
              store.addLog(`Elite Four member challenged you!`);
          }, 1500);
      } catch (e) {
          store.setBattleState('idle');
      }
  };

  const handleGetStarter = async () => {
      try {
         const starter = await getPokemonDetails(Math.floor(Math.random() * 9) + 1); 
         starter.uuid = crypto.randomUUID();
         store.addToParty(starter);
      } catch (e) {
         alert("Could not fetch starter. Please check connection.");
      }
  };

  if (battleState === 'battle') return <BattleView onBattleEnd={handleBattleEnd} />;
  
  if (battleState === 'searching') return <div className="flex flex-col items-center justify-center h-full bg-green-50 animate-pulse"><div className="text-4xl mb-4">🌿</div><div className="text-green-800 font-bold">Searching...</div></div>;
  
  if (battleState === 'victory' || battleState === 'caught') {
     return (
        <div className="flex flex-col items-center justify-center h-full bg-yellow-50 p-8 space-y-6">
            <div className="text-6xl animate-bounce">🏆</div>
            <h2 className="text-2xl font-bold text-yellow-800">{battleState === 'caught' ? 'Gotcha!' : 'Victory!'}</h2>
            <Button onClick={() => store.setBattleState('idle')}>Continue</Button>
        </div>
     );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
        <div className="bg-white border-b border-gray-200 p-2 shadow-sm">
            <div className="flex overflow-x-auto gap-2 no-scrollbar pb-2">
                {REGIONS.map(r => (
                    <button 
                        key={r.id}
                        onClick={() => store.setRegion(r.id)}
                        className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${activeRegion === r.id ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                        {r.name}
                    </button>
                ))}
            </div>
            <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm font-bold text-gray-700">
                    <MapPin size={16} />
                    {activeRoute === 'gym' ? (gymData ? gymData.name : 'Gym') : activeRoute === 'league' ? 'Pokémon League' : `Route ${activeRoute}`}
                </div>
                <div className="flex gap-1 overflow-x-auto max-w-[150px] no-scrollbar">
                    {currentRegion.routes.map(rt => (
                        <button key={rt} onClick={() => store.setRoute(rt)} className={`min-w-[24px] h-6 flex items-center justify-center rounded text-[10px] shrink-0 ${activeRoute === rt ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                            {rt}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        <div className="flex-1 p-4 relative overflow-y-auto">
             <div className="mb-6">
                 <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Activities</h3>
                 <div className="grid grid-cols-2 gap-4">
                     <button 
                        onClick={handleSearch}
                        className="bg-green-100 p-4 rounded-xl border border-green-200 shadow-sm flex flex-col items-center gap-2 active:scale-95 transition-transform"
                     >
                         <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white">
                             <Footprints size={24} />
                         </div>
                         <div className="text-green-800 font-bold text-sm">Hunt Wild Pokémon</div>
                     </button>
                     <button 
                        onClick={startLeagueBattle}
                        className="bg-purple-100 p-4 rounded-xl border border-purple-200 shadow-sm flex flex-col items-center gap-2 active:scale-95 transition-transform"
                     >
                         <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white">
                             <Crown size={24} />
                         </div>
                         <div className="text-purple-800 font-bold text-sm">Challenge League</div>
                     </button>
                 </div>
             </div>

             <div className="mb-20">
                 <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Gym Challenge</h3>
                 <div className="space-y-3">
                     {currentRegion.gyms.map(gym => (
                         <div key={gym.id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                 <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs`} style={{backgroundColor: TYPE_COLORS[gym.type]}}>
                                     {gym.type.substring(0,2).toUpperCase()}
                                 </div>
                                 <div>
                                     <div className="font-bold text-sm">{gym.name}</div>
                                     <div className="text-xs text-gray-500">Leader: {gym.leaderName} (Lv.{gym.requiredLevel}+)</div>
                                 </div>
                             </div>
                             <Button variant="primary" className="text-xs px-3 py-1" onClick={() => startGymBattle(gym)}>
                                 Battle
                             </Button>
                         </div>
                     ))}
                 </div>
             </div>
        </div>
        
        <div className="absolute bottom-36 left-0 right-0 flex justify-center pointer-events-none">
            <div className="bg-green-600/90 text-white text-[10px] px-3 py-1 rounded-full shadow-lg backdrop-blur-sm flex items-center gap-1">
                <Heart size={10} fill="currentColor" /> Auto-Regen Active
            </div>
        </div>

        <div className="h-32 bg-white border-t border-gray-200 p-3 overflow-x-auto no-scrollbar flex gap-3 shadow-inner">
             {store.player.party.length === 0 ? (
                 <div className="w-full flex items-center justify-center text-gray-400 text-sm flex-col gap-2">
                     <span>Start your journey!</span>
                     <Button className="text-xs" onClick={handleGetStarter}>Get Starter</Button>
                 </div>
             ) : (
                store.player.party.map(p => (
                    <div key={p.uuid} className="min-w-[80px]">
                        <PokemonCard pokemon={p} showHp />
                    </div>
                ))
             )}
        </div>

        {/* Evolution Modal */}
        {evolutionPending && evolvingPokemon && (
            <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center p-6 backdrop-blur-sm">
                <div className="bg-white rounded-2xl p-6 w-full max-w-sm flex flex-col items-center animate-in zoom-in shadow-2xl">
                    <div className="text-2xl mb-4 animate-bounce">✨</div>
                    <h3 className="text-xl font-bold text-center mb-2">Evolution!</h3>
                    <p className="text-center text-gray-600 mb-6">
                        <span className="font-bold capitalize">{evolvingPokemon.original.name}</span> is evolving into <span className="font-bold capitalize">{evolvingPokemon.targetName}</span>!
                    </p>
                    
                    <div className="flex gap-4 items-center justify-center mb-6">
                         <img src={evolvingPokemon.original.sprite} className="w-20 h-20 opacity-50 grayscale" />
                         <div className="text-blue-500"><Sparkles /></div>
                         <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-2xl">?</div>
                    </div>

                    <div className="flex gap-3 w-full">
                         <Button 
                            variant="secondary" 
                            className="flex-1"
                            onClick={() => {
                                setEvolvingPokemon(null);
                                setEvolutionPending(false);
                            }}
                        >
                            Cancel
                         </Button>
                         <Button 
                            variant="primary" 
                            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 border-none text-white font-bold"
                            onClick={confirmEvolution}
                        >
                            Evolve!
                         </Button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
