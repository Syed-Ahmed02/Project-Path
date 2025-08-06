"use client"
import { memo } from "react";
 
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import {
  BaseNode,
  BaseNodeContent,
  BaseNodeFooter,
  BaseNodeHeader,
  BaseNodeHeaderTitle,
} from "@/components/react-flow/base-node";
import { Rocket } from "lucide-react";
import { BaseHandle } from "../react-flow/base-handle";
import { Position, useNodeConnections, useReactFlow } from "@xyflow/react";

export type IdeaNodeSchema = {
    data:{
        idea?:string,
        niche?:string
    },
    id:string;
}
 
export const IdeaNode = memo(({ data, id }: IdeaNodeSchema) => {
  const { updateNodeData } = useReactFlow();

  return (
    <BaseNode className="w-96 shadow-md">
      <BaseHandle id="source" type="source" position={Position.Right} />
      <BaseNodeHeader className="border-b">
        <Rocket className="size-4" />
        <BaseNodeHeaderTitle>Idea Node</BaseNodeHeaderTitle>
      </BaseNodeHeader>
      <BaseNodeContent>
        <h3 className="text-lg font-bold">Describe your idea</h3>
        <Input placeholder="Carpooling App" value={data.idea} onChange={(e) => updateNodeData(id, { data: { idea: e.target.value } })} />
        
        <h3 className="text-lg font-bold">Niche (optional)</h3>
        <Input placeholder="For broke collage students" value={data.niche} onChange={(e) => updateNodeData(id, { data: { niche: e.target.value } })} />
      </BaseNodeContent>
    </BaseNode>
  );
});
 
IdeaNode.displayName = "IdeaNode";