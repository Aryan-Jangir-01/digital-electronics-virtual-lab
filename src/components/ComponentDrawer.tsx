import React, { useState } from 'react';
import { COMPONENT_CATALOG } from '../data/componentCatalog';
import type { ComponentCategory } from '../types/circuit';
import {
  Search,
  X,
  Zap,
  Cpu,
  Layers,
  Repeat,
  Lightbulb,
  Boxes,
  Plus
} from 'lucide-react';
import { soundEngine } from '../engine/audio';

interface ComponentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddComponent: (type: string) => void;
}

const CATEGORIES: { id: ComponentCategory; name: string; icon: any }[] = [
  { id: 'inputs', name: 'Inputs', icon: Zap },
  { id: 'gates', name: 'Gates', icon: Cpu },
  { id: 'combinational', name: 'Combinational', icon: Layers },
  { id: 'sequential', name: 'Sequential', icon: Repeat },
  { id: 'outputs', name: 'Outputs', icon: Lightbulb },
  { id: 'chips74', name: '74-ICs', icon: Boxes },
];

export const ComponentDrawer: React.FC<ComponentDrawerProps> = ({
  isOpen,
  onClose,
  onAddComponent
}) => {
  const [activeCategory, setActiveCategory] = useState<ComponentCategory>('inputs');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const allComponents = Object.values(COMPONENT_CATALOG);

  const filteredComponents = allComponents.filter((comp) => {
    const matchesSearch =
      comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (comp.icNumber && comp.icNumber.includes(searchQuery));

    if (searchQuery.trim()) {
      return matchesSearch;
    }
    return comp.category === activeCategory;
  });

  const handleSelect = (type: string) => {
    soundEngine.vibrate(20);
    soundEngine.playClick(true);
    onAddComponent(type);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center sm:items-center bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Card */}
      <div className="relative w-full sm:max-w-2xl max-h-[85vh] sm:max-h-[80vh] bg-slate-900 border-t sm:border border-slate-800 rounded-t-2xl sm:rounded-2xl flex flex-col shadow-2xl z-10 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Boxes className="w-5 h-5 text-sky-400" />
            <h2 className="font-bold text-base sm:text-lg text-white">Add Components ("Sare Component")</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-4 pt-3 pb-2">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3" />
            <input
              type="text"
              placeholder="Search gates, ICs (7400), switches, LEDs, adders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs (Scrollable on small mobile screens) */}
        {!searchQuery && (
          <div className="flex items-center gap-1.5 px-4 py-2 overflow-x-auto no-scrollbar border-b border-slate-800/80">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    soundEngine.vibrate(10);
                    setActiveCategory(cat.id);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                      : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cat.name}
                </button>
              );
            })}
          </div>
        )}

        {/* Component Grid */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {filteredComponents.map((comp) => (
            <div
              key={comp.type}
              onClick={() => handleSelect(comp.type)}
              className="bg-slate-950/70 hover:bg-slate-800/80 active:bg-slate-800 border border-slate-800 hover:border-sky-500/50 rounded-xl p-3 flex items-start justify-between gap-3 cursor-pointer transition-all group shadow-sm active:scale-[0.98]"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-slate-100 group-hover:text-sky-400 transition-colors truncate">
                    {comp.name}
                  </span>
                  {comp.icNumber && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      DIP-{comp.pins.length}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {comp.description}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-mono text-slate-500">
                    {comp.pins.filter(p => p.type === 'input').length} In / {comp.pins.filter(p => p.type === 'output').length} Out
                  </span>
                </div>
              </div>

              <button className="p-2 rounded-lg bg-slate-900 group-hover:bg-sky-500 text-slate-400 group-hover:text-white transition-colors shrink-0">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ))}

          {filteredComponents.length === 0 && (
            <div className="col-span-full py-8 text-center text-slate-500 text-sm">
              No components matching "{searchQuery}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
