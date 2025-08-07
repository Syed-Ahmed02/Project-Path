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
  } from '@xyflow/react';

import { BaseHandle } from "../react-flow/base-handle";
import { DefaultChatTransport } from "ai";

export type GenerateNodeSchema = {
    data:{
        connectedNodes:Node[]
    }
}

 
export const GenerateNode = memo(() => {

    const [isLoading, setIsLoading] = useState(false);
    const [clicked,setClicked] = useState(false);
    const [isNodeConnected,setIsNodeConnected] = useState(false);
    const connections = useNodeConnections({
        handleType: 'target',
      });

      console.log("connections",connections);
      const nodesData = useNodesData(
        connections.map((connection) => connection.source),
      );
      
      const input = nodesData.map((node) => node.data);
      useEffect(()=>{
        console.log("input",input);
       
          setIsNodeConnected(true);
        
      },[input]);

     const {messages,sendMessage,status} = useChat({
      transport: new DefaultChatTransport({
        api: '/api/openai',
      }),
    });

    const handleGenerate = async () => {
     
        await sendMessage({
          text:JSON.stringify(input),
        });
      
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
                sendMessage({
                  text:JSON.stringify(input),
                });
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