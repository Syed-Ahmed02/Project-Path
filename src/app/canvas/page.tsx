"use client"
import { ReactFlow, Background, Controls, BackgroundVariant, applyEdgeChanges, applyNodeChanges, addEdge, Connection, OnConnect, OnNodesChange, OnEdgesChange } from '@xyflow/react';
import {NodeChange, EdgeChange, Node, Edge} from '@xyflow/react'
import '@xyflow/react/dist/style.css';
import { useCallback, useState } from 'react';
import { IdeaNode } from '@/components/IdeaNode';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { GenerateNode } from '@/components/GenerateNode';

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



export default function Canvas() {
  const [nodes, setNodes] = useState<Node[]>(defaultNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  
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

  const addNewNode = useCallback((type:string) => {
    const newNode: Node = {
      id: `${Date.now()}`,
      position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
      data: {
        idea:"",
        niche:""
      },
      type: type,
    };
    
    setNodes((nds) => [...nds, newNode]);
  }, []);

  return (
    <div style={{ height: '100vh', width: '100vw' }} className="bg-background relative">
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <Button 
          onClick={() => addNewNode("ideaNode")}
          className="flex items-center gap-2"
        >
          <Plus className="size-4" />
          Add Idea Node
        </Button>
        <Button 
          onClick={() => addNewNode("generateNode")}
          className="flex items-center gap-2"
        >
          <Plus className="size-4" />
          Add Generate Node
        </Button>
      </div>
      
      <ReactFlow 
        nodes={nodes} 
        edges={edges} 
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange} 
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView 
      >
        <Background 
            variant={BackgroundVariant.Lines}
            bgColor='transparent'
            color='#cbd5e1'
        />
        <Controls />
      </ReactFlow>
    </div>
  );
}