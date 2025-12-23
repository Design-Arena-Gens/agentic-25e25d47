'use client';

import React, { useState, useEffect } from 'react';
import { Node } from 'reactflow';
import { NodeData, useWorkflowStore } from '@/store/workflowStore';
import { getNodeTypeConfig, ConfigField } from './nodes/nodeTypes';
import { X, Save, Trash2, Copy, Info } from 'lucide-react';

interface NodeConfigPanelProps {
  node: Node<NodeData>;
  onClose: () => void;
  onDelete: (nodeId: string) => void;
}

const NodeConfigPanel: React.FC<NodeConfigPanelProps> = ({ node, onClose, onDelete }) => {
  const { updateNodeConfig } = useWorkflowStore();
  const [config, setConfig] = useState<Record<string, any>>(node.data.config || {});
  const nodeTypeConfig = getNodeTypeConfig(node.data.type);

  useEffect(() => {
    setConfig(node.data.config || {});
  }, [node.id, node.data.config]);

  const handleFieldChange = (fieldName: string, value: any) => {
    setConfig((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleSave = () => {
    updateNodeConfig(node.id, config);
    onClose();
  };

  const renderField = (field: ConfigField) => {
    const value = config[field.name] ?? '';

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-n8n-accent"
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleFieldChange(field.name, parseInt(e.target.value) || 0)}
            placeholder={field.placeholder}
            className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-n8n-accent"
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-n8n-accent resize-none"
          />
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-n8n-accent cursor-pointer"
          >
            {field.options?.map((option) => (
              <option key={option.value} value={option.value} className="bg-n8n-surface">
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'boolean':
        return (
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => handleFieldChange(field.name, e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-10 h-6 rounded-full transition-colors ${
                  value ? 'bg-n8n-accent' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                    value ? 'translate-x-5' : 'translate-x-1'
                  } mt-1`}
                />
              </div>
            </div>
            <span className="text-gray-300 text-sm">{value ? 'Enabled' : 'Disabled'}</span>
          </label>
        );

      case 'json':
        return (
          <textarea
            value={typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm font-mono placeholder-gray-500 focus:outline-none focus:border-n8n-accent resize-none"
          />
        );

      default:
        return null;
    }
  };

  if (!nodeTypeConfig) return null;

  return (
    <div className="w-96 bg-n8n-surface/95 backdrop-blur-sm border-l border-white/10 flex flex-col h-full">
      {/* Header */}
      <div
        className="p-4 border-b border-white/10"
        style={{ background: `linear-gradient(90deg, ${node.data.color}40, transparent)` }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{node.data.icon}</span>
            <div>
              <h3 className="text-white font-bold">{node.data.label}</h3>
              <p className="text-gray-400 text-xs">{nodeTypeConfig.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Node Info */}
      <div className="p-3 bg-black/20 border-b border-white/10">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Info className="w-3 h-3" />
          <span>Node ID: {node.id}</span>
          <button
            onClick={() => navigator.clipboard.writeText(node.id)}
            className="p-1 hover:bg-white/10 rounded"
          >
            <Copy className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Config Fields */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {nodeTypeConfig.configFields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              {field.label}
              {field.required && <span className="text-n8n-accent ml-1">*</span>}
            </label>
            {renderField(field)}
          </div>
        ))}

        {/* Variable Reference */}
        <div className="mt-6 p-3 bg-black/20 rounded-lg border border-white/10">
          <h4 className="text-xs font-medium text-gray-400 mb-2">💡 Variable Reference</h4>
          <div className="space-y-1 text-xs text-gray-500">
            <div><code className="text-n8n-blue">{'{{$node.input}}'}</code> - Previous node output</div>
            <div><code className="text-n8n-blue">{'{{$node.input.fieldName}}'}</code> - Specific field</div>
            <div><code className="text-n8n-blue">{'{{$workflow.id}}'}</code> - Workflow ID</div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-white/10 bg-black/20 flex gap-2">
        <button
          onClick={() => onDelete(node.id)}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
        <button
          onClick={handleSave}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-n8n-accent hover:bg-n8n-accent/80 text-white rounded-lg transition-colors font-medium"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default NodeConfigPanel;
