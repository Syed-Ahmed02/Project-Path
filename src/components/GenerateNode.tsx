"use client"
import { memo } from "react";
import {useEffect, useState} from "react";
import { Button } from "@/components/ui/button";
import { useCompletion } from '@ai-sdk/react';
import {
  BaseNode,
  BaseNodeContent,
  BaseNodeFooter,
  BaseNodeHeader,
  BaseNodeHeaderTitle,
} from "@/components/react-flow/base-node";
import { Rocket } from "lucide-react";
import { Node } from "@xyflow/react";

export type GenerateNodeSchema = {
    data:{
        connectedNodes:Node[]
    }
}

 
export const GenerateNode = memo(({ data }: GenerateNodeSchema) => {

    const [isLoading, setIsLoading] = useState(false);
    const [clicked,setClicked] = useState(false);
    const [generatedText,setGeneratedText] = useState("");
    
    const { completion, input, handleInputChange, handleSubmit} = useCompletion({
        api: '/api/completion',
      });
    
    return (
        <BaseNode className="w-96 shadow-md">
        <BaseNodeHeader className="border-b">
            <Rocket className="size-4" />
            <BaseNodeHeaderTitle>Generate Node</BaseNodeHeaderTitle>
        </BaseNodeHeader>
        <BaseNodeContent>
        <form onSubmit={handleSubmit}>
            <Button onClick={()=>{
                setIsLoading(true);
                setClicked(true);
            }} disabled={isLoading}>Generate</Button>
        </form>
        </BaseNodeContent>
        
        </BaseNode>
    );    
});         
 
GenerateNode.displayName = "GenerateNode";