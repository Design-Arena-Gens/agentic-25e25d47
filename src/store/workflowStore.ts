import { create } from 'zustand';
import { Node, Edge, Connection, addEdge, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange } from 'reactflow';

export interface NodeData {
  label: string;
  type: string;
  icon: string;
  color: string;
  config: Record<string, any>;
  status?: 'idle' | 'running' | 'success' | 'error';
  output?: any;
}

interface WorkflowState {
  nodes: Node<NodeData>[];
  edges: Edge[];
  selectedNode: Node<NodeData> | null;
  isRunning: boolean;
  executionLog: { nodeId: string; message: string; timestamp: Date; type: 'info' | 'success' | 'error' }[];
  setNodes: (nodes: Node<NodeData>[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (node: Node<NodeData>) => void;
  updateNodeConfig: (nodeId: string, config: Record<string, any>) => void;
  updateNodeStatus: (nodeId: string, status: NodeData['status'], output?: any) => void;
  setSelectedNode: (node: Node<NodeData> | null) => void;
  setIsRunning: (running: boolean) => void;
  addLogEntry: (nodeId: string, message: string, type: 'info' | 'success' | 'error') => void;
  clearLog: () => void;
  resetNodeStatuses: () => void;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  isRunning: false,
  executionLog: [],

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection) => {
    set({
      edges: addEdge(
        {
          ...connection,
          animated: true,
          style: { stroke: '#e94560', strokeWidth: 2 },
        },
        get().edges
      ),
    });
  },

  addNode: (node) => {
    set({
      nodes: [...get().nodes, node],
    });
  },

  updateNodeConfig: (nodeId, config) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, config: { ...node.data.config, ...config } } }
          : node
      ),
    });
  },

  updateNodeStatus: (nodeId, status, output) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, status, output } }
          : node
      ),
    });
  },

  setSelectedNode: (node) => set({ selectedNode: node }),

  setIsRunning: (running) => set({ isRunning: running }),

  addLogEntry: (nodeId, message, type) => {
    set({
      executionLog: [
        ...get().executionLog,
        { nodeId, message, timestamp: new Date(), type },
      ],
    });
  },

  clearLog: () => set({ executionLog: [] }),

  resetNodeStatuses: () => {
    set({
      nodes: get().nodes.map((node) => ({
        ...node,
        data: { ...node.data, status: 'idle', output: undefined },
      })),
    });
  },
}));
