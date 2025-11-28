# 🎮 PokéQuest: Dex & RPG

A fully mobile-friendly Pokémon experience featuring a comprehensive Pokédex and an offline-ready RPG mode with battles, catching, and team building.

## ✨ Features

### 📚 Pokédex
- **Complete Database**: Browse all Pokémon from Generations 1-9 (1025 Pokémon)
- **Detailed Information**: View stats, types, abilities, and evolution chains
- **Advanced Filtering**: Filter by type, generation, name, and more
- **Beautiful UI**: Clean, responsive design that works on all devices

### ⚔️ RPG Mode
- **Battle System**: Turn-based battles with type effectiveness and strategic depth
- **Catch Pokémon**: Build your collection with various Poké Balls
- **Team Building**: Create your dream team of up to 6 Pokémon
- **PC Box Storage**: Store unlimited Pokémon in your box
- **Gym Battles**: Challenge gym leaders across all 9 regions
- **Wild Encounters**: Encounter Pokémon on routes throughout each region
- **Item Shop**: Purchase healing items, Poké Balls, and battle items
- **Nature System**: 25 different natures affecting stats
- **Move Database**: 80+ moves with various types, powers, and effects
- **Level System**: Train your Pokémon and watch them grow stronger

### 🎯 Game Features
- **Offline Support**: Play anywhere, no internet required after initial load
- **Save System**: Your progress is automatically saved locally
- **Mobile Optimized**: Fully responsive design for phones and tablets
- **Type Chart**: Complete type effectiveness system
- **Status Effects**: Paralysis, burn, poison, and more
- **Stat Calculation**: Accurate stat formulas matching official games

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pokequest-dex-rpg.git
cd pokequest-dex-rpg
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## 🎮 How to Play

### Starting Your Journey
1. Select **RPG Mode** from the home screen
2. Choose your starting region
3. Receive your first Pokémon
4. Begin your adventure!

### Catching Pokémon
- Navigate to different routes to encounter wild Pokémon
- Weaken them in battle for better catch rates
- Use different Poké Balls (better balls = higher catch rate)
- Build your collection!

### Battling
- Choose from 4 moves in battle
- Consider type effectiveness (super effective = 2x damage, not very effective = 0.5x)
- Manage your PP (Power Points) - each move has limited uses
- Use items to heal or boost your Pokémon

### Team Management
- Maximum 6 Pokémon in your active party
- Store extras in your PC Box
- Swap Pokémon between party and box anytime
- Check stats, moves, and nature

### Gym Challenges
- Each region has 8 gyms
- Gym leaders use stronger Pokémon
- Earn badges by defeating gym leaders
- Unlock higher level content

## 🛠️ Tech Stack

- **React** - UI framework
- **TypeScript** - Type safety and better DX
- **Vite** - Fast build tool and dev server
- **Zustand** - State management
- **PokéAPI** - Pokémon data source
- **CSS3** - Styling and animations

## 📁 Project Structure

```
pokéquest-dex-rpg/
├── components/          # React components
│   ├── Home.tsx        # Landing page
│   ├── Pokedex.tsx     # Pokédex browser
│   ├── Game.tsx        # RPG game mode
│   ├── Team.tsx        # Team management
│   ├── Shop.tsx        # Item shop
│   ├── Bag.tsx         # Inventory
│   └── ...
├── constants.ts        # Game data (moves, items, regions)
├── store.ts           # Zustand state management
├── types.ts           # TypeScript type definitions
└── services/          # API services
    └── pokeapi.ts     # PokéAPI integration
```

## 🎯 Game Data

### Regions Available
- Kanto (Gen 1)
- Johto (Gen 2)
- Hoenn (Gen 3)
- Sinnoh (Gen 4)
- Unova (Gen 5)
- Kalos (Gen 6)
- Alola (Gen 7)
- Galar (Gen 8)
- Paldea (Gen 9)

### Item Categories
- **Poké Balls**: Pokéball, Great Ball, Ultra Ball, Master Ball
- **Medicine**: Potions, Revives, Full Heals
- **Battle Items**: X Attack, X Defense, Choice items
- **Evolution Stones**: Fire, Water, Thunder, Leaf, Moon, etc.
- **Berries**: Healing and status cure berries

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Pokémon data from [PokéAPI](https://pokeapi.co/)
- Pokémon is © of Nintendo, Game Freak, and The Pokémon Company
- This is a fan-made project, not affiliated with or endorsed by Nintendo

## 📧 Contact

For questions or feedback, feel free to open an issue on GitHub.

---

**Enjoy your Pokémon adventure! Gotta catch 'em all! 🎯**
