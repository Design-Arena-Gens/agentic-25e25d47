'use client';

import React, { useState } from 'react';
import { nodeTypes, nodeCategories, NodeTypeConfig } from './nodes/nodeTypes';
import { ChevronDown, ChevronRight, Search, GripVertical } from 'lucide-react';

interface SidebarProps {
  onDragStart: (event: React.DragEvent, nodeType: NodeTypeConfig) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onDragStart }) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(nodeCategories);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const filteredNodes = nodeTypes.filter(
    (node) =>
      node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Triggers':
        return '⚡';
      case 'YouTube':
        return '▶️';
      case 'AI Processing':
        return '🤖';
      case 'Data Processing':
        return '⚙️';
      case 'Output':
        return '📤';
      default:
        return '📦';
    }
  };

  return (
    <div className="w-72 bg-n8n-surface/90 backdrop-blur-sm border-r border-white/10 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <h2 className="text-white font-bold text-lg flex items-center gap-2">
          <span className="text-2xl">🔧</span>
          Node Library
        </h2>
        <p className="text-gray-400 text-xs mt-1">Drag nodes to the canvas</p>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-white/10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search nodes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-n8n-accent"
          />
        </div>
      </div>

      {/* Node List */}
      <div className="flex-1 overflow-y-auto p-2">
        {nodeCategories.map((category) => {
          const categoryNodes = filteredNodes.filter((n) => n.category === category);
          if (categoryNodes.length === 0) return null;

          const isExpanded = expandedCategories.includes(category);

          return (
            <div key={category} className="mb-2">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
                <span className="text-lg">{getCategoryIcon(category)}</span>
                <span className="text-white font-medium text-sm flex-1 text-left">
                  {category}
                </span>
                <span className="text-gray-500 text-xs">{categoryNodes.length}</span>
              </button>

              {isExpanded && (
                <div className="ml-2 mt-1 space-y-1">
                  {categoryNodes.map((node) => (
                    <div
                      key={node.type}
                      draggable
                      onDragStart={(e) => onDragStart(e, node)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-grab hover:bg-white/10 transition-colors group border border-transparent hover:border-white/20"
                      style={{
                        background: `linear-gradient(90deg, ${node.color}10, transparent)`,
                      }}
                    >
                      <GripVertical className="w-3 h-3 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="text-base">{node.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium truncate">
                          {node.label}
                        </div>
                        <div className="text-gray-500 text-xs truncate">
                          {node.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-white/10 bg-black/20">
        <div className="text-center text-gray-500 text-xs">
          <span className="text-n8n-accent">{nodeTypes.length}</span> nodes available
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
