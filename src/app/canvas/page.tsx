"use client"
import { ReactFlow, Background, Controls, BackgroundVariant, applyEdgeChanges, applyNodeChanges, addEdge, Connection, OnConnect, OnNodesChange, OnEdgesChange, useReactFlow, ReactFlowProvider } from '@xyflow/react';
import {NodeChange, EdgeChange, Node, Edge} from '@xyflow/react'
import '@xyflow/react/dist/style.css';
import { useCallback, useState } from 'react';
import { IdeaNode } from '@/components/nodes/IdeaNode';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { GenerateNode } from '@/components/nodes/GenerateNode';
import { DnDProvider,useDnD } from '@/components/contexts/DnDContext';
import NodeSidebar from '@/components/NodeSidebar';

const nodeTypes = {
    ideaNode:IdeaNode,
    generateNode:GenerateNode
  };
   
const defaultNodes: Node[] = [
  {
    id: "1",
    position: { x: 200, y: 200 },
    data: {
      idea:"Carpooling App",
      niche:"For broke collage students"
    },
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
    (params) => setEdges((edgesSnapShot) => addEdge(params, edgesSnapShot)),
    []
  );

  const onDragOver = useCallback((event:React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);


  const onDrop = useCallback(
    (event:React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
 
      // check if the dropped element is valid
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