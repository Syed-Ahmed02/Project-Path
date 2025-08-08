"use client"
import { memo, useEffect, useMemo, useState } from "react";
import {
  BaseNode,
  BaseNodeContent,
  BaseNodeFooter,
  BaseNodeHeader,
  BaseNodeHeaderTitle,
} from "@/components/react-flow/base-node";
import { BaseHandle } from "../react-flow/base-handle";
import { ClipboardList } from "lucide-react";
import { Button } from "../ui/button";
import { Position, useNodeConnections, useNodesData, useReactFlow } from "@xyflow/react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

export type ProjectPlanNodeSchema = {
  data: {
    plan?: string;
  };
  id: string;
};

export const ProjectPlanNode = memo(({ data, id }: ProjectPlanNodeSchema) => {
  const { updateNodeData } = useReactFlow();
  const upsertNode = useMutation(api.nodes.upsertNode);
  const [isDisabled, setIsDisabled] = useState(true);

  const connections = useNodeConnections({ handleType: "target" });
  const sourceIds = useMemo(() => connections.map((c) => c.source), [connections]);
  const sources = useNodesData(sourceIds);
  const generateNodeData = sources.find((s) => s.type === "generateNode");
  const generateOutput = (generateNodeData?.data as any)?.output as string | undefined;

  useEffect(() => {
    setIsDisabled(!generateOutput);
  }, [generateOutput]);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/plan" }),
  });

  useEffect(() => {
    const last = [...messages].reverse().find((m) => m.role === "assistant");
    if (!last) return;
    const textParts = last.parts.filter((p) => p.type === "text");
    const text = textParts.map((p: any) => p.text).join("\n");
    updateNodeData(id, { data: { plan: text } });
    upsertNode({ nodeId: id, type: "projectPlan", data: { plan: text } }).catch(() => {});
  }, [messages, id, updateNodeData, upsertNode]);

  const handlePlan = async () => {
    if (!generateOutput) return;
    await sendMessage({ text: generateOutput });
  };

  return (
    <BaseNode className="w-[600px] shadow-md">
      <BaseHandle id="target" type="target" position={Position.Left} />
      <BaseNodeHeader className="border-b">
        <ClipboardList className="size-4" />
        <BaseNodeHeaderTitle>Project Plan</BaseNodeHeaderTitle>
      </BaseNodeHeader>
      <BaseNodeContent>
        <Button className="w-full" onClick={handlePlan} disabled={isDisabled}>
          {status === "streaming" ? "Planning..." : "Create Plan"}
        </Button>
      </BaseNodeContent>
      <BaseNodeFooter>
        <div className="p-4 w-full overflow-y-auto max-h-64">
          {messages.map((message) => (
            <div key={message.id} className="whitespace-pre-wrap text-sm">
              {message.role === "user" ? "User: " : "AI: "}
              {message.parts.map((part, i) => {
                if (part.type === "text") return <div key={`${message.id}-${i}`}>{part.text}</div>;
                return null;
              })}
            </div>
          ))}
        </div>
      </BaseNodeFooter>
    </BaseNode>
  );
});

ProjectPlanNode.displayName = "ProjectPlanNode";


