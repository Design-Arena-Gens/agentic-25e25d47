'use client';

import React from 'react';
import { useWorkflowStore } from '@/store/workflowStore';
import { Play, Square, Trash2, CheckCircle, XCircle, Clock, Info } from 'lucide-react';

interface ExecutionPanelProps {
  onExecute: () => void;
  onStop: () => void;
}

const ExecutionPanel: React.FC<ExecutionPanelProps> = ({ onExecute, onStop }) => {
  const { isRunning, executionLog, clearLog, nodes } = useWorkflowStore();

  const getLogIcon = (type: 'info' | 'success' | 'error') => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  const getNodeLabel = (nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    return node ? node.data.label : nodeId;
  };

  return (
    <div className="h-48 bg-n8n-surface/90 backdrop-blur-sm border-t border-white/10 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
        <div className="flex items-center gap-3">
          <h3 className="text-white font-medium text-sm">Execution Log</h3>
          {isRunning && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-yellow-500/20 rounded-full">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              <span className="text-yellow-400 text-xs font-medium">Running</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearLog}
            className="flex items-center gap-1 px-2 py-1 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors text-xs"
          >
            <Trash2 className="w-3 h-3" />
            Clear
          </button>
          {isRunning ? (
            <button
              onClick={onStop}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <Square className="w-4 h-4" />
              Stop
            </button>
          ) : (
            <button
              onClick={onExecute}
              disabled={nodes.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-n8n-green hover:bg-n8n-green/80 text-black rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-4 h-4" />
              Execute
            </button>
          )}
        </div>
      </div>

      {/* Log Content */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 font-mono text-xs">
        {executionLog.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No execution logs yet</p>
              <p className="text-xs mt-1">Click Execute to run the workflow</p>
            </div>
          </div>
        ) : (
          executionLog.map((log, index) => (
            <div
              key={index}
              className={`flex items-start gap-2 px-2 py-1.5 rounded ${
                log.type === 'error'
                  ? 'bg-red-500/10'
                  : log.type === 'success'
                  ? 'bg-green-500/10'
                  : 'bg-white/5'
              }`}
            >
              {getLogIcon(log.type)}
              <span className="text-gray-500">
                {log.timestamp.toLocaleTimeString()}
              </span>
              <span className="text-n8n-accent font-medium">
                [{getNodeLabel(log.nodeId)}]
              </span>
              <span className="text-gray-300 flex-1">{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExecutionPanel;
