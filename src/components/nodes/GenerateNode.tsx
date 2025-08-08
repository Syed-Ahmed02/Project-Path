"use client"
import { memo } from "react";
import {useEffect, useState} from "react";
import { Button } from "@/components/ui/button";
import { useChat } from '@ai-sdk/react';
import {
  BaseNode,
  BaseNodeContent,
  BaseNodeFooter,
  BaseNodeHeader,
  BaseNodeHeaderTitle,
} from "@/components/react-flow/base-node";
import { Rocket } from "lucide-react";
import { Node } from "@xyflow/react";
import {
    Handle,
    Position,
    useNodeConnections,
    useNodesData,
      useReactFlow,
  } from '@xyflow/react';

import { BaseHandle } from "../react-flow/base-handle";
import { DefaultChatTransport } from "ai";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

export type GenerateNodeSchema = {
    data:{
        connectedNodes:Node[]
    }
}

 
export const GenerateNode = memo(({ id }: { id: string }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [clicked,setClicked] = useState(false);
    const [isNodeConnected,setIsNodeConnected] = useState(false);
    const [input, setInput] = useState('');
    const { updateNodeData } = useReactFlow();

    const connections = useNodeConnections({
        handleType: 'target',
      });

      console.log("connections",connections);
      const nodesData = useNodesData(
        connections.map((connection) => connection.source),
      );
      
      useEffect(()=>{
        const obj = nodesData.map((node) => node.data);
        setInput(JSON.stringify(obj));
        const types = nodesData.map((n: any) => n.type);
        const numIdeas = types.filter((t: string) => t === 'ideaNode').length;
        const numNiche = types.filter((t: string) => t === 'nicheNode').length;
        const total = types.length;
        const valid = (total === 1 && numIdeas === 1)
          || (total === 2 && ((numIdeas === 2 && numNiche === 0) || (numIdeas === 1 && numNiche === 1)));
        setIsNodeConnected(valid);
      },[nodesData]);

      const upsertNode = useMutation(api.nodes.upsertNode);

      const {messages,sendMessage,status} = useChat({
      transport: new DefaultChatTransport({
        api: '/api/openai',
      }),
    });

    const handleGenerate = async () => {
        await sendMessage({ text: JSON.stringify(input) });
    };

    // Get the latest AI message for display
   

    return (
        <BaseNode className="w-[600px] shadow-md">
        <BaseHandle id="target" type="target" position={Position.Left} />

        <BaseNodeHeader className="border-b">
            <Rocket className="size-4" />
            <BaseNodeHeaderTitle>Generate Node</BaseNodeHeaderTitle>
        </BaseNodeHeader>
        <BaseNodeContent>
            <Button 
              onClick={()=>{
                handleGenerate();
              }} 
              disabled={!isNodeConnected}
              className="w-full"
            >
              {status === 'streaming' ? 'Generating...' : 'Generate'}
            </Button>
        </BaseNodeContent>
        <BaseNodeFooter>
            <div className="p-4 w-full overflow-y-auto">
            {messages.map(message => (
              <div key={message.id} className="whitespace-pre-wrap">
                {message.role === 'user' ? 'User: ' : 'AI: '}
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case 'text':
                      // Persist the latest assistant idea output on render
                      if (message.role === 'assistant') {
                        upsertNode({ nodeId: id, type: 'generate', data: { output: part.text } }).catch(() => {});
                        updateNodeData(id, { data: { output: part.text } });
                      }
                      return <div key={`${message.id}-${i}`}>{part.text}</div>;
                  }
                })}
              </div>
            ))}
            </div>
        </BaseNodeFooter>
        </BaseNode>
    );    
});         
 
GenerateNode.displayName = "GenerateNode";