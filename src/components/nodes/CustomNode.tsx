'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { NodeData } from '@/store/workflowStore';
import { Play, Check, X, Loader2 } from 'lucide-react';

const CustomNode = memo(({ data, selected }: NodeProps<NodeData>) => {
  const getStatusIcon = () => {
    switch (data.status) {
      case 'running':
        return <Loader2 className="w-4 h-4 animate-spin text-yellow-400" />;
      case 'success':
        return <Check className="w-4 h-4 text-green-400" />;
      case 'error':
        return <X className="w-4 h-4 text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusBorder = () => {
    switch (data.status) {
      case 'running':
        return 'border-yellow-400 shadow-yellow-400/30';
      case 'success':
        return 'border-green-400 shadow-green-400/30';
      case 'error':
        return 'border-red-400 shadow-red-400/30';
      default:
        return selected ? 'border-white/50' : 'border-white/20';
    }
  };

  return (
    <div
      className={`
        relative min-w-[180px] rounded-xl border-2 transition-all duration-300
        ${getStatusBorder()}
        ${data.status === 'running' ? 'node-executing' : ''}
        ${selected ? 'shadow-lg shadow-white/20' : 'shadow-md'}
      `}
      style={{
        background: `linear-gradient(135deg, ${data.color}20, ${data.color}40)`,
      }}
    >
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-white !border-2"
        style={{ borderColor: data.color }}
      />

      {/* Header */}
      <div
        className="px-3 py-2 rounded-t-xl flex items-center gap-2"
        style={{ backgroundColor: `${data.color}60` }}
      >
        <span className="text-lg">{data.icon}</span>
        <span className="text-white font-medium text-sm flex-1 truncate">
          {data.label}
        </span>
        {getStatusIcon()}
      </div>

      {/* Body */}
      <div className="px-3 py-2 bg-black/30 rounded-b-xl">
        <div className="text-xs text-gray-400 truncate">
          {data.config && Object.keys(data.config).length > 0 ? (
            Object.entries(data.config)
              .filter(([_, v]) => v)
              .slice(0, 2)
              .map(([k, v]) => (
                <div key={k} className="truncate">
                  <span className="text-gray-500">{k}:</span>{' '}
                  <span className="text-gray-300">{String(v).substring(0, 20)}</span>
                </div>
              ))
          ) : (
            <span className="text-gray-500 italic">Click to configure</span>
          )}
        </div>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-white !border-2"
        style={{ borderColor: data.color }}
      />

      {/* Type badge */}
      <div
        className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
        style={{ backgroundColor: data.color }}
      >
        {data.type.split('-')[0].toUpperCase()}
      </div>
    </div>
  );
});

CustomNode.displayName = 'CustomNode';

export default CustomNode;
