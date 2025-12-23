'use client';

import React, { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
  BackgroundVariant,
  Node,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useWorkflowStore, NodeData } from '@/store/workflowStore';
import { NodeTypeConfig, getNodeTypeConfig } from './nodes/nodeTypes';
import CustomNode from './nodes/CustomNode';
import Sidebar from './Sidebar';
import Toolbar from './Toolbar';
import NodeConfigPanel from './NodeConfigPanel';
import ExecutionPanel from './ExecutionPanel';

const nodeTypes = {
  custom: CustomNode,
};

let nodeId = 0;
const getId = () => `node_${nodeId++}`;

const WorkflowBuilderInner: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { project, zoomIn, zoomOut, fitView } = useReactFlow();
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    setSelectedNode,
    selectedNode,
    setIsRunning,
    isRunning,
    addLogEntry,
    clearLog,
    updateNodeStatus,
    resetNodeStatuses,
  } = useWorkflowStore();

  const [executionAborted, setExecutionAborted] = useState(false);

  const onDragStart = (event: React.DragEvent, nodeType: NodeTypeConfig) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeType));
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const data = event.dataTransfer.getData('application/reactflow');

      if (!data || !reactFlowBounds) return;

      const nodeType: NodeTypeConfig = JSON.parse(data);
      const position = project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode: Node<NodeData> = {
        id: getId(),
        type: 'custom',
        position,
        data: {
          label: nodeType.label,
          type: nodeType.type,
          icon: nodeType.icon,
          color: nodeType.color,
          config: { ...nodeType.defaultConfig },
          status: 'idle',
        },
      };

      addNode(newNode);
    },
    [project, addNode]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node<NodeData>) => {
      setSelectedNode(node);
    },
    [setSelectedNode]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  const handleDeleteNode = (nodeId: string) => {
    onNodesChange([{ type: 'remove', id: nodeId }]);
    setSelectedNode(null);
  };

  // Execution simulation
  const simulateExecution = async () => {
    if (nodes.length === 0) return;

    setIsRunning(true);
    setExecutionAborted(false);
    clearLog();
    resetNodeStatuses();

    // Find trigger nodes (starting points)
    const triggerNodes = nodes.filter((n) => n.data.type.includes('trigger'));
    const startNodes = triggerNodes.length > 0 ? triggerNodes : [nodes[0]];

    // Build adjacency list
    const adjacencyList: Record<string, string[]> = {};
    edges.forEach((edge) => {
      if (!adjacencyList[edge.source]) adjacencyList[edge.source] = [];
      adjacencyList[edge.source].push(edge.target);
    });

    // Execute nodes in order
    const executed = new Set<string>();
    const queue = startNodes.map((n) => n.id);

    while (queue.length > 0 && !executionAborted) {
      const currentId = queue.shift()!;
      if (executed.has(currentId)) continue;

      const node = nodes.find((n) => n.id === currentId);
      if (!node) continue;

      // Update status to running
      updateNodeStatus(currentId, 'running');
      addLogEntry(currentId, `Starting execution...`, 'info');

      // Simulate execution delay
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

      // Simulate random success/failure (90% success rate)
      const success = Math.random() > 0.1;
      
      if (success) {
        // Generate mock output based on node type
        const mockOutput = generateMockOutput(node.data.type, node.data.config);
        updateNodeStatus(currentId, 'success', mockOutput);
        addLogEntry(currentId, `Completed successfully. ${mockOutput.message || ''}`, 'success');

        // Add connected nodes to queue
        const nextNodes = adjacencyList[currentId] || [];
        queue.push(...nextNodes);
      } else {
        updateNodeStatus(currentId, 'error');
        addLogEntry(currentId, `Execution failed: Simulated error`, 'error');
      }

      executed.add(currentId);
    }

    setIsRunning(false);
    addLogEntry('workflow', `Workflow execution completed. ${executed.size} nodes processed.`, 'info');
  };

  const stopExecution = () => {
    setExecutionAborted(true);
    setIsRunning(false);
    addLogEntry('workflow', 'Execution stopped by user', 'info');
  };

  return (
    <div className="flex flex-col h-full">
      <Toolbar onZoomIn={zoomIn} onZoomOut={zoomOut} onFitView={fitView} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar onDragStart={onDragStart} />
        <div className="flex-1 flex flex-col">
          <div ref={reactFlowWrapper} className="flex-1">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              nodeTypes={nodeTypes}
              fitView
              snapToGrid
              snapGrid={[15, 15]}
              defaultEdgeOptions={{
                animated: true,
                style: { stroke: '#e94560', strokeWidth: 2 },
              }}
            >
              <Background
                variant={BackgroundVariant.Dots}
                gap={20}
                size={1}
                color="#ffffff15"
              />
              <Controls className="!bg-n8n-surface/80 !border-white/10 !rounded-lg" />
              <MiniMap
                nodeColor={(node) => node.data?.color || '#e94560'}
                maskColor="rgba(26, 26, 46, 0.8)"
                className="!bg-n8n-surface/80 !border-white/10 !rounded-lg"
              />
            </ReactFlow>
          </div>
          <ExecutionPanel onExecute={simulateExecution} onStop={stopExecution} />
        </div>
        {selectedNode && (
          <NodeConfigPanel
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
            onDelete={handleDeleteNode}
          />
        )}
      </div>
    </div>
  );
};

// Generate mock output based on node type
function generateMockOutput(type: string, config: Record<string, any>): any {
  const outputs: Record<string, () => any> = {
    'youtube-trigger': () => ({
      message: 'New video detected',
      videoId: 'abc123xyz',
      title: 'Amazing Tutorial Video',
      channelTitle: 'Tech Channel',
      publishedAt: new Date().toISOString(),
    }),
    'get-video-details': () => ({
      message: 'Fetched video details',
      title: 'Sample Video Title',
      viewCount: Math.floor(Math.random() * 1000000),
      likeCount: Math.floor(Math.random() * 50000),
      commentCount: Math.floor(Math.random() * 5000),
      duration: 'PT15M30S',
    }),
    'get-channel-videos': () => ({
      message: `Found ${config.maxResults || 10} videos`,
      items: Array.from({ length: config.maxResults || 10 }, (_, i) => ({
        videoId: `video_${i}`,
        title: `Video ${i + 1}`,
      })),
    }),
    'search-videos': () => ({
      message: `Found ${config.maxResults || 25} matching videos`,
      totalResults: Math.floor(Math.random() * 10000),
      items: Array.from({ length: 5 }, (_, i) => ({
        videoId: `search_${i}`,
        title: `${config.query || 'Result'} - Video ${i + 1}`,
      })),
    }),
    'download-transcript': () => ({
      message: 'Transcript downloaded',
      language: config.language || 'en',
      text: 'This is a sample transcript text that would contain the full video captions...',
      wordCount: 1250,
    }),
    'get-comments': () => ({
      message: `Fetched ${Math.min(config.maxResults || 100, 100)} comments`,
      items: Array.from({ length: 5 }, (_, i) => ({
        author: `User ${i + 1}`,
        text: `This is comment ${i + 1}. Great video!`,
        likeCount: Math.floor(Math.random() * 100),
      })),
    }),
    'ai-summarize': () => ({
      message: 'Content summarized',
      summary: 'This video discusses the key aspects of the topic, providing insights into best practices and common pitfalls to avoid.',
      model: config.model || 'gpt-4',
    }),
    'ai-extract-topics': () => ({
      message: `Extracted ${config.maxTopics || 10} topics`,
      topics: ['Introduction', 'Main Concepts', 'Best Practices', 'Examples', 'Conclusion'],
      keywords: ['tutorial', 'guide', 'tips', 'learn'],
    }),
    'sentiment-analysis': () => ({
      message: 'Sentiment analyzed',
      overall: 'positive',
      score: 0.78,
      breakdown: { positive: 65, neutral: 25, negative: 10 },
    }),
    'generate-content': () => ({
      message: `Generated ${config.contentType || 'blog-post'}`,
      content: 'Generated content based on the video analysis would appear here...',
      wordCount: 500,
    }),
    'filter': () => ({
      message: 'Data filtered',
      inputCount: 10,
      outputCount: 7,
      filtered: 3,
    }),
    'transform': () => ({
      message: 'Data transformed',
      fields: ['title', 'views', 'likes'],
    }),
    'send-email': () => ({
      message: `Email sent to ${config.to || 'recipient'}`,
      status: 'delivered',
    }),
    'post-slack': () => ({
      message: `Posted to ${config.channel || '#channel'}`,
      timestamp: new Date().toISOString(),
    }),
    'save-database': () => ({
      message: `Saved to ${config.table || 'table'}`,
      recordsAffected: 1,
    }),
    'post-twitter': () => ({
      message: 'Tweet posted',
      tweetId: '1234567890',
    }),
    'create-notion': () => ({
      message: 'Notion page created',
      pageId: 'notion-page-123',
    }),
    'http-request': () => ({
      message: `${config.method || 'POST'} request completed`,
      statusCode: 200,
      response: { success: true },
    }),
  };

  return outputs[type]?.() || { message: 'Node executed' };
}

const WorkflowBuilder: React.FC = () => {
  return (
    <ReactFlowProvider>
      <WorkflowBuilderInner />
    </ReactFlowProvider>
  );
};

export default WorkflowBuilder;
