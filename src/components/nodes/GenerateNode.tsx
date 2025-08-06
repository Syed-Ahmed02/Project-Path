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
    const [generatedText,setGeneratedText] = useState("");
    
    const connections = useNodeConnections({
        handleType: 'target',
      });
      console.log("connections",connections);
      const nodesData = useNodesData(
        connections.map((connection) => connection.source),
      );
      console.log("nodesData",nodesData);

      const input = nodesData.map((node) => node.data.idea).join("\n");
      console.log("input",input);
   

    const {messages,sendMessage,status} = useChat({
      transport: new DefaultChatTransport({
        api: '/api/horizon',
      }),
    });
    console.log("generatedText",generatedText);
    return (
        <BaseNode className="w-96 shadow-md">
        <BaseHandle id="target" type="target" position={Position.Left} />

        <BaseNodeHeader className="border-b">
            <Rocket className="size-4" />
            <BaseNodeHeaderTitle>Generate Node</BaseNodeHeaderTitle>
        </BaseNodeHeader>
        <BaseNodeContent>
            <Button onClick={()=>{
                sendMessage({
                    text:input
                });
            }} disabled={status !='ready'}>Generate</Button>
        </BaseNodeContent>
        <BaseNodeFooter>
            <div>
            {messages.map(message => (
            <div key={message.id}>
              {message.role === 'user' ? 'User: ' : 'AI: '}
              {message.parts.map((part, index) =>
                part.type === 'text' ? <span key={index}>{part.text}</span> : null,
              )}
            </div>
          ))}
            </div>
        </BaseNodeFooter>
        </BaseNode>
    );    
});         
 
GenerateNode.displayName = "GenerateNode";