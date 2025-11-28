
export type PokemonType = 
  | 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice' | 'fighting' 
  | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug' | 'rock' | 'ghost' 
  | 'dragon' | 'steel' | 'fairy' | 'dark';

export interface StatBlock {
  hp: number;
  atk: number;
  def: number;
  spa: number;
  spd: number;
  spe: number;
}

export interface Move {
  name: string;
  type: PokemonType;
  power: number;
  accuracy: number;
  pp: number;
  maxPp: number;
  priority: number;
  category: 'physical' | 'special' | 'status';
  description?: string;
}

export interface Pokemon {
  id: number;
  uuid: string;
  name: string;
  types: PokemonType[];
  baseStats: StatBlock; // Immutable base stats from API
  stats: StatBlock;     // Current effective stats
  ivs: StatBlock;       // Individual Values (0-31)
  evs: StatBlock;       // Effort Values (0-252)
  nature: string;       // Nature name (e.g. 'adamant')
  maxHp: number;
  currentHp: number;
  level: number;
  exp: number;
  maxExp: number; 
  expToNextLevel: number; 
  moves: Move[];
  sprite: string;
  isShiny: boolean;
  status?: 'paralysis' | 'poison' | 'sleep' | 'burn' | 'freeze';
  faintTime?: number;
  heldItem?: string;    // ID of held item
  speciesUrl?: string;  // For evolution checking
}

export interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'ball' | 'medicine' | 'status' | 'key' | 'berry' | 'battle';
  effect?: (pokemon: Pokemon) => Partial<Pokemon> | null; 
}

export interface Gym {
  id: string;
  name: string;
  leaderName: string;
  badge: string;
  requiredLevel: number;
  type: PokemonType;
  pokemon: number[]; // IDs of pokemon
}

export interface Region {
  id: string;
  name: string;
  generation: number;
  idRange: [number, number]; 
  routes: number[]; 
  gyms: Gym[];
}

export interface PlayerState {
  name: string;
  party: Pokemon[];
  box: Pokemon[]; // Unlimited storage
  money: number;
  items: Record<string, number>;
  seen: number[];
  caught: number[];
  badges: string[];
}

export interface GameState {
  activeRegion: string;
  activeRoute: number | 'gym' | 'league';
  activeGymId: string | null;
  battleState: 'idle' | 'searching' | 'battle' | 'victory' | 'defeat' | 'caught';
  opponent: Pokemon | null;
  turn: number;
  log: string[];
}

export interface EvolutionChain {
    name: string;
    url: string;
}

export interface AppConfig {
  theme: 'light' | 'dark';
  language: 'en' | 'es' | 'ja';
}
