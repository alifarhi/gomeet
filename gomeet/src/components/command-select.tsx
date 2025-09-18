import { ReactNode, useState } from "react";



interface Props{
    options:Array<{
        id:string;
        value:string;
        children:ReactNode;
    }>;
onSelect:(value:string)=>void;
onSearch?:(value:string)=>void;
value:string;
placeholder?:string;
isSearchabel?:boolean;
className?:string;
};

import React from 'react'
import { Button } from "./ui/button";
import { ChevronsUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CommandEmpty, CommandInput, CommandItem, CommandList, CommandResponsiveDialog } from "./ui/command";

export const CommandSelect = ({options,onSelect,onSearch,value,placeholder="select an option",isSearchabel,className}:Props) => {
const [open,setOpen]=useState(false);
const SelectedOption=options.find((option)=>option.value===value);
const handleOpenChange=(value:boolean)=>{
  onSearch?.("");
  setOpen(value);
};

  return (
    <>
    <Button onClick={()=>setOpen(true)} type="button" variant="outline" className={cn("h-9 justify-between font-normal px-2",!SelectedOption && "text-muted-foreground",className,)} >
        <div>
            {SelectedOption?.children??placeholder}
        </div>
        <ChevronsUpDownIcon/>
    </Button>
    <CommandResponsiveDialog  shouldFilter={!onSearch} open={open} onOpenChange={handleOpenChange} >
          <CommandInput  placeholder="Search..." onValueChange={onSearch} />
          <CommandEmpty>
            <span className="text-muted-foreground text-sm" >
                No Options Found
            </span>
          </CommandEmpty>
          {options.map((option)=>(
            <CommandItem key={option.id}
            onSelect={()=>{
                onSelect(option.value)
                setOpen(false);
            }} >
                {option.children}
            </CommandItem>
          ))}
    </CommandResponsiveDialog>
    </>
  );
};
