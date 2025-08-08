"use client"
import { memo, useCallback, useEffect, useState } from "react";

import { Input } from "../ui/input";
import {
  BaseNode,
  BaseNodeContent,
  BaseNodeHeader,
  BaseNodeHeaderTitle,
} from "@/components/react-flow/base-node";
import { Tags } from "lucide-react";
import { BaseHandle } from "../react-flow/base-handle";
import { Position, useReactFlow } from "@xyflow/react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

export type NicheNodeSchema = {
  data: {
    niche?: string;
  };
  id: string;
};

export const NicheNode = memo(({ data, id }: NicheNodeSchema) => {
  const { updateNodeData } = useReactFlow();
  const upsertNode = useMutation(api.nodes.upsertNode);

  const [value, setValue] = useState<string>(data.niche ?? "");

  useEffect(() => {
    setValue(data.niche ?? "");
  }, [data.niche]);

  const onChange = useCallback(
    async (next: string) => {
      setValue(next);
      updateNodeData(id, { data: { niche: next } });
      try {
        await upsertNode({ nodeId: id, type: "niche", data: { niche: next } });
      } catch (err) {
        // no-op: background sync failure shouldn't block typing
      }
    },
    [id, updateNodeData, upsertNode],
  );

  return (
    <BaseNode className="w-96 shadow-md">
      <BaseHandle id="source" type="source" position={Position.Right} />
      <BaseNodeHeader className="border-b">
        <Tags className="size-4" />
        <BaseNodeHeaderTitle>Niche Node</BaseNodeHeaderTitle>
      </BaseNodeHeader>
      <BaseNodeContent>
        <h3 className="text-lg font-bold">Target niche</h3>
        <Input
          placeholder="e.g. Indie hackers in LATAM"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </BaseNodeContent>
    </BaseNode>
  );
});

NicheNode.displayName = "NicheNode";


