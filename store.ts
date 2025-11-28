
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PlayerState, GameState, Pokemon, AppConfig, Item } from './types';
import { INITIAL_PLAYER_STATE, ITEMS } from './constants';
import { calculateStats } from './services/pokeapi';

interface StoreState {
  player: PlayerState;
  game: GameState;
  config: AppConfig;
  
  // Core
  setPlayerName: (name: string) => void;
  addToParty: (p: Pokemon) => void;
  removeFromParty: (uuid: string) => void;
  swapPartyPositions: (idx1: number, idx2: number) => void;
  healParty: () => void;
  updatePokemon: (uuid: string, updates: Partial<Pokemon>) => void;
  
  // Evolution
  evolvePokemon: (uuid: string, evolvedForm: Pokemon) => void;

  // Box System
  depositPokemon: (uuid: string) => void;
  withdrawPokemon: (uuid: string) => void;
  releasePokemon: (uuid: string) => void;

  // Game Loop
  setBattleState: (s: GameState['battleState']) => void;
  setOpponent: (p: Pokemon | null) => void;
  setRegion: (id: string) => void;
  setRoute: (routeId: number | 'gym' | 'league') => void;
  setActiveGym: (gymId: string | null) => void;
  addLog: (msg: string) => void;
  clearLog: () => void;
  tickRegen: () => void; 
  
  // Progression
  gainExp: (amount: number) => void;
  
  // Economy & Items
  useItem: (itemKey: string, targetUuid?: string) => void;
  buyItem: (itemKey: string, qty: number) => void;
  sellItem: (itemKey: string, qty: number) => void;
  earnMoney: (amount: number) => void;
  addItem: (itemKey: string, qty: number) => void;
  equipItem: (uuid: string, itemKey: string) => void;
  unequipItem: (uuid: string) => void;
  
  // Combat
  faintPokemon: (uuid: string) => void;
  revivePokemon: (uuid: string) => void;
  
  // Trading
  tradePokemon: (uuid: string, newPokemon: Pokemon) => void;

  // Settings
  resetSave: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      player: INITIAL_PLAYER_STATE,
      config: { theme: 'light', language: 'en' },
      game: {
        activeRegion: 'kanto',
        activeRoute: 1,
        activeGymId: null,
        battleState: 'idle',
        opponent: null,
        turn: 0,
        log: []
      },

      setPlayerName: (name) => set((state) => ({ player: { ...state.player, name } })),
      
      addToParty: (p) => set((state) => {
        const isSeen = state.player.seen.includes(p.id) ? state.player.seen : [...state.player.seen, p.id];
        const isCaught = state.player.caught.includes(p.id) ? state.player.caught : [...state.player.caught, p.id];

        if (state.player.party.length < 6) {
          return { player: { ...state.player, party: [...state.player.party, p], seen: isSeen, caught: isCaught } };
        } else {
          // Send to box if party full
          return { player: { ...state.player, box: [...state.player.box, p], seen: isSeen, caught: isCaught } };
        }
      }),

      removeFromParty: (uuid) => set((state) => ({
        player: { ...state.player, party: state.player.party.filter(p => p.uuid !== uuid) }
      })),

      evolvePokemon: (uuid, evolvedForm) => set((state) => ({
          player: {
              ...state.player,
              party: state.player.party.map(p => p.uuid === uuid ? evolvedForm : p)
          }
      })),

      depositPokemon: (uuid) => set((state) => {
          if (state.player.party.length <= 1) return state; // Need at least 1 in party
          const p = state.player.party.find(p => p.uuid === uuid);
          if (!p) return state;
          
          return {
              player: {
                  ...state.player,
                  party: state.player.party.filter(pk => pk.uuid !== uuid),
                  box: [...state.player.box, p]
              }
          };
      }),

      withdrawPokemon: (uuid) => set((state) => {
          if (state.player.party.length >= 6) return state;
          const p = state.player.box.find(p => p.uuid === uuid);
          if (!p) return state;

          return {
              player: {
                  ...state.player,
                  box: state.player.box.filter(pk => pk.uuid !== uuid),
                  party: [...state.player.party, p]
              }
          };
      }),

      releasePokemon: (uuid) => set((state) => ({
          player: {
              ...state.player,
              box: state.player.box.filter(p => p.uuid !== uuid)
          }
      })),

      swapPartyPositions: (idx1, idx2) => set((state) => {
        const newParty = [...state.player.party];
        if (newParty[idx1] && newParty[idx2]) {
            [newParty[idx1], newParty[idx2]] = [newParty[idx2], newParty[idx1]];
            return { player: { ...state.player, party: newParty } };
        }
        return state;
      }),

      healParty: () => set((state) => ({
        player: {
          ...state.player,
          party: state.player.party.map(p => ({
            ...p,
            currentHp: p.maxHp,
            status: undefined,
            faintTime: undefined
          }))
        }
      })),

      updatePokemon: (uuid, updates) => set((state) => {
        const updateLogic = (p: Pokemon) => {
             if (p.uuid === uuid) {
                 const updated = { ...p, ...updates };
                 // If stat-affecting fields change, recalculate
                 if (updates.evs || updates.nature) {
                     const { stats, maxHp } = calculateStats(updated.baseStats, updated.level, updated.ivs, updated.evs, updated.nature);
                     // If max HP changed, maintain current HP % or just cap it
                     const currentHp = Math.min(stats.hp, updated.currentHp); 
                     return { ...updated, stats, maxHp, currentHp };
                 }
                 return updated;
             }
             return p;
        };

        return {
          player: {
            ...state.player,
            party: state.player.party.map(updateLogic),
            box: state.player.box.map(updateLogic)
          },
        };
      }),

      tickRegen: () => set((state) => {
        if (state.game.battleState !== 'idle') return state;
        return {
          player: {
            ...state.player,
            party: state.player.party.map(p => {
              if (p.currentHp > 0 && p.currentHp < p.maxHp) {
                // Base regen 5%
                let regen = 0.05;
                // Leftovers regen boost
                if (p.heldItem === 'leftovers') regen += 0.06;
                
                return { ...p, currentHp: Math.min(p.maxHp, p.currentHp + Math.ceil(p.maxHp * regen)) };
              }
              return p;
            })
          }
        };
      }),

      setBattleState: (bs) => set((state) => ({ game: { ...state.game, battleState: bs } })),
      setOpponent: (op) => set((state) => ({ game: { ...state.game, opponent: op } })),
      setRegion: (id) => set((state) => ({ game: { ...state.game, activeRegion: id, activeRoute: 1, activeGymId: null } })),
      setRoute: (routeId) => set((state) => ({ game: { ...state.game, activeRoute: routeId, activeGymId: null } })),
      setActiveGym: (gymId) => set((state) => ({ game: { ...state.game, activeGymId: gymId, activeRoute: 'gym' } })),
      
      addLog: (msg) => set((state) => ({ game: { ...state.game, log: [...state.game.log, msg] } })),
      clearLog: () => set((state) => ({ game: { ...state.game, log: [] } })),

      useItem: (key, targetUuid) => set((state) => {
        const itemDef = ITEMS[key];
        const count = state.player.items[key] || 0;
        const shouldDecrement = itemDef.category !== 'ball'; 

        if (count > 0) {
            let newParty = state.player.party;
            
            if (targetUuid && (itemDef.category === 'medicine' || itemDef.category === 'status')) {
                newParty = state.player.party.map(p => {
                    if (p.uuid === targetUuid) {
                         if (key === 'potion') return { ...p, currentHp: Math.min(p.maxHp, p.currentHp + 20) };
                         if (key === 'superpotion') return { ...p, currentHp: Math.min(p.maxHp, p.currentHp + 50) };
                         if (key === 'hyperpotion') return { ...p, currentHp: Math.min(p.maxHp, p.currentHp + 200) };
                         if (key === 'maxpotion') return { ...p, currentHp: p.maxHp };
                         if (key === 'revive' && p.currentHp <= 0) return { ...p, currentHp: Math.floor(p.maxHp / 2), faintTime: undefined };
                         if (key === 'maxrevive' && p.currentHp <= 0) return { ...p, currentHp: p.maxHp, faintTime: undefined };
                         if (key === 'fullheal') return { ...p, status: undefined };
                         if (key === 'rarecandy') {
                             const newLevel = Math.min(100, p.level + 1);
                             const { stats, maxHp } = calculateStats(p.baseStats, newLevel, p.ivs, p.evs, p.nature);
                             return { 
                                 ...p, 
                                 level: newLevel, 
                                 maxHp, 
                                 currentHp: maxHp, 
                                 stats 
                             };
                         }
                         if (key === 'lumberry') return { ...p, status: undefined };
                         if (key === 'oranberry') return { ...p, currentHp: Math.min(p.maxHp, p.currentHp + 10) };
                         if (key === 'sitrusberry') return { ...p, currentHp: Math.min(p.maxHp, p.currentHp + Math.floor(p.maxHp * 0.25)) };
                    }
                    return p;
                });
            }

            return { 
                player: { 
                    ...state.player, 
                    items: shouldDecrement ? { ...state.player.items, [key]: count - 1 } : state.player.items,
                    party: newParty
                } 
            };
        }
        return state;
      }),

      buyItem: (key, qty) => set((state) => {
         const cost = (ITEMS[key]?.price || 0) * qty;
         if (state.player.money >= cost) {
             return {
                 player: {
                     ...state.player,
                     money: state.player.money - cost,
                     items: {
                         ...state.player.items,
                         [key]: (state.player.items[key] || 0) + qty
                     }
                 }
             };
         }
         return state;
      }),

      sellItem: (key, qty) => set((state) => {
        const price = Math.floor((ITEMS[key]?.price || 0) / 2);
        const currentQty = state.player.items[key] || 0;
        if (currentQty >= qty) {
            return {
                player: {
                    ...state.player,
                    money: state.player.money + (price * qty),
                    items: {
                        ...state.player.items,
                        [key]: currentQty - qty
                    }
                }
            };
        }
        return state;
      }),

      earnMoney: (amt) => set((state) => ({ player: { ...state.player, money: state.player.money + amt } })),
      
      addItem: (key, qty) => set((state) => ({
          player: {
              ...state.player,
              items: {
                  ...state.player.items,
                  [key]: (state.player.items[key] || 0) + qty
              }
          }
      })),

      gainExp: (amount) => set((state) => {
        const updatedParty = state.player.party.map((p, index) => {
            if (p.currentHp <= 0) return p;

            const shareFactor = index === 0 ? 1 : 0.5;
            const expToGain = Math.floor(amount * shareFactor);

            let totalExp = (p.exp || 0) + expToGain;
            let currentLevel = p.level;
            
            // Recalculate level based on total exp
            let newLevel = Math.floor(Math.cbrt(totalExp));
            if (newLevel > 100) newLevel = 100;
            if (newLevel < 1) newLevel = 1;
            
            let didLevelUp = newLevel > currentLevel;
            let stats = p.stats;
            let maxHp = p.maxHp;
            let currentHp = p.currentHp;

            // Recalculate stats if leveled up
            if (didLevelUp) {
                const calculated = calculateStats(p.baseStats, newLevel, p.ivs, p.evs, p.nature);
                stats = calculated.stats;
                
                // HP increase adds to current HP
                const hpDiff = calculated.maxHp - maxHp;
                maxHp = calculated.maxHp;
                currentHp = currentHp + hpDiff; // Add the gained HP capacity
                currentHp = maxHp; // Full heal on level up

                if (index === 0) {
                    get().addLog(`${p.name} grew to level ${newLevel}!`);
                }
            }

            const nextLevelExp = Math.pow(newLevel + 1, 3);
            const currentLevelExp = Math.pow(newLevel, 3);
            
            return {
                ...p,
                exp: totalExp,
                level: newLevel,
                expToNextLevel: nextLevelExp,
                maxExp: nextLevelExp - currentLevelExp,
                stats,
                maxHp,
                currentHp
            };
        });

        return { player: { ...state.player, party: updatedParty } };
      }),
      
      faintPokemon: (uuid) => set((state) => ({
        player: {
            ...state.player,
            party: state.player.party.map(p => {
                if(p.uuid === uuid) {
                    return { ...p, currentHp: 0, faintTime: Date.now() + (p.level * 60 * 1000) };
                }
                return p;
            })
        }
      })),

      revivePokemon: (uuid) => set((state) => ({
        player: {
            ...state.player,
            party: state.player.party.map(p => {
                if(p.uuid === uuid) {
                    return { ...p, currentHp: Math.floor(p.maxHp / 2), faintTime: undefined };
                }
                return p;
            })
        }
      })),

      tradePokemon: (uuid, newPokemon) => set((state) => {
          return {
              player: {
                  ...state.player,
                  party: state.player.party.map(p => p.uuid === uuid ? { ...newPokemon, uuid: crypto.randomUUID() } : p)
              }
          };
      }),

      equipItem: (uuid, itemKey) => set((state) => {
          if ((state.player.items[itemKey] || 0) < 1) return state;

          return {
              player: {
                  ...state.player,
                  items: { ...state.player.items, [itemKey]: state.player.items[itemKey] - 1 },
                  party: state.player.party.map(p => {
                      if (p.uuid === uuid) {
                          // If already holding item, return it to bag
                          if (p.heldItem) {
                              state.player.items[p.heldItem] = (state.player.items[p.heldItem] || 0) + 1;
                          }
                          return { ...p, heldItem: itemKey };
                      }
                      return p;
                  })
              }
          }
      }),

      unequipItem: (uuid) => set((state) => {
          const p = state.player.party.find(p => p.uuid === uuid);
          if (!p || !p.heldItem) return state;

          return {
              player: {
                  ...state.player,
                  items: { ...state.player.items, [p.heldItem]: (state.player.items[p.heldItem] || 0) + 1 },
                  party: state.player.party.map(pk => pk.uuid === uuid ? { ...pk, heldItem: undefined } : pk)
              }
          }
      }),

      resetSave: () => {
          localStorage.removeItem('pokequest-storage-v4');
          window.location.reload();
      }

    }),
    {
      name: 'pokequest-storage-v4',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ player: state.player, config: state.config }), 
    }
  )
);
