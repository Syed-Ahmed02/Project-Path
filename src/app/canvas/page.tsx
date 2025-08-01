"use client"
import { ReactFlow, Background, Controls, BackgroundVariant, applyEdgeChanges, applyNodeChanges, addEdge, Connection, OnConnect, OnNodesChange, OnEdgesChange } from '@xyflow/react';
import {NodeChange, EdgeChange, Node, Edge} from '@xyflow/react'
import '@xyflow/react/dist/style.css';
import { useCallback, useState } from 'react';
import { BaseNodeFullDemo } from '@/components/BaseNode';
const nodeTypes = {
    baseNode: BaseNodeFullDemo,
  };
   
  const defaultNodes = [
    {
      id: "2",
      position: { x: 200, y: 200 },
      data: {},
      type: "baseNode",
    },
  ];
//   const initialEdges: Edge[] = [
//     { id: 'n1-n2', source: 'n1', target: 'n2', label: 'connects with', type: 'step' },
//   ];

  
export default function Canvas() {
    // const [nodes, setNodes] = useState(initialNodes);
    // const [edges, setEdges] = useState(initialEdges);
    // const onNodesChange:OnNodesChange = useCallback(
    //     (changes) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    //     [],
    //   );
    //   const onEdgesChange:OnEdgesChange = useCallback(
    //     (changes) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    //     [],
    //   );
    //   const onConnect: OnConnect = useCallback(
    //     (params) => setEdges((edgesSnapShot)=> addEdge(params,edgesSnapShot)),
    //     []
    //   )
  return (
    
    <div style={{ height: '100vh', width: '100vw' }} >
      <ReactFlow 
        // nodes={nodes} 
        // edges={edges} 
        defaultNodes={defaultNodes}
        nodeTypes={nodeTypes}
        fitView 

        // onNodesChange={onNodesChange} 
        // onEdgesChange={onEdgesChange}
        // onConnect={onConnect}
      >
        <Background 
        color="#fff"
        variant={BackgroundVariant.Lines}
        
        />
        <Controls />
      </ReactFlow>
    </div>
  );
}