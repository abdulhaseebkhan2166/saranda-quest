import React from 'react';
import { clsx } from 'clsx';
import { TYPE_COLORS } from '../constants';
import { Pokemon, PokemonType } from '../types';

export const TypeBadge: React.FC<{ type: string }> = ({ type }) => {
  const color = TYPE_COLORS[type as PokemonType] || '#777';
  return (
    <span 
      className="px-2 py-0.5 rounded text-[10px] uppercase font-bold text-white shadow-sm tracking-wide"
      style={{ backgroundColor: color }}
    >
      {type}
    </span>
  );
};

export const Button = ({ children, onClick, variant = 'primary', className, disabled }: any) => {
  const base = "px-4 py-2 rounded-lg font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  const styles = {
    primary: "bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-500 text-white hover:bg-red-600",
    success: "bg-green-500 text-white hover:bg-green-600"
  };
  
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={clsx(base, styles[variant as keyof typeof styles], className)}
    >
      {children}
    </button>
  );
};

export const PokemonCard = ({ pokemon, onClick, showHp = false }: { pokemon: Pokemon, onClick?: () => void, showHp?: boolean }) => {
  const hpPercent = (pokemon.currentHp / pokemon.maxHp) * 100;
  const isFainted = pokemon.currentHp <= 0;
  
  // Status indicator
  let statusColor = null;
  if (pokemon.status === 'poison') statusColor = 'bg-purple-500';
  if (pokemon.status === 'burn') statusColor = 'bg-red-500';
  if (pokemon.status === 'paralysis') statusColor = 'bg-yellow-500';
  if (pokemon.status === 'sleep') statusColor = 'bg-gray-400';

  return (
    <div 
      onClick={onClick}
      className={clsx(
        "relative bg-white rounded-xl shadow-sm border border-gray-100 p-2 flex flex-col items-center cursor-pointer transition-transform hover:shadow-md",
        isFainted && "opacity-60 grayscale"
      )}
    >
      <div className="absolute top-1 left-2 text-xs font-bold text-gray-400">#{pokemon.id}</div>
      <img src={pokemon.sprite} alt={pokemon.name} className="w-20 h-20 object-contain pixelated" loading="lazy" />
      
      <div className="w-full text-center mt-1">
        <div className="font-bold text-sm capitalize truncate">{pokemon.name}</div>
        <div className="flex justify-center gap-1 mt-1">
          {pokemon.types.map(t => <TypeBadge key={t} type={t} />)}
        </div>
      </div>

      {showHp && (
        <div className="w-full mt-2 space-y-1">
          <div className="flex justify-between text-[10px] text-gray-500 font-bold">
            <span>Lv.{pokemon.level}</span>
            <span>{Math.floor(pokemon.currentHp)}/{pokemon.maxHp}</span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={clsx("h-full transition-all duration-500", 
                hpPercent > 50 ? "bg-green-500" : hpPercent > 20 ? "bg-yellow-500" : "bg-red-500"
              )}
              style={{ width: `${hpPercent}%` }}
            />
          </div>
          {pokemon.status && (
            <div className={clsx("text-[9px] text-white px-1 rounded text-center uppercase font-bold mt-1", statusColor)}>
              {pokemon.status}
            </div>
          )}
        </div>
      )}
    </div>
  );
};