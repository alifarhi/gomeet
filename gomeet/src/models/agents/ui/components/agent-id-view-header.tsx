import { Breadcrumb,BreadcrumbItem,BreadcrumbList,BreadcrumbSeparator,BreadcrumbLink } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button";
import {DropdownMenuItem , DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { ChevronRightIcon, MoreVerticalIcon, PencilIcon, TrashIcon } from "lucide-react"
import Link from "next/link"

interface Props{
    agentId:string,
    agentName:string,
    onEdit:()=>void,
    onRemove:()=>void,
}


export const AgentIdViewHeader = ({agentId,agentName,onEdit,onRemove}:Props) => {
    

  return (
    <div className="flex items-center justify-between">
        <Breadcrumb>
           <BreadcrumbList>
                <BreadcrumbItem>
                      <BreadcrumbLink asChild className="font-medium text-xl">
                      <Link href=" /agents" className=" text-gradiant from-red-500 to-red-900 hover:text-green-700 underline">
                        My Agents
                      </Link>
                      </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-foreground text-xl  font-medium [&>svg]:size-4">
                <ChevronRightIcon/>
                </BreadcrumbSeparator>
                <BreadcrumbLink asChild className="font-medium text-xl text-foreground">
                      <Link href={`/agents/${agentId}`} className=" text-red-800 hover:text-green-700 underline">
                        {agentName}
                      </Link>
                      </BreadcrumbLink>
           </BreadcrumbList>
        </Breadcrumb>
        <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <MoreVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}>
            <PencilIcon className="size-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onRemove}>
            <TrashIcon className="size-4 mr-2" />
             Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
