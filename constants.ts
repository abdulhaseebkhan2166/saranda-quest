
import { PokemonType, Region, Item, Move, StatBlock } from "./types";

export const TYPE_COLORS: Record<PokemonType, string> = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  steel: '#B7B7CE',
  fairy: '#D685AD',
  dark: '#705746',
};

export const INITIAL_PLAYER_STATE = {
  name: 'Trainer',
  party: [],
  box: [],
  money: 5000,
  items: { 'pokeball': 20, 'potion': 5 },
  seen: [],
  caught: [],
  badges: []
};

// --- NATURES DATABASE ---
export const NATURES: Record<string, Partial<StatBlock>> = {
  hardy: {}, lonely: { atk: 1.1, def: 0.9 }, brave: { atk: 1.1, spe: 0.9 }, adamant: { atk: 1.1, spa: 0.9 }, naughty: { atk: 1.1, spd: 0.9 },
  bold: { def: 1.1, atk: 0.9 }, docile: {}, relaxed: { def: 1.1, spe: 0.9 }, impish: { def: 1.1, spa: 0.9 }, lax: { def: 1.1, spd: 0.9 },
  timid: { spe: 1.1, atk: 0.9 }, hasty: { spe: 1.1, def: 0.9 }, serious: {}, jolly: { spe: 1.1, spa: 0.9 }, naive: { spe: 1.1, spd: 0.9 },
  modest: { spa: 1.1, atk: 0.9 }, mild: { spa: 1.1, def: 0.9 }, quiet: { spa: 1.1, spe: 0.9 }, bashful: {}, rash: { spa: 1.1, spd: 0.9 },
  calm: { spd: 1.1, atk: 0.9 }, gentle: { spd: 1.1, def: 0.9 }, sassy: { spd: 1.1, spe: 0.9 }, careful: { spd: 1.1, spa: 0.9 }, quirky: {},
};

// --- MOVES DATABASE ---
export const MOVES_DB: Record<string, Move> = {
  'tackle': { name: 'Tackle', type: 'normal', power: 40, accuracy: 100, pp: 35, maxPp: 35, priority: 0, category: 'physical', description: 'A physical charge attack.' },
  'scratch': { name: 'Scratch', type: 'normal', power: 40, accuracy: 100, pp: 35, maxPp: 35, priority: 0, category: 'physical', description: 'Hard, pointed claws scratch the foe.' },
  'pound': { name: 'Pound', type: 'normal', power: 40, accuracy: 100, pp: 35, maxPp: 35, priority: 0, category: 'physical', description: 'Pounds the foe with forelegs or tail.' },
  'quick-attack': { name: 'Quick Attack', type: 'normal', power: 40, accuracy: 100, pp: 30, maxPp: 30, priority: 1, category: 'physical', description: 'An extremely fast attack.' },
  'ember': { name: 'Ember', type: 'fire', power: 40, accuracy: 100, pp: 25, maxPp: 25, priority: 0, category: 'special', description: 'A weak fire attack that may burn.' },
  'water-gun': { name: 'Water Gun', type: 'water', power: 40, accuracy: 100, pp: 25, maxPp: 25, priority: 0, category: 'special', description: 'Squirts water to attack.' },
  'vine-whip': { name: 'Vine Whip', type: 'grass', power: 45, accuracy: 100, pp: 25, maxPp: 25, priority: 0, category: 'physical', description: 'Strikes the foe with slender whips.' },
  'thunder-shock': { name: 'Thunder Shock', type: 'electric', power: 40, accuracy: 100, pp: 30, maxPp: 30, priority: 0, category: 'special', description: 'An electric shock that may paralyze.' },
  'peck': { name: 'Peck', type: 'flying', power: 35, accuracy: 100, pp: 35, maxPp: 35, priority: 0, category: 'physical', description: 'Jabs the foe with a beak.' },
  'bite': { name: 'Bite', type: 'dark', power: 60, accuracy: 100, pp: 25, maxPp: 25, priority: 0, category: 'physical', description: 'Bites with vicious fangs.' },
  'confusion': { name: 'Confusion', type: 'psychic', power: 50, accuracy: 100, pp: 25, maxPp: 25, priority: 0, category: 'special', description: 'A psychic attack that may confuse.' },
  'rock-throw': { name: 'Rock Throw', type: 'rock', power: 50, accuracy: 90, pp: 15, maxPp: 15, priority: 0, category: 'physical', description: 'Drops rocks on the foe.' },
  'mach-punch': { name: 'Mach Punch', type: 'fighting', power: 40, accuracy: 100, pp: 30, maxPp: 30, priority: 1, category: 'physical', description: 'A punch thrown at blinding speed.' },

  // Mid-High Tier Moves
  'flamethrower': { name: 'Flamethrower', type: 'fire', power: 90, accuracy: 100, pp: 15, maxPp: 15, priority: 0, category: 'special', description: 'A powerful fire attack.' },
  'surf': { name: 'Surf', type: 'water', power: 90, accuracy: 100, pp: 15, maxPp: 15, priority: 0, category: 'special', description: 'Creates a huge wave to crash down.' },
  'thunderbolt': { name: 'Thunderbolt', type: 'electric', power: 90, accuracy: 100, pp: 15, maxPp: 15, priority: 0, category: 'special', description: 'A strong electric blast.' },
  'ice-beam': { name: 'Ice Beam', type: 'ice', power: 90, accuracy: 100, pp: 10, maxPp: 10, priority: 0, category: 'special', description: 'Blasts the foe with an icy beam.' },
  'earthquake': { name: 'Earthquake', type: 'ground', power: 100, accuracy: 100, pp: 10, maxPp: 10, priority: 0, category: 'physical', description: 'A massive tremor shakes the ground.' },
  'psychic': { name: 'Psychic', type: 'psychic', power: 90, accuracy: 100, pp: 10, maxPp: 10, priority: 0, category: 'special', description: 'A powerful psychic attack.' },
  'rock-slide': { name: 'Rock Slide', type: 'rock', power: 75, accuracy: 90, pp: 10, maxPp: 10, priority: 0, category: 'physical', description: 'Large boulders are hurled.' },
  'shadow-ball': { name: 'Shadow Ball', type: 'ghost', power: 80, accuracy: 100, pp: 15, maxPp: 15, priority: 0, category: 'special', description: 'Hurls a shadowy blob.' },
  'dragon-claw': { name: 'Dragon Claw', type: 'dragon', power: 80, accuracy: 100, pp: 15, maxPp: 15, priority: 0, category: 'physical', description: 'Slashes with sharp claws.' },
  'wing-attack': { name: 'Wing Attack', type: 'flying', power: 60, accuracy: 100, pp: 35, maxPp: 35, priority: 0, category: 'physical', description: 'Strikes the foe with wings.' },
  'sludge-bomb': { name: 'Sludge Bomb', type: 'poison', power: 90, accuracy: 100, pp: 10, maxPp: 10, priority: 0, category: 'special', description: 'Unsanitary sludge is hurled.' },
  'brick-break': { name: 'Brick Break', type: 'fighting', power: 75, accuracy: 100, pp: 15, maxPp: 15, priority: 0, category: 'physical', description: 'A swift chop.' },
  'x-scissor': { name: 'X-Scissor', type: 'bug', power: 80, accuracy: 100, pp: 15, maxPp: 15, priority: 0, category: 'physical', description: 'Slashes in an X pattern.' },
  'flash-cannon': { name: 'Flash Cannon', type: 'steel', power: 80, accuracy: 100, pp: 10, maxPp: 10, priority: 0, category: 'special', description: 'A blast of light energy.' },
  'moonblast': { name: 'Moonblast', type: 'fairy', power: 95, accuracy: 100, pp: 15, maxPp: 15, priority: 0, category: 'special', description: 'Attacks with the power of the moon.' },
  'crunch': { name: 'Crunch', type: 'dark', power: 80, accuracy: 100, pp: 15, maxPp: 15, priority: 0, category: 'physical', description: 'Crunches with sharp fangs.' },
  'hydro-pump': { name: 'Hydro Pump', type: 'water', power: 110, accuracy: 80, pp: 5, maxPp: 5, priority: 0, category: 'special', description: 'Blasts water at high power.' },
  'fire-blast': { name: 'Fire Blast', type: 'fire', power: 110, accuracy: 85, pp: 5, maxPp: 5, priority: 0, category: 'special', description: 'A massive blast of fire.' },
  'solar-beam': { name: 'Solar Beam', type: 'grass', power: 120, accuracy: 100, pp: 10, maxPp: 10, priority: 0, category: 'special', description: 'Absorbs light to attack.' },
  'hyper-beam': { name: 'Hyper Beam', type: 'normal', power: 150, accuracy: 90, pp: 5, maxPp: 5, priority: 0, category: 'special', description: 'A severely damaging beam.' },
  'close-combat': { name: 'Close Combat', type: 'fighting', power: 120, accuracy: 100, pp: 5, maxPp: 5, priority: 0, category: 'physical', description: 'Fighting up close without guarding.' },
  'brave-bird': { name: 'Brave Bird', type: 'flying', power: 120, accuracy: 100, pp: 15, maxPp: 15, priority: 0, category: 'physical', description: 'A low altitude charge.' },
  'giga-drain': { name: 'Giga Drain', type: 'grass', power: 75, accuracy: 100, pp: 10, maxPp: 10, priority: 0, category: 'special', description: 'Steals half the damage taken.' },
  'dark-pulse': { name: 'Dark Pulse', type: 'dark', power: 80, accuracy: 100, pp: 15, maxPp: 15, priority: 0, category: 'special', description: 'A horrible aura imbued with dark thoughts.' },
  'iron-head': { name: 'Iron Head', type: 'steel', power: 80, accuracy: 100, pp: 15, maxPp: 15, priority: 0, category: 'physical', description: 'Slams the foe with a steel-hard head.' },
  'play-rough': { name: 'Play Rough', type: 'fairy', power: 90, accuracy: 90, pp: 10, maxPp: 10, priority: 0, category: 'physical', description: 'Plays rough with the target.' },
  'stone-edge': { name: 'Stone Edge', type: 'rock', power: 100, accuracy: 80, pp: 5, maxPp: 5, priority: 0, category: 'physical', description: 'Stabs the foe with sharpened stones.' },

  // NEW MOVES
  'aura-sphere': { name: 'Aura Sphere', type: 'fighting', power: 80, accuracy: 0, pp: 20, maxPp: 20, priority: 0, category: 'special', description: 'The user lets loose a blast of aura power that cannot be evaded.' },
  'bug-buzz': { name: 'Bug Buzz', type: 'bug', power: 90, accuracy: 100, pp: 10, maxPp: 10, priority: 0, category: 'special', description: 'The user vibrates to generate a damaging sound wave.' },
  'air-slash': { name: 'Air Slash', type: 'flying', power: 75, accuracy: 95, pp: 15, maxPp: 15, priority: 0, category: 'special', description: 'The user attacks with a blade of air that slices even the sky.' },
  'energy-ball': { name: 'Energy Ball', type: 'grass', power: 90, accuracy: 100, pp: 10, maxPp: 10, priority: 0, category: 'special', description: 'The user draws power from nature and fires it at the target.' },
  'focus-blast': { name: 'Focus Blast', type: 'fighting', power: 120, accuracy: 70, pp: 5, maxPp: 5, priority: 0, category: 'special', description: 'The user heightens its mental focus and unleashes its power.' },
  'earth-power': { name: 'Earth Power', type: 'ground', power: 90, accuracy: 100, pp: 10, maxPp: 10, priority: 0, category: 'special', description: 'The user makes the ground under the target erupt with power.' },
  'power-gem': { name: 'Power Gem', type: 'rock', power: 80, accuracy: 100, pp: 20, maxPp: 20, priority: 0, category: 'special', description: 'The user attacks with a ray of light that sparkles as if it were a gem.' },
  'zen-headbutt': { name: 'Zen Headbutt', type: 'psychic', power: 80, accuracy: 90, pp: 15, maxPp: 15, priority: 0, category: 'physical', description: 'The user focuses its willpower to its head and attacks the target.' },
  'poison-jab': { name: 'Poison Jab', type: 'poison', power: 80, accuracy: 100, pp: 20, maxPp: 20, priority: 0, category: 'physical', description: 'The target is stabbed with a tentacle or arm steeped in poison.' },
  'gunk-shot': { name: 'Gunk Shot', type: 'poison', power: 120, accuracy: 80, pp: 5, maxPp: 5, priority: 0, category: 'physical', description: 'The user shoots filthy garbage at the target to attack.' },
  'night-slash': { name: 'Night Slash', type: 'dark', power: 70, accuracy: 100, pp: 15, maxPp: 15, priority: 0, category: 'physical', description: 'The user slashes the target the instant an opportunity arises.' },
  'aqua-tail': { name: 'Aqua Tail', type: 'water', power: 90, accuracy: 90, pp: 10, maxPp: 10, priority: 0, category: 'physical', description: 'The user attacks by swinging its tail as if it were a vicious wave in a raging storm.' },
  'seed-bomb': { name: 'Seed Bomb', type: 'grass', power: 80, accuracy: 100, pp: 15, maxPp: 15, priority: 0, category: 'physical', description: 'The user slams a barrage of hard-shelled seeds down on the target.' },
  'drill-run': { name: 'Drill Run', type: 'ground', power: 80, accuracy: 95, pp: 10, maxPp: 10, priority: 0, category: 'physical', description: 'The user crashes into its target while rotating its body like a drill.' },
  'blaze-kick': { name: 'Blaze Kick', type: 'fire', power: 85, accuracy: 90, pp: 10, maxPp: 10, priority: 0, category: 'physical', description: 'The user launches a kick that lands a critical hit more easily.' },
  'thunder-punch': { name: 'Thunder Punch', type: 'electric', power: 75, accuracy: 100, pp: 15, maxPp: 15, priority: 0, category: 'physical', description: 'The target is punched with an electrified fist.' },
  'fire-punch': { name: 'Fire Punch', type: 'fire', power: 75, accuracy: 100, pp: 15, maxPp: 15, priority: 0, category: 'physical', description: 'The target is punched with a fiery fist.' },
  'ice-punch': { name: 'Ice Punch', type: 'ice', power: 75, accuracy: 100, pp: 15, maxPp: 15, priority: 0, category: 'physical', description: 'The target is punched with an icy fist.' },
  'shadow-claw': { name: 'Shadow Claw', type: 'ghost', power: 70, accuracy: 100, pp: 15, maxPp: 15, priority: 0, category: 'physical', description: 'The user slashes with a sharp claw made from shadows.' },
  'dragon-pulse': { name: 'Dragon Pulse', type: 'dragon', power: 85, accuracy: 100, pp: 10, maxPp: 10, priority: 0, category: 'special', description: 'The target is attacked with a shock wave generated by the user\'s gaping mouth.' },
  'dazzling-gleam': { name: 'Dazzling Gleam', type: 'fairy', power: 80, accuracy: 100, pp: 10, maxPp: 10, priority: 0, category: 'special', description: 'The user damages opposing Pokémon by emitting a powerful flash.' },
  'psyshock': { name: 'Psyshock', type: 'psychic', power: 80, accuracy: 100, pp: 10, maxPp: 10, priority: 0, category: 'special', description: 'The user materializes an odd psychic wave to attack the target.' },
  'hurricane': { name: 'Hurricane', type: 'flying', power: 110, accuracy: 70, pp: 10, maxPp: 10, priority: 0, category: 'special', description: 'The user wraps its opponent in a fierce wind that flies up into the sky.' },
  'outrage': { name: 'Outrage', type: 'dragon', power: 120, accuracy: 100, pp: 10, maxPp: 10, priority: 0, category: 'physical', description: 'The user rampages and attacks for two to three turns.' },
  'waterfall': { name: 'Waterfall', type: 'water', power: 80, accuracy: 100, pp: 15, maxPp: 15, priority: 0, category: 'physical', description: 'The user charges at the target and may make it flinch.' },
  'will-o-wisp': { name: 'Will-O-Wisp', type: 'fire', power: 0, accuracy: 85, pp: 15, maxPp: 15, priority: 0, category: 'status', description: 'The user shoots a sinister, bluish-white flame at the target to inflict a burn.' },
  'toxic': { name: 'Toxic', type: 'poison', power: 0, accuracy: 90, pp: 10, maxPp: 10, priority: 0, category: 'status', description: 'A move that leaves the target badly poisoned.' },
  'thunder-wave': { name: 'Thunder Wave', type: 'electric', power: 0, accuracy: 90, pp: 20, maxPp: 20, priority: 0, category: 'status', description: 'The user launches a weak jolt of electricity that paralyzes the target.' },
  'swords-dance': { name: 'Swords Dance', type: 'normal', power: 0, accuracy: 100, pp: 20, maxPp: 20, priority: 0, category: 'status', description: 'A frenetic dance to uplift the fighting spirit. This sharply raises the user\'s Attack stat.' },
  'calm-mind': { name: 'Calm Mind', type: 'psychic', power: 0, accuracy: 100, pp: 20, maxPp: 20, priority: 0, category: 'status', description: 'The user quietly focuses its mind and calms its spirit to raise its Sp. Atk and Sp. Def stats.' },
  'nasty-plot': { name: 'Nasty Plot', type: 'dark', power: 0, accuracy: 100, pp: 20, maxPp: 20, priority: 0, category: 'status', description: 'The user stimulates its brain by thinking bad thoughts. This sharply raises the user\'s Sp. Atk stat.' },
  'dragon-dance': { name: 'Dragon Dance', type: 'dragon', power: 0, accuracy: 100, pp: 20, maxPp: 20, priority: 0, category: 'status', description: 'The user vigorously performs a mystic, powerful dance that raises its Attack and Speed stats.' },
  'bulk-up': { name: 'Bulk Up', type: 'fighting', power: 0, accuracy: 100, pp: 20, maxPp: 20, priority: 0, category: 'status', description: 'The user tenses its muscles to bulk up its body, raising both its Attack and Defense stats.' },
  'roost': { name: 'Roost', type: 'flying', power: 0, accuracy: 100, pp: 10, maxPp: 10, priority: 0, category: 'status', description: 'The user lands and rests its body. It restores the user\'s HP by up to half of its max HP.' },
  'recover': { name: 'Recover', type: 'normal', power: 0, accuracy: 100, pp: 10, maxPp: 10, priority: 0, category: 'status', description: 'Restoring its own cells, the user restores its own HP by half of its max HP.' },

  // Additional Special Attacks
  'scald': { name: 'Scald', type: 'water', power: 80, accuracy: 100, pp: 15, maxPp: 15, priority: 0, category: 'special', description: 'The user shoots boiling hot water at its target. This may also leave the target with a burn.' },
  'ice-shard': { name: 'Ice Shard', type: 'ice', power: 40, accuracy: 100, pp: 30, maxPp: 30, priority: 1, category: 'physical', description: 'The user flash-freezes chunks of ice and hurls them at the target. This move always goes first.' },
  'aqua-jet': { name: 'Aqua Jet', type: 'water', power: 40, accuracy: 100, pp: 20, maxPp: 20, priority: 1, category: 'physical', description: 'The user lunges at the target at a speed that makes it almost invisible. This move always goes first.' },
  'bullet-punch': { name: 'Bullet Punch', type: 'steel', power: 40, accuracy: 100, pp: 30, maxPp: 30, priority: 1, category: 'physical', description: 'The user strikes the target with tough punches as fast as bullets. This move always goes first.' },
  'extremespeed': { name: 'Extreme Speed', type: 'normal', power: 80, accuracy: 100, pp: 5, maxPp: 5, priority: 2, category: 'physical', description: 'The user charges the target at blinding speed. This move has a high priority.' },
  'sucker-punch': { name: 'Sucker Punch', type: 'dark', power: 70, accuracy: 100, pp: 5, maxPp: 5, priority: 1, category: 'physical', description: 'This move enables the user to attack first. This move fails if the target is not readying an attack.' },

  // More Powerful Attacks
  'draco-meteor': { name: 'Draco Meteor', type: 'dragon', power: 130, accuracy: 90, pp: 5, maxPp: 5, priority: 0, category: 'special', description: 'Comets are summoned down from the sky onto the target. The attack\'s recoil harshly lowers the user\'s Sp. Atk stat.' },
  'leaf-storm': { name: 'Leaf Storm', type: 'grass', power: 130, accuracy: 90, pp: 5, maxPp: 5, priority: 0, category: 'special', description: 'The user whips up a storm of leaves around the target. The attack\'s recoil harshly lowers the user\'s Sp. Atk stat.' },
  'overheat': { name: 'Overheat', type: 'fire', power: 130, accuracy: 90, pp: 5, maxPp: 5, priority: 0, category: 'special', description: 'The user attacks the target at full power. The attack\'s recoil harshly lowers the user\'s Sp. Atk stat.' },
  'superpower': { name: 'Superpower', type: 'fighting', power: 120, accuracy: 100, pp: 5, maxPp: 5, priority: 0, category: 'physical', description: 'The user attacks the target with great power. However, this also lowers the user\'s Attack and Defense stats.' },
  'wood-hammer': { name: 'Wood Hammer', type: 'grass', power: 120, accuracy: 100, pp: 15, maxPp: 15, priority: 0, category: 'physical', description: 'The user slams its rugged body into the target to attack. This also damages the user quite a lot.' },
  'wild-charge': { name: 'Wild Charge', type: 'electric', power: 90, accuracy: 100, pp: 15, maxPp: 15, priority: 0, category: 'physical', description: 'The user shrouds itself in electricity and smashes into its target. This also damages the user a little.' },
  'flare-blitz': { name: 'Flare Blitz', type: 'fire', power: 120, accuracy: 100, pp: 15, maxPp: 15, priority: 0, category: 'physical', description: 'The user cloaks itself in fire and charges the target. This also damages the user quite a lot.' },
  'head-smash': { name: 'Head Smash', type: 'rock', power: 150, accuracy: 80, pp: 5, maxPp: 5, priority: 0, category: 'physical', description: 'The user attacks the target with a hazardous full-power headbutt. This also damages the user terribly.' },

  // More Utility and Status Moves
  'stealth-rock': { name: 'Stealth Rock', type: 'rock', power: 0, accuracy: 100, pp: 20, maxPp: 20, priority: 0, category: 'status', description: 'The user lays a trap of levitating stones around the opposing team. The trap hurts opposing Pokémon that switch into battle.' },
  'spikes': { name: 'Spikes', type: 'ground', power: 0, accuracy: 100, pp: 20, maxPp: 20, priority: 0, category: 'status', description: 'The user lays a trap of spikes at the opposing team\'s feet. The trap hurts Pokémon that switch into battle.' },
  'leech-seed': { name: 'Leech Seed', type: 'grass', power: 0, accuracy: 90, pp: 10, maxPp: 10, priority: 0, category: 'status', description: 'A seed is planted on the target. It steals some HP from the target every turn.' },
  'protect': { name: 'Protect', type: 'normal', power: 0, accuracy: 100, pp: 10, maxPp: 10, priority: 4, category: 'status', description: 'Enables the user to evade all attacks. Its chance of failing rises if it is used in succession.' },
  'substitute': { name: 'Substitute', type: 'normal', power: 0, accuracy: 100, pp: 10, maxPp: 10, priority: 0, category: 'status', description: 'The user makes a copy of itself using some of its HP. The copy serves as the user\'s decoy.' },
  'taunt': { name: 'Taunt', type: 'dark', power: 0, accuracy: 100, pp: 20, maxPp: 20, priority: 0, category: 'status', description: 'The target is taunted into a rage that allows it to use only attack moves for three turns.' },
  'reflect': { name: 'Reflect', type: 'psychic', power: 0, accuracy: 100, pp: 20, maxPp: 20, priority: 0, category: 'status', description: 'A wondrous wall of light is put up to reduce damage from physical attacks for five turns.' },
  'light-screen': { name: 'Light Screen', type: 'psychic', power: 0, accuracy: 100, pp: 30, maxPp: 30, priority: 0, category: 'status', description: 'A wondrous wall of light is put up to reduce damage from special attacks for five turns.' },

  // More Type Coverage Moves
  'lava-plume': { name: 'Lava Plume', type: 'fire', power: 80, accuracy: 100, pp: 15, maxPp: 15, priority: 0, category: 'special', description: 'The user torches everything around it with an inferno of scarlet flames. This may also leave those hit with a burn.' },
  'discharge': { name: 'Discharge', type: 'electric', power: 80, accuracy: 100, pp: 15, maxPp: 15, priority: 0, category: 'special', description: 'The user strikes everything around it by letting loose a flare of electricity. This may also cause paralysis.' },
  'icicle-crash': { name: 'Icicle Crash', type: 'ice', power: 85, accuracy: 90, pp: 10, maxPp: 10, priority: 0, category: 'physical', description: 'The user attacks by harshly dropping large icicles onto the target. This may also make the target flinch.' },
  'cross-chop': { name: 'Cross Chop', type: 'fighting', power: 100, accuracy: 80, pp: 5, maxPp: 5, priority: 0, category: 'physical', description: 'The user delivers a double chop with its forearms crossed. Critical hits land more easily.' },
  'megahorn': { name: 'Megahorn', type: 'bug', power: 120, accuracy: 85, pp: 10, maxPp: 10, priority: 0, category: 'physical', description: 'Using its tough and impressive horn, the user rams into the target with no letup.' },
  'meteor-mash': { name: 'Meteor Mash', type: 'steel', power: 90, accuracy: 90, pp: 10, maxPp: 10, priority: 0, category: 'physical', description: 'The target is hit with a hard punch fired like a meteor. This may also raise the user\'s Attack stat.' },
  'moonlight': { name: 'Moonlight', type: 'fairy', power: 0, accuracy: 100, pp: 5, maxPp: 5, priority: 0, category: 'status', description: 'The user restores its own HP. The amount of HP regained varies with the weather.' },
  'spirit-break': { name: 'Spirit Break', type: 'fairy', power: 75, accuracy: 100, pp: 15, maxPp: 15, priority: 0, category: 'physical', description: 'The user attacks the target with so much force that it could break the target\'s spirit. This lowers the target\'s Sp. Atk stat.' },
  'phantom-force': { name: 'Phantom Force', type: 'ghost', power: 90, accuracy: 100, pp: 10, maxPp: 10, priority: 0, category: 'physical', description: 'The user vanishes somewhere, then strikes the target on the next turn. This move hits even if the target protects itself.' },
  'poltergeist': { name: 'Poltergeist', type: 'ghost', power: 110, accuracy: 90, pp: 5, maxPp: 5, priority: 0, category: 'physical', description: 'The user attacks the target by controlling the target\'s item. The move does nothing if the target doesn\'t have an item.' },
  'u-turn': { name: 'U-turn', type: 'bug', power: 70, accuracy: 100, pp: 20, maxPp: 20, priority: 0, category: 'physical', description: 'After making its attack, the user rushes back to switch places with a party Pokémon in waiting.' },
  'volt-switch': { name: 'Volt Switch', type: 'electric', power: 70, accuracy: 100, pp: 20, maxPp: 20, priority: 0, category: 'special', description: 'After making its attack, the user rushes back to switch places with a party Pokémon in waiting.' },
};

// --- ITEMS DATABASE ---
export const ITEMS: Record<string, Item> = {
  // Poke Balls
  'pokeball': { id: 'pokeball', name: 'Poké Ball', description: 'A device for catching wild Pokémon.', price: 200, category: 'ball' },
  'greatball': { id: 'greatball', name: 'Great Ball', description: 'A good Ball with a higher catch rate.', price: 600, category: 'ball' },
  'ultraball': { id: 'ultraball', name: 'Ultra Ball', description: 'An ultra-high performance Ball.', price: 1200, category: 'ball' },
  'masterball': { id: 'masterball', name: 'Master Ball', description: 'Catches any Pokémon without fail.', price: 99999, category: 'ball' },

  // Healing
  'potion': { id: 'potion', name: 'Potion', description: 'Restores 20 HP.', price: 300, category: 'medicine' },
  'superpotion': { id: 'superpotion', name: 'Super Potion', description: 'Restores 50 HP.', price: 700, category: 'medicine' },
  'hyperpotion': { id: 'hyperpotion', name: 'Hyper Potion', description: 'Restores 200 HP.', price: 1200, category: 'medicine' },
  'maxpotion': { id: 'maxpotion', name: 'Max Potion', description: 'Fully restores HP.', price: 2500, category: 'medicine' },
  'revive': { id: 'revive', name: 'Revive', description: 'Revives a fainted Pokémon with half HP.', price: 1500, category: 'medicine' },
  'maxrevive': { id: 'maxrevive', name: 'Max Revive', description: 'Revives a fainted Pokémon with full HP.', price: 4000, category: 'medicine' },
  'fullheal': { id: 'fullheal', name: 'Full Heal', description: 'Heals all status problems.', price: 600, category: 'status' },
  'rarecandy': { id: 'rarecandy', name: 'Rare Candy', description: 'Raises a Pokémon level by 1.', price: 4800, category: 'medicine' },

  // Vitamins (EV Training)
  'hpup': { id: 'hpup', name: 'HP Up', description: 'Increases HP EVs.', price: 9800, category: 'medicine' },
  'protein': { id: 'protein', name: 'Protein', description: 'Increases Attack EVs.', price: 9800, category: 'medicine' },
  'iron': { id: 'iron', name: 'Iron', description: 'Increases Defense EVs.', price: 9800, category: 'medicine' },
  'calcium': { id: 'calcium', name: 'Calcium', description: 'Increases Sp. Atk EVs.', price: 9800, category: 'medicine' },
  'zinc': { id: 'zinc', name: 'Zinc', description: 'Increases Sp. Def EVs.', price: 9800, category: 'medicine' },
  'carbos': { id: 'carbos', name: 'Carbos', description: 'Increases Speed EVs.', price: 9800, category: 'medicine' },

  // Battle Items
  'xattack': { id: 'xattack', name: 'X Attack', description: 'Sharply raises Attack in battle.', price: 1000, category: 'battle' },
  'xdefense': { id: 'xdefense', name: 'X Defense', description: 'Sharply raises Defense in battle.', price: 1000, category: 'battle' },
  'xspatk': { id: 'xspatk', name: 'X Sp. Atk', description: 'Sharply raises Sp. Atk in battle.', price: 1000, category: 'battle' },
  'xspdef': { id: 'xspdef', name: 'X Sp. Def', description: 'Sharply raises Sp. Def in battle.', price: 1000, category: 'battle' },
  'xspeed': { id: 'xspeed', name: 'X Speed', description: 'Sharply raises Speed in battle.', price: 1000, category: 'battle' },

  // Competitive Items
  'leftovers': { id: 'leftovers', name: 'Leftovers', description: 'Restores HP each turn.', price: 4000, category: 'battle' },
  'lifeorb': { id: 'lifeorb', name: 'Life Orb', description: 'Boosts attacks but hurts holder.', price: 4000, category: 'battle' },
  'choiceband': { id: 'choiceband', name: 'Choice Band', description: 'Boosts Atk but locks move.', price: 4000, category: 'battle' },
  'choicespecs': { id: 'choicespecs', name: 'Choice Specs', description: 'Boosts SpA but locks move.', price: 4000, category: 'battle' },
  'choicescarf': { id: 'choicescarf', name: 'Choice Scarf', description: 'Boosts Spe but locks move.', price: 4000, category: 'battle' },
  'assaultvest': { id: 'assaultvest', name: 'Assault Vest', description: 'Boosts SpD but prevents status moves.', price: 4000, category: 'battle' },
  'rockyhelmet': { id: 'rockyhelmet', name: 'Rocky Helmet', description: 'Hurts attackers on contact.', price: 4000, category: 'battle' },
  'focussash': { id: 'focussash', name: 'Focus Sash', description: 'Endures a one-hit KO.', price: 4000, category: 'battle' },
  'expertbelt': { id: 'expertbelt', name: 'Expert Belt', description: 'Boosts super effective moves.', price: 4000, category: 'battle' },

  // Evolution Stones
  'firestone': { id: 'firestone', name: 'Fire Stone', description: 'A stone used for evolution.', price: 2100, category: 'key' },
  'waterstone': { id: 'waterstone', name: 'Water Stone', description: 'A stone used for evolution.', price: 2100, category: 'key' },
  'thunderstone': { id: 'thunderstone', name: 'Thunder Stone', description: 'A stone used for evolution.', price: 2100, category: 'key' },
  'leafstone': { id: 'leafstone', name: 'Leaf Stone', description: 'A stone used for evolution.', price: 2100, category: 'key' },
  'moonstone': { id: 'moonstone', name: 'Moon Stone', description: 'A stone used for evolution.', price: 2100, category: 'key' },
  'sunstone': { id: 'sunstone', name: 'Sun Stone', description: 'A stone used for evolution.', price: 2100, category: 'key' },
  'duskstone': { id: 'duskstone', name: 'Dusk Stone', description: 'A stone used for evolution.', price: 2100, category: 'key' },
  'dawnstone': { id: 'dawnstone', name: 'Dawn Stone', description: 'A stone used for evolution.', price: 2100, category: 'key' },
  'icestone': { id: 'icestone', name: 'Ice Stone', description: 'A stone used for evolution.', price: 2100, category: 'key' },

  // Berries
  'oranberry': { id: 'oranberry', name: 'Oran Berry', description: 'Restores 10 HP.', price: 100, category: 'berry' },
  'sitrusberry': { id: 'sitrusberry', name: 'Sitrus Berry', description: 'Restores 25% HP.', price: 500, category: 'berry' },
  'lumberry': { id: 'lumberry', name: 'Lum Berry', description: 'Cures any status condition.', price: 600, category: 'berry' },
  'cheriberry': { id: 'cheriberry', name: 'Cheri Berry', description: 'Cures paralysis.', price: 200, category: 'berry' },
  'chestoberry': { id: 'chestoberry', name: 'Chesto Berry', description: 'Cures sleep.', price: 200, category: 'berry' },
  'pechaberry': { id: 'pechaberry', name: 'Pecha Berry', description: 'Cures poison.', price: 200, category: 'berry' },
  'charcoal': { id: 'charcoal', name: 'Charcoal', description: 'Boosts Fire-type moves.', price: 1000, category: 'battle' },
  'mysticwater': { id: 'mysticwater', name: 'Mystic Water', description: 'Boosts Water-type moves.', price: 1000, category: 'battle' },
  'magnet': { id: 'magnet', name: 'Magnet', description: 'Boosts Electric-type moves.', price: 1000, category: 'battle' },
  'miracleseed': { id: 'miracleseed', name: 'Miracle Seed', description: 'Boosts Grass-type moves.', price: 1000, category: 'battle' },
};
// ... (Regions remains same)
export const REGIONS: Region[] = [
  {
    id: 'kanto',
    name: 'Kanto',
    generation: 1,
    idRange: [1, 151],
    routes: Array.from({ length: 25 }, (_, i) => i + 1),
    gyms: [
      { id: 'gym_pewter', name: 'Pewter Gym', leaderName: 'Brock', badge: 'Boulder', requiredLevel: 10, type: 'rock', pokemon: [74, 95] },
      { id: 'gym_cerulean', name: 'Cerulean Gym', leaderName: 'Misty', badge: 'Cascade', requiredLevel: 18, type: 'water', pokemon: [120, 121] },
      { id: 'gym_vermilion', name: 'Vermilion Gym', leaderName: 'Lt. Surge', badge: 'Thunder', requiredLevel: 24, type: 'electric', pokemon: [25, 26, 100] },
      { id: 'gym_celadon', name: 'Celadon Gym', leaderName: 'Erika', badge: 'Rainbow', requiredLevel: 29, type: 'grass', pokemon: [71, 114, 45] },
      { id: 'gym_fuchsia', name: 'Fuchsia Gym', leaderName: 'Koga', badge: 'Soul', requiredLevel: 35, type: 'poison', pokemon: [109, 89, 110] },
      { id: 'gym_saffron', name: 'Saffron Gym', leaderName: 'Sabrina', badge: 'Marsh', requiredLevel: 40, type: 'psychic', pokemon: [64, 122, 65] },
      { id: 'gym_cinnabar', name: 'Cinnabar Gym', leaderName: 'Blaine', badge: 'Volcano', requiredLevel: 45, type: 'fire', pokemon: [59, 78, 126] },
      { id: 'gym_viridian', name: 'Viridian Gym', leaderName: 'Giovanni', badge: 'Earth', requiredLevel: 50, type: 'ground', pokemon: [111, 112, 31, 34] },
    ]
  },
  {
    id: 'johto',
    name: 'Johto',
    generation: 2,
    idRange: [152, 251],
    routes: Array.from({ length: 18 }, (_, i) => i + 29),
    gyms: [
      { id: 'gym_violet', name: 'Violet Gym', leaderName: 'Falkner', badge: 'Zephyr', requiredLevel: 10, type: 'flying', pokemon: [16, 17] },
      { id: 'gym_azalea', name: 'Azalea Gym', leaderName: 'Bugsy', badge: 'Hive', requiredLevel: 16, type: 'bug', pokemon: [11, 14, 123] },
      { id: 'gym_goldenrod', name: 'Goldenrod Gym', leaderName: 'Whitney', badge: 'Plain', requiredLevel: 20, type: 'normal', pokemon: [35, 241] },
      { id: 'gym_ecruteak', name: 'Ecruteak Gym', leaderName: 'Morty', badge: 'Fog', requiredLevel: 25, type: 'ghost', pokemon: [92, 93, 94] },
      { id: 'gym_cianwood', name: 'Cianwood Gym', leaderName: 'Chuck', badge: 'Storm', requiredLevel: 30, type: 'fighting', pokemon: [57, 62] },
      { id: 'gym_olivine', name: 'Olivine Gym', leaderName: 'Jasmine', badge: 'Mineral', requiredLevel: 35, type: 'steel', pokemon: [81, 82, 208] },
      { id: 'gym_mahogany', name: 'Mahogany Gym', leaderName: 'Pryce', badge: 'Glacier', requiredLevel: 40, type: 'ice', pokemon: [86, 87, 221] },
      { id: 'gym_blackthorn', name: 'Blackthorn Gym', leaderName: 'Clair', badge: 'Rising', requiredLevel: 45, type: 'dragon', pokemon: [148, 148, 230] },
    ]
  },
  {
    id: 'hoenn',
    name: 'Hoenn',
    generation: 3,
    idRange: [252, 386],
    routes: Array.from({ length: 34 }, (_, i) => i + 101),
    gyms: [
      { id: 'gym_rustboro', name: 'Rustboro Gym', leaderName: 'Roxanne', badge: 'Stone', requiredLevel: 14, type: 'rock', pokemon: [74, 299] },
      { id: 'gym_dewford', name: 'Dewford Gym', leaderName: 'Brawly', badge: 'Knuckle', requiredLevel: 18, type: 'fighting', pokemon: [66, 307] },
      { id: 'gym_mauville', name: 'Mauville Gym', leaderName: 'Wattson', badge: 'Dynamo', requiredLevel: 24, type: 'electric', pokemon: [100, 309, 310] },
      { id: 'gym_lavaridge', name: 'Lavaridge Gym', leaderName: 'Flannery', badge: 'Heat', requiredLevel: 29, type: 'fire', pokemon: [218, 322, 323] },
      { id: 'gym_petalburg', name: 'Petalburg Gym', leaderName: 'Norman', badge: 'Balance', requiredLevel: 31, type: 'normal', pokemon: [287, 288, 289] },
      { id: 'gym_fortree', name: 'Fortree Gym', leaderName: 'Winona', badge: 'Feather', requiredLevel: 35, type: 'flying', pokemon: [277, 279, 334] },
      { id: 'gym_mossdeep', name: 'Mossdeep Gym', leaderName: 'Tate & Liza', badge: 'Mind', requiredLevel: 42, type: 'psychic', pokemon: [337, 338] },
      { id: 'gym_sootopolis', name: 'Sootopolis Gym', leaderName: 'Wallace', badge: 'Rain', requiredLevel: 46, type: 'water', pokemon: [370, 340, 350] },
    ]
  },
  {
    id: 'sinnoh',
    name: 'Sinnoh',
    generation: 4,
    idRange: [387, 493],
    routes: Array.from({ length: 30 }, (_, i) => i + 201),
    gyms: [
      { id: 'gym_oreburgh', name: 'Oreburgh Gym', leaderName: 'Roark', badge: 'Coal', requiredLevel: 14, type: 'rock', pokemon: [74, 95, 408] },
      { id: 'gym_eterna', name: 'Eterna Gym', leaderName: 'Gardenia', badge: 'Forest', requiredLevel: 22, type: 'grass', pokemon: [387, 407, 420] },
      { id: 'gym_veilstone', name: 'Veilstone Gym', leaderName: 'Maylene', badge: 'Cobble', requiredLevel: 30, type: 'fighting', pokemon: [308, 67, 448] },
      { id: 'gym_pastoria', name: 'Pastoria Gym', leaderName: 'Wake', badge: 'Fen', requiredLevel: 34, type: 'water', pokemon: [130, 195, 419] },
      { id: 'gym_hearthome', name: 'Hearthome Gym', leaderName: 'Fantina', badge: 'Relic', requiredLevel: 37, type: 'ghost', pokemon: [425, 93, 429] },
      { id: 'gym_canalave', name: 'Canalave Gym', leaderName: 'Byron', badge: 'Mine', requiredLevel: 41, type: 'steel', pokemon: [82, 208, 411] },
      { id: 'gym_snowpoint', name: 'Snowpoint Gym', leaderName: 'Candice', badge: 'Icicle', requiredLevel: 44, type: 'ice', pokemon: [215, 460, 473] },
      { id: 'gym_sunyshore', name: 'Sunyshore Gym', leaderName: 'Volkner', badge: 'Beacon', requiredLevel: 50, type: 'electric', pokemon: [405, 135, 466] },
    ]
  },
  {
    id: 'unova',
    name: 'Unova',
    generation: 5,
    idRange: [494, 649],
    routes: Array.from({ length: 18 }, (_, i) => i + 1),
    gyms: [
      { id: 'gym_striaton', name: 'Striaton Gym', leaderName: 'Cilan', badge: 'Trio', requiredLevel: 12, type: 'grass', pokemon: [511, 513, 515] },
      { id: 'gym_nacrene', name: 'Nacrene Gym', leaderName: 'Lenora', badge: 'Basic', requiredLevel: 18, type: 'normal', pokemon: [506, 504] },
      { id: 'gym_castelia', name: 'Castelia Gym', leaderName: 'Burgh', badge: 'Insect', requiredLevel: 23, type: 'bug', pokemon: [543, 557, 542] },
      { id: 'gym_nimbasa', name: 'Nimbasa Gym', leaderName: 'Elesa', badge: 'Bolt', requiredLevel: 27, type: 'electric', pokemon: [587, 523] },
      { id: 'gym_driftveil', name: 'Driftveil Gym', leaderName: 'Clay', badge: 'Quake', requiredLevel: 31, type: 'ground', pokemon: [536, 530] },
      { id: 'gym_mistralton', name: 'Mistralton Gym', leaderName: 'Skyla', badge: 'Jet', requiredLevel: 35, type: 'flying', pokemon: [528, 581] },
      { id: 'gym_icirrus', name: 'Icirrus Gym', leaderName: 'Brycen', badge: 'Freeze', requiredLevel: 39, type: 'ice', pokemon: [614, 615] },
      { id: 'gym_opelucid', name: 'Opelucid Gym', leaderName: 'Drayden', badge: 'Legend', requiredLevel: 43, type: 'dragon', pokemon: [612, 621] },
    ]
  },
  {
    id: 'kalos',
    name: 'Kalos',
    generation: 6,
    idRange: [650, 721],
    routes: Array.from({ length: 22 }, (_, i) => i + 1),
    gyms: [
      { id: 'gym_santalune', name: 'Santalune Gym', leaderName: 'Viola', badge: 'Bug', requiredLevel: 12, type: 'bug', pokemon: [664, 666] },
      { id: 'gym_cyllage', name: 'Cyllage Gym', leaderName: 'Grant', badge: 'Cliff', requiredLevel: 25, type: 'rock', pokemon: [698, 696] },
      { id: 'gym_shalour', name: 'Shalour Gym', leaderName: 'Korrina', badge: 'Rumble', requiredLevel: 32, type: 'fighting', pokemon: [619, 674, 701] },
      { id: 'gym_coumarine', name: 'Coumarine Gym', leaderName: 'Ramos', badge: 'Plant', requiredLevel: 34, type: 'grass', pokemon: [189, 711, 673] },
      { id: 'gym_lumiose', name: 'Lumiose Gym', leaderName: 'Clemont', badge: 'Voltage', requiredLevel: 37, type: 'electric', pokemon: [587, 82, 695] },
      { id: 'gym_laverre', name: 'Laverre Gym', leaderName: 'Valerie', badge: 'Fairy', requiredLevel: 42, type: 'fairy', pokemon: [303, 122, 700] },
      { id: 'gym_anistar', name: 'Anistar Gym', leaderName: 'Olympia', badge: 'Psychic', requiredLevel: 48, type: 'psychic', pokemon: [678, 678, 579] },
      { id: 'gym_snowbelle', name: 'Snowbelle Gym', leaderName: 'Wulfric', badge: 'Iceberg', requiredLevel: 59, type: 'ice', pokemon: [460, 615, 713] },
    ]
  },
  {
    id: 'alola',
    name: 'Alola',
    generation: 7,
    idRange: [722, 809],
    routes: [1, 2, 3, 4, 5, 6, 7, 8],
    gyms: [
      { id: 'gym_iliima', name: 'Verdant Trial', leaderName: 'Ilima', badge: 'Normal Z', requiredLevel: 12, type: 'normal', pokemon: [734, 735] },
      { id: 'gym_hala', name: 'Melemele Grand Trial', leaderName: 'Hala', badge: 'Fight Z', requiredLevel: 16, type: 'fighting', pokemon: [56, 296, 740] },
      { id: 'gym_lana', name: 'Brooklet Hill', leaderName: 'Lana', badge: 'Water Z', requiredLevel: 20, type: 'water', pokemon: [746, 751] },
      { id: 'gym_kiawe', name: 'Wela Volcano', leaderName: 'Kiawe', badge: 'Fire Z', requiredLevel: 22, type: 'fire', pokemon: [58, 757, 758] },
      { id: 'gym_mallow', name: 'Lush Jungle', leaderName: 'Mallow', badge: 'Grass Z', requiredLevel: 24, type: 'grass', pokemon: [753, 761, 755] },
      { id: 'gym_olivia', name: 'Akala Grand Trial', leaderName: 'Olivia', badge: 'Rock Z', requiredLevel: 28, type: 'rock', pokemon: [299, 525, 745] },
      { id: 'gym_sophocles', name: 'Mount Hokulani', leaderName: 'Sophocles', badge: 'Electric Z', requiredLevel: 33, type: 'electric', pokemon: [737, 777, 184] },
      { id: 'gym_acerola', name: 'Thrifty Megamart', leaderName: 'Acerola', badge: 'Ghost Z', requiredLevel: 35, type: 'ghost', pokemon: [93, 200, 778] },
    ]
  },
  {
    id: 'galar',
    name: 'Galar',
    generation: 8,
    idRange: [810, 905],
    routes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    gyms: [
      { id: 'gym_turffield', name: 'Turffield Gym', leaderName: 'Milo', badge: 'Grass', requiredLevel: 20, type: 'grass', pokemon: [829, 830] },
      { id: 'gym_hulbury', name: 'Hulbury Gym', leaderName: 'Nessa', badge: 'Water', requiredLevel: 24, type: 'water', pokemon: [118, 833, 834] },
      { id: 'gym_motostoke', name: 'Motostoke Gym', leaderName: 'Kabu', badge: 'Fire', requiredLevel: 27, type: 'fire', pokemon: [38, 324, 851] },
      { id: 'gym_stow', name: 'Stow-on-Side Gym', leaderName: 'Bea', badge: 'Fighting', requiredLevel: 36, type: 'fighting', pokemon: [237, 760, 866, 68] },
      { id: 'gym_ballonlea', name: 'Ballonlea Gym', leaderName: 'Opal', badge: 'Fairy', requiredLevel: 38, type: 'fairy', pokemon: [110, 282, 468, 858] },
      { id: 'gym_circhester', name: 'Circhester Gym', leaderName: 'Gordie', badge: 'Rock', requiredLevel: 42, type: 'rock', pokemon: [838, 213, 874, 839] },
      { id: 'gym_spikemuth', name: 'Spikemuth Gym', leaderName: 'Piers', badge: 'Dark', requiredLevel: 46, type: 'dark', pokemon: [559, 862, 435, 262] },
      { id: 'gym_hammerlocke', name: 'Hammerlocke Gym', leaderName: 'Raihan', badge: 'Dragon', requiredLevel: 48, type: 'dragon', pokemon: [329, 841, 884, 887] },
    ]
  },
  {
    id: 'paldea',
    name: 'Paldea',
    generation: 9,
    idRange: [906, 1025],
    routes: [1, 2, 3, 4, 5],
    gyms: [
      { id: 'gym_cortondo', name: 'Cortondo Gym', leaderName: 'Katy', badge: 'Bug', requiredLevel: 15, type: 'bug', pokemon: [917, 919] },
      { id: 'gym_artazon', name: 'Artazon Gym', leaderName: 'Brassius', badge: 'Grass', requiredLevel: 17, type: 'grass', pokemon: [928, 185] },
      { id: 'gym_levincia', name: 'Levincia Gym', leaderName: 'Iono', badge: 'Electric', requiredLevel: 24, type: 'electric', pokemon: [938, 405, 939, 935] },
      { id: 'gym_cascarrafa', name: 'Cascarrafa Gym', leaderName: 'Kofu', badge: 'Water', requiredLevel: 30, type: 'water', pokemon: [976, 963, 977] },
      { id: 'gym_medali', name: 'Medali Gym', leaderName: 'Larry', badge: 'Normal', requiredLevel: 36, type: 'normal', pokemon: [775, 206, 973] },
      { id: 'gym_montenevera', name: 'Montenevera Gym', leaderName: 'Ryme', badge: 'Ghost', requiredLevel: 42, type: 'ghost', pokemon: [354, 778, 979, 972] },
      { id: 'gym_alfornada', name: 'Alfornada Gym', leaderName: 'Tulip', badge: 'Psychic', requiredLevel: 45, type: 'psychic', pokemon: [981, 282, 959, 671] },
      { id: 'gym_glaseado', name: 'Glaseado Gym', leaderName: 'Grusha', badge: 'Ice', requiredLevel: 48, type: 'ice', pokemon: [968, 614, 975, 974] },
    ]
  }
];

export const TYPE_CHART: Record<PokemonType, Partial<Record<PokemonType, number>>> = {
  fire: { grass: 2, ice: 2, bug: 2, steel: 2, fire: 0.5, water: 0.5, rock: 0.5, dragon: 0.5 },
  water: { fire: 2, ground: 2, rock: 2, water: 0.5, grass: 0.5, dragon: 0.5 },
  grass: { water: 2, ground: 2, rock: 2, fire: 0.5, grass: 0.5, poison: 0.5, flying: 0.5, bug: 0.5, dragon: 0.5, steel: 0.5 },
  electric: { water: 2, flying: 2, electric: 0.5, grass: 0.5, dragon: 0.5, ground: 0 },
  normal: { rock: 0.5, steel: 0.5, ghost: 0 },
  ice: { grass: 2, ground: 2, flying: 2, dragon: 2, fire: 0.5, water: 0.5, ice: 0.5, steel: 0.5 },
  fighting: { normal: 2, ice: 2, rock: 2, dark: 2, steel: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, fairy: 0.5, ghost: 0 },
  poison: { grass: 2, fairy: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0 },
  ground: { fire: 2, electric: 2, poison: 2, rock: 2, steel: 2, grass: 0.5, bug: 0.5, flying: 0 },
  flying: { grass: 2, fighting: 2, bug: 2, electric: 0.5, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, steel: 0.5, dark: 0 },
  bug: { grass: 2, psychic: 2, dark: 2, fire: 0.5, fighting: 0.5, poison: 0.5, flying: 0.5, ghost: 0.5, steel: 0.5, fairy: 0.5 },
  rock: { fire: 2, ice: 2, flying: 2, bug: 2, fighting: 0.5, ground: 0.5, steel: 0.5 },
  ghost: { psychic: 2, ghost: 2, dark: 0.5, normal: 0 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  steel: { ice: 2, rock: 2, fairy: 2, fire: 0.5, water: 0.5, electric: 0.5, steel: 0.5 },
  fairy: { fighting: 2, dragon: 2, dark: 2, fire: 0.5, poison: 0.5, steel: 0.5 },
  dark: { fighting: 0.5, dark: 0.5, fairy: 0.5, ghost: 2, psychic: 2 },
};

export const getEffectiveness = (moveType: PokemonType, targetTypes: PokemonType[]): number => {
  let multiplier = 1;
  const attacker = TYPE_CHART[moveType] || {};
  targetTypes.forEach(t => {
    if (attacker[t] !== undefined) {
      multiplier *= attacker[t]!;
    } else {
      multiplier *= 1;
    }
  });
  return multiplier;
};
