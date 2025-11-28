
import React from 'react';
import { useStore } from '../store';
import { Button } from './Shared';
import { Trash2, AlertTriangle, X } from 'lucide-react';

export const Settings = ({ onClose }: { onClose: () => void }) => {
  const store = useStore();

  const handleReset = () => {
    if (confirm("WARNING: This will delete ALL your progress, caught Pokémon, and items. Are you sure?")) {
      store.resetSave();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden">
        <div className="bg-gray-100 p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="font-bold text-lg text-gray-800">Settings</h2>
            <button onClick={onClose}><X /></button>
        </div>
        
        <div className="p-6 space-y-6">
            <div className="space-y-2">
                <h3 className="font-bold text-gray-700">Save Data</h3>
                <p className="text-xs text-gray-500">
                    Your game is automatically saved to your browser's local storage.
                </p>
                <Button 
                    variant="danger" 
                    className="w-full flex items-center justify-center gap-2 bg-red-100 text-red-600 border border-red-200 hover:bg-red-200"
                    onClick={handleReset}
                >
                    <Trash2 size={16} /> Reset All Progress
                </Button>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg flex items-start gap-3">
                <AlertTriangle className="text-blue-500 shrink-0" size={20} />
                <div className="text-xs text-blue-800">
                    <strong>Note:</strong> Clearing your browser cache will remove your save data.
                </div>
            </div>
        </div>
        
        <div className="p-4 bg-gray-50 text-center text-xs text-gray-400">
            Version 4.2.0 • Saranda League
        </div>
      </div>
    </div>
  );
};
