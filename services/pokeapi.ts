
import { Pokemon, Move, StatBlock, PokemonType } from "../types";
import { MOVES_DB, NATURES } from "../constants";

const CACHE_PREFIX = 'poke_cache_v5_';
const memoryCache = new Map<string, any>();

// Standard formula for Stats (Gen 3+)
// HP = ((2 * Base + IV + (EV/4)) * Level) / 100 + Level + 10
// Other = floor((((2 * Base + IV + (EV/4)) * Level) / 100 + 5) * Nature)
export const calculateStats = (base: StatBlock, level: number, ivs: StatBlock, evs: StatBlock, nature: string): { stats: StatBlock, maxHp: number } => {
    
    const natMods = NATURES[nature] || {};
    
    const calc = (stat: keyof StatBlock) => {
        const b = base[stat];
        const iv = ivs[stat];
        const ev = evs[stat];
        
        if (stat === 'hp') {
            return Math.floor(((2 * b + iv + Math.floor(ev / 4)) * level) / 100) + level + 10;
        } else {
            const raw = Math.floor(((2 * b + iv + Math.floor(ev / 4)) * level) / 100) + 5;
            const modifier = natMods[stat] || 1.0;
            return Math.floor(raw * modifier);
        }
    };

    const maxHp = calc('hp');
    return {
        maxHp,
        stats: {
            hp: maxHp,
            atk: calc('atk'),
            def: calc('def'),
            spa: calc('spa'),
            spd: calc('spd'),
            spe: calc('spe'),
        }
    };
};

async function fetchWithCache(url: string) {
  if (memoryCache.has(url)) return memoryCache.get(url);
  
  const cacheKey = CACHE_PREFIX + url;
  try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const data = JSON.parse(cached);
        memoryCache.set(url, data);
        return data;
      }
  } catch (e) {
      console.warn("LocalStorage error", e);
  }

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    const data = await res.json();
    
    if (data) {
        try {
            localStorage.setItem(cacheKey, JSON.stringify(data));
        } catch (e) {
            console.warn("LocalStorage full, not caching");
        }
        memoryCache.set(url, data);
    }
    return data;
  } catch (e) {
    console.error(`Failed to fetch ${url}`, e);
    throw e;
  }
}

export const getPokemonList = async (limit = 1025, offset = 0) => {
  try {
    const data = await fetchWithCache(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
    return data.results;
  } catch (e) {
    return []; 
  }
};

export const getItemList = async (limit = 500, offset = 0) => {
    try {
        const data = await fetchWithCache(`https://pokeapi.co/api/v2/item?limit=${limit}&offset=${offset}`);
        return data.results;
    } catch(e) {
        return [];
    }
}

export const getItemDetails = async (name: string) => {
    try {
        const data = await fetchWithCache(`https://pokeapi.co/api/v2/item/${name}`);
        return {
            id: data.id,
            name: data.names.find((n:any) => n.language.name === 'en')?.name || data.name,
            description: data.flavor_text_entries.find((f:any) => f.language.name === 'en')?.text || '',
            sprite: data.sprites.default,
            category: data.category.name,
            cost: data.cost
        };
    } catch(e) {
        return null;
    }
}

export const getEvolutionChain = async (speciesUrl: string) => {
    try {
        const speciesData = await fetchWithCache(speciesUrl);
        const chainData = await fetchWithCache(speciesData.evolution_chain.url);
        
        const chain: {name: string, url: string}[] = [];
        let curr = chainData.chain;
        
        while(curr) {
            chain.push({
                name: curr.species.name,
                url: curr.species.url
            });
            curr = curr.evolves_to[0];
        }
        return chain;
    } catch(e) {
        return [];
    }
}

// Check if pokemon should evolve
export const checkEvolution = async (pokemon: Pokemon): Promise<{ newSpeciesName: string; newId: number } | null> => {
    if (!pokemon.speciesUrl) return null;

    try {
        const speciesData = await fetchWithCache(pokemon.speciesUrl);
        const chainData = await fetchWithCache(speciesData.evolution_chain.url);

        // Find current pokemon in the chain
        const findCurrentNode = (node: any): any => {
            if (node.species.name === pokemon.name.toLowerCase()) return node;
            for (const child of node.evolves_to) {
                const found = findCurrentNode(child);
                if (found) return found;
            }
            return null;
        };

        const currentNode = findCurrentNode(chainData.chain);
        if (!currentNode || currentNode.evolves_to.length === 0) return null;

        // Check evolution details (simple level check for now)
        for (const evo of currentNode.evolves_to) {
            const details = evo.evolution_details[0];
            if (details && details.trigger.name === 'level-up' && details.min_level && pokemon.level >= details.min_level) {
                 // Extract ID from url
                 const id = parseInt(evo.species.url.split('/').filter(Boolean).pop());
                 return { newSpeciesName: evo.species.name, newId: id };
            }
        }
        
        return null;

    } catch (e) {
        console.error("Evolution check failed", e);
        return null;
    }
};

export const evolvePokemonData = async (pokemon: Pokemon, newId: number): Promise<Pokemon> => {
    // Fetch new form data
    const data = await fetchWithCache(`https://pokeapi.co/api/v2/pokemon/${newId}`);
    
    // Update base stats
    const baseStats: StatBlock = {
        hp: data.stats[0].base_stat,
        atk: data.stats[1].base_stat,
        def: data.stats[2].base_stat,
        spa: data.stats[3].base_stat,
        spd: data.stats[4].base_stat,
        spe: data.stats[5].base_stat,
    };
    
    // Recalculate stats with new base stats but same IVs/EVs/Level
    const { stats, maxHp } = calculateStats(baseStats, pokemon.level, pokemon.ivs, pokemon.evs, pokemon.nature);
    
    // Maintain HP ratio
    const hpPercent = pokemon.currentHp / pokemon.maxHp;
    const currentHp = Math.floor(maxHp * hpPercent);

    return {
        ...pokemon,
        id: data.id,
        name: data.name,
        types: data.types.map((t: any) => t.type.name),
        baseStats,
        stats,
        maxHp,
        currentHp,
        sprite: data.sprites.front_default || data.sprites.other['official-artwork'].front_default,
        speciesUrl: data.species.url,
        // Moves are kept. New moves can be learned via Level Up logic or Move Relearner
    };
};


const getRandomIVs = (): StatBlock => ({
    hp: Math.floor(Math.random() * 32),
    atk: Math.floor(Math.random() * 32),
    def: Math.floor(Math.random() * 32),
    spa: Math.floor(Math.random() * 32),
    spd: Math.floor(Math.random() * 32),
    spe: Math.floor(Math.random() * 32),
});

const getEmptyEVs = (): StatBlock => ({ hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 });

const getRandomNature = (): string => {
    const natures = Object.keys(NATURES);
    return natures[Math.floor(Math.random() * natures.length)];
};

export const getPokemonDetails = async (idOrName: string | number): Promise<Pokemon> => {
  let data;
  try {
      data = await fetchWithCache(`https://pokeapi.co/api/v2/pokemon/${idOrName}`);
  } catch (e) {
      console.error("Using fallback pokemon data");
      return {
          id: 0,
          uuid: crypto.randomUUID(),
          name: "MissingNo.",
          types: ['normal'],
          baseStats: { hp: 33, atk: 136, def: 0, spa: 6, spd: 6, spe: 29 },
          stats: { hp: 33, atk: 136, def: 0, spa: 6, spd: 6, spe: 29 },
          ivs: getRandomIVs(),
          evs: getEmptyEVs(),
          nature: 'serious',
          maxHp: 33,
          currentHp: 33,
          level: 5,
          exp: 125,
          maxExp: 91,
          expToNextLevel: 216,
          moves: [MOVES_DB['tackle']],
          sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png",
          isShiny: false
      };
  }
  
  const baseStats: StatBlock = {
    hp: data.stats[0].base_stat,
    atk: data.stats[1].base_stat,
    def: data.stats[2].base_stat,
    spa: data.stats[3].base_stat,
    spd: data.stats[4].base_stat,
    spe: data.stats[5].base_stat,
  };

  // Improved Move Generation: Filter API moves that exist in our MOVES_DB
  const potentialMoves = data.moves
    .filter((m: any) => MOVES_DB[m.move.name]) 
    .map((m: any) => MOVES_DB[m.move.name]);
    
  // Fallback if no moves match
  if (potentialMoves.length === 0) {
      potentialMoves.push(MOVES_DB['tackle']);
  }

  // Deduplicate
  const uniqueMoves = [...new Set(potentialMoves)] as Move[];

  const level = 5;
  const ivs = getRandomIVs();
  const evs = getEmptyEVs();
  const nature = getRandomNature();

  const { stats, maxHp } = calculateStats(baseStats, level, ivs, evs, nature);
  const currentExp = Math.pow(level, 3);
  const nextExp = Math.pow(level + 1, 3);

  return {
    id: data.id,
    uuid: crypto.randomUUID(),
    name: data.name,
    types: data.types.map((t: any) => t.type.name),
    baseStats,
    stats,
    ivs,
    evs,
    nature,
    maxHp,
    currentHp: maxHp,
    level,
    exp: currentExp,
    maxExp: nextExp - currentExp,
    expToNextLevel: nextExp,
    moves: uniqueMoves.slice(0, 4),
    sprite: data.sprites.front_default || data.sprites.other['official-artwork'].front_default,
    isShiny: false,
    speciesUrl: data.species.url
  };
};

export const generateWildPokemon = async (level: number, idRange: [number, number] = [1, 151], specificId?: number): Promise<Pokemon> => {
  const id = specificId || Math.floor(Math.random() * (idRange[1] - idRange[0] + 1)) + idRange[0];
  const p = await getPokemonDetails(id);
  
  if (p.id === 0) return p;

  // Re-roll IVs/Nature for wild encounter uniqueness
  const ivs = getRandomIVs();
  const evs = getEmptyEVs();
  const nature = getRandomNature();

  const { stats, maxHp } = calculateStats(p.baseStats, level, ivs, evs, nature);

  p.level = level;
  p.exp = Math.pow(level, 3);
  p.maxExp = Math.pow(level + 1, 3) - Math.pow(level, 3);
  p.expToNextLevel = Math.pow(level + 1, 3);
  
  p.ivs = ivs;
  p.evs = evs;
  p.nature = nature;
  p.stats = stats;
  p.maxHp = maxHp;
  p.currentHp = maxHp;
  
  // Update Moves based on Level
  try {
      const rawData = await fetchWithCache(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const levelUpMoves = rawData.moves.filter((m: any) => {
           const detail = m.version_group_details[0]; 
           return detail.move_learn_method.name === 'level-up' && detail.level_learned_at <= level && MOVES_DB[m.move.name];
      }).sort((a: any, b: any) => b.version_group_details[0].level_learned_at - a.version_group_details[0].level_learned_at);
      
      const selectedMoves = levelUpMoves.slice(0, 4).map((m: any) => MOVES_DB[m.move.name]);
      
      if (selectedMoves.length > 0) {
          p.moves = selectedMoves;
      } else {
          p.moves = [MOVES_DB['tackle'] || MOVES_DB['scratch']];
      }
  } catch (e) {
      if (!p.moves || p.moves.length === 0) {
          p.moves = [MOVES_DB['tackle']];
      }
  }
  
  return p;
};

// Fetch all learnable moves for a pokemon (for the Team Builder)
export const getPokemonMoves = async (id: number): Promise<Move[]> => {
    try {
        const rawData = await fetchWithCache(`https://pokeapi.co/api/v2/pokemon/${id}`);
        // Filter only moves that exist in our local MOVES_DB to avoid nulls
        const available = rawData.moves
            .filter((m: any) => MOVES_DB[m.move.name])
            .map((m: any) => MOVES_DB[m.move.name]);
            
        // Deduplicate
        const seen = new Set();
        return available.filter((m: any) => {
            const duplicate = seen.has(m.name);
            seen.add(m.name);
            return !duplicate;
        });
    } catch (e) {
        console.error("Failed to fetch moves", e);
        return [];
    }
};
