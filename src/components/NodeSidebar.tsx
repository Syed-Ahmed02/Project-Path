"use client"
import React, { useCallback } from 'react';
  import {useDnD} from './contexts/DnDContext';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from './ui/sidebar';
import { Button } from './ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
export default function NodeSidebar() {
  const [_, setType] = useDnD();
  const onDragStart = useCallback((event:React.DragEvent<HTMLDivElement>, nodeType:string) => {
    setType(nodeType);
    event.dataTransfer.setData('text/plain', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  }, [setType]);


  return (
  
    <Sidebar>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Application</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu className='flex flex-col gap-2' >
          <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" className="w-full" >
            <div onDragStart={(event) => onDragStart(event, 'ideaNode')} draggable>
          Idea Node
        </div>
        </Button>
        </TooltipTrigger>
      <TooltipContent>
        <p>Drag me to the canvas</p>
      </TooltipContent>
    </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" className="w-full" >
            <div onDragStart={(event) => onDragStart(event, 'nicheNode')} draggable>
            Niche Node
            </div>
            </Button>
            </TooltipTrigger> 
            <TooltipContent>
              <p>Drag me to the canvas</p>
            </TooltipContent>
            </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" className="w-full" >
            <div onDragStart={(event) => onDragStart(event, 'generateNode')} draggable>
            Generate Node
            </div>
            </Button>
            </TooltipTrigger> 
            <TooltipContent>
              <p>Drag me to the canvas</p>
            </TooltipContent>
            </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" className="w-full" >
            <div onDragStart={(event) => onDragStart(event, 'projectPlanNode')} draggable>
            Project Plan Node
            </div>
            </Button>
            </TooltipTrigger> 
            <TooltipContent>
              <p>Drag me to the canvas</p>
            </TooltipContent>
            </Tooltip>
        
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
  );
};
