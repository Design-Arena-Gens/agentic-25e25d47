'use client';

import React, { useState } from 'react';
import { useWorkflowStore } from '@/store/workflowStore';
import {
  Save,
  Upload,
  Download,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Maximize,
  Grid,
  Eye,
  Sparkles,
  Youtube,
  Settings,
  HelpCircle,
} from 'lucide-react';

interface ToolbarProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onZoomIn, onZoomOut, onFitView }) => {
  const { nodes, edges } = useWorkflowStore();
  const [workflowName, setWorkflowName] = useState('YouTube Automation Workflow');
  const [showHelp, setShowHelp] = useState(false);

  const handleExport = () => {
    const workflow = {
      name: workflowName,
      nodes: nodes.map((n) => ({
        id: n.id,
        type: n.data.type,
        position: n.position,
        config: n.data.config,
      })),
      edges: edges.map((e) => ({
        source: e.source,
        target: e.target,
      })),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(workflow, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workflowName.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="h-14 bg-n8n-surface/90 backdrop-blur-sm border-b border-white/10 flex items-center justify-between px-4">
        {/* Left Section - Logo & Name */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-n8n-accent to-n8n-purple rounded-lg flex items-center justify-center">
              <Youtube className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-sm leading-none">YouTube Automation</h1>
              <span className="text-gray-500 text-xs">Workflow Builder</span>
            </div>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="bg-transparent text-white text-sm font-medium border-b border-transparent hover:border-white/20 focus:border-n8n-accent focus:outline-none px-1 py-0.5"
          />
        </div>

        {/* Center Section - Tools */}
        <div className="flex items-center gap-1 bg-black/30 rounded-lg p-1">
          <button
            onClick={() => {}}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={() => {}}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-white/10 mx-1" />
          <button
            onClick={onZoomOut}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={onZoomIn}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={onFitView}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
            title="Fit View"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 mr-2 text-xs text-gray-400">
            <span className="text-n8n-accent font-medium">{nodes.length}</span> nodes
            <span className="mx-1">·</span>
            <span className="text-n8n-blue font-medium">{edges.length}</span> connections
          </div>
          
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          
          <button
            onClick={() => setShowHelp(true)}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Help"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-n8n-surface border border-white/10 rounded-xl p-6 max-w-lg w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-n8n-accent" />
                How to Use
              </h2>
              <button
                onClick={() => setShowHelp(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4 text-sm">
              <div className="p-3 bg-black/30 rounded-lg">
                <h3 className="text-n8n-accent font-medium mb-1">1. Add Nodes</h3>
                <p className="text-gray-400">Drag nodes from the left sidebar onto the canvas to build your workflow.</p>
              </div>
              <div className="p-3 bg-black/30 rounded-lg">
                <h3 className="text-n8n-accent font-medium mb-1">2. Connect Nodes</h3>
                <p className="text-gray-400">Click and drag from a node's output handle (right) to another node's input handle (left).</p>
              </div>
              <div className="p-3 bg-black/30 rounded-lg">
                <h3 className="text-n8n-accent font-medium mb-1">3. Configure Nodes</h3>
                <p className="text-gray-400">Click on any node to open the configuration panel and set up its parameters.</p>
              </div>
              <div className="p-3 bg-black/30 rounded-lg">
                <h3 className="text-n8n-accent font-medium mb-1">4. Execute Workflow</h3>
                <p className="text-gray-400">Click the Execute button to simulate running your workflow and see the results.</p>
              </div>
            </div>
            <button
              onClick={() => setShowHelp(false)}
              className="w-full mt-4 px-4 py-2 bg-n8n-accent hover:bg-n8n-accent/80 text-white rounded-lg transition-colors font-medium"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Toolbar;
