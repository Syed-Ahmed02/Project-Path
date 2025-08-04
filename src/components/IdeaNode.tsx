"use client"
import { memo } from "react";
 
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import {
  BaseNode,
  BaseNodeContent,
  BaseNodeFooter,
  BaseNodeHeader,
  BaseNodeHeaderTitle,
} from "@/components/react-flow/base-node";
import { Rocket } from "lucide-react";
import { BaseHandle } from "./base-handle";
import { Position } from "@xyflow/react";

export type IdeaNodeSchema = {
    data:{
        message?:string;
    }
}
 
export const IdeaNode = memo(({ data }: IdeaNodeSchema) => {
  return (
    <BaseNode className="w-96 shadow-md">
      <BaseHandle id="source" type="source" position={Position.Left} />
      <BaseNodeHeader className="border-b">
        <Rocket className="size-4" />
        <BaseNodeHeaderTitle>Idea Node</BaseNodeHeaderTitle>
      </BaseNodeHeader>
      <BaseNodeContent>
        <h3 className="text-lg font-bold">Describe your idea</h3>
        <Input placeholder="Carpooling App" />
        
        <h3 className="text-lg font-bold">Niche (optional)</h3>
        <Input placeholder="For broke collage students" />
      </BaseNodeContent>
      <BaseHandle id="target" type="target" position={Position.Right} />
    </BaseNode>
  );
});
 
IdeaNode.displayName = "IdeaNode";