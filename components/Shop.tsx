import React from 'react';
import { useStore } from '../store';
import { ITEMS } from '../constants';
import { Button } from './Shared';
import { Coins, ShoppingBag } from 'lucide-react';

export const Shop = () => {
  const store = useStore();
  const shopItems = Object.values(ITEMS);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="p-4 bg-white shadow-sm flex justify-between items-center">
          <div className="font-bold text-lg flex items-center gap-2"><ShoppingBag size={20}/> PokéMart</div>
          <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-mono font-bold text-sm flex items-center gap-1">
              <Coins size={14} /> ${store.player.money}
          </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
         {shopItems.map(item => (
             <div key={item.id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
                 <div className="flex-1">
                     <div className="font-bold text-sm">{item.name}</div>
                     <div className="text-xs text-gray-500 line-clamp-1">{item.description}</div>
                     <div className="text-xs font-bold text-blue-600 mt-1">${item.price}</div>
                 </div>
                 <div className="flex flex-col gap-2">
                     <Button variant="primary" className="text-xs px-3 py-1" onClick={() => store.buyItem(item.id, 1)}>Buy</Button>
                     {store.player.items[item.id] > 0 && (
                         <Button variant="secondary" className="text-xs px-3 py-1 bg-red-100 text-red-600" onClick={() => store.sellItem(item.id, 1)}>
                             Sell (${Math.floor(item.price/2)})
                         </Button>
                     )}
                 </div>
             </div>
         ))}
      </div>
    </div>
  );
};