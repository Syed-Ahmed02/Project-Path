"use client"
import { ReactFlow, Background, Controls, BackgroundVariant, applyEdgeChanges, applyNodeChanges, addEdge, Connection, OnConnect, OnNodesChange, OnEdgesChange, useReactFlow, ReactFlowProvider } from '@xyflow/react';
import {NodeChange, EdgeChange, Node, Edge} from '@xyflow/react'
import '@xyflow/react/dist/style.css';
import { useCallback, useState } from 'react';
import { IdeaNode } from '@/components/nodes/IdeaNode';
import { NicheNode } from '@/components/nodes/NicheNode';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { GenerateNode } from '@/components/nodes/GenerateNode';
import { ProjectPlanNode } from '@/components/nodes/ProjectPlanNode';
import { DnDProvider,useDnD } from '@/components/contexts/DnDContext';
import NodeSidebar from '@/components/NodeSidebar';

const nodeTypes = {
    ideaNode: IdeaNode,
    nicheNode: NicheNode,
    generateNode: GenerateNode,
    projectPlanNode: ProjectPlanNode,
  };
   
const defaultNodes: Node[] = [
  {
    id: "1",
    position: { x: 200, y: 200 },
    data: {},
    type: "ideaNode",
  },
];
const initialEdges: Edge[] = [
  
];
let id = 0;
const getId = () => `dndnode_${id++}`;


const CanvasFlow = () => {
  const [nodes, setNodes] = useState<Node[]>(defaultNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const { screenToFlowPosition } = useReactFlow();
  const [type, setType] = useDnD();
  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  
  const onConnect: OnConnect = useCallback(
    (params) => {
      setEdges((edgesSnapShot) => {
        const sourceNode = nodes.find((n) => n.id === params.source);
        const targetNode = nodes.find((n) => n.id === params.target);
        if (!sourceNode || !targetNode) return edgesSnapShot;

        // Rules:
        // - Generate node accepts sources from Idea or Niche
        // - Limit to max 2 total incoming
        // - Allow at most 1 Niche connection
        if (targetNode.type === 'generateNode') {
          if (!(sourceNode.type === 'ideaNode' || sourceNode.type === 'nicheNode')) {
            return edgesSnapShot;
          }
          const existingIncoming = edgesSnapShot.filter((e) => e.target === params.target);
          const totalAfter = existingIncoming.length + 1;
          if (totalAfter > 2) return edgesSnapShot;
          const existingSources = existingIncoming.map((e) => nodes.find((n) => n.id === e.source)).filter(Boolean) as Node[];
          const nicheCount = existingSources.filter((n) => n.type === 'nicheNode').length + (sourceNode.type === 'nicheNode' ? 1 : 0);
          if (nicheCount > 1) return edgesSnapShot;
          // Disallow niche-only connection (must include at least one idea)
          if (existingIncoming.length === 0 && sourceNode.type === 'nicheNode') return edgesSnapShot;
          // ok
          return addEdge(params, edgesSnapShot);
        }

        // - Project Plan node only accepts from Generate node
        // - Only one incoming connection
        if (targetNode.type === 'projectPlanNode') {
          if (sourceNode.type !== 'generateNode') return edgesSnapShot;
          const existingIncoming = edgesSnapShot.filter((e) => e.target === params.target);
          if (existingIncoming.length > 0) return edgesSnapShot;
          return addEdge(params, edgesSnapShot);
        }

        // disallow all other target types
        return edgesSnapShot;
      });
    },
    [nodes]
  );

  const onDragOver = useCallback((event:React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);


  const onDrop = useCallback(
    (event:React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
 
      if (!type) {
        return;
      }
 
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };
 
      setNodes((nds) => nds.concat(newNode as Node));
    },
    [screenToFlowPosition, type],
  );


  return (
    <div style={{ height: '100vh', width: '100vw' }} className="bg-background relative">
      
      
      <ReactFlow 
        nodes={nodes} 
        edges={edges} 
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange} 
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        fitView 
      >
        <Background 
            variant={BackgroundVariant.Lines}
            bgColor='transparent'
            color='#cbd5e1'
        />
        <Controls />
        <NodeSidebar/>
      </ReactFlow>
      
    </div>
  );
}

export default () => (
  <ReactFlowProvider>
    <DnDProvider>
      <CanvasFlow />
    </DnDProvider>
  </ReactFlowProvider>
);