"use client";
import { usePathname } from "next/navigation"; 
import Image from "next/image";
import Link from "next/link";
import { BotIcon, icons, StarIcon, VideoIcon } from "lucide-react";
import { Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuAction,
    SidebarMenuItem
 } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { map } from "zod";
import { cn } from "@/lib/utils";
import { DashboardUserButton } from "./dashboarduserbutton";



 const  firstSection=[
    {
        icon:VideoIcon,
        label:"Meeting",
        href:"/meeting",
    },

    {
        icon:BotIcon,
        label:"Agents",
        href: "/agents",
    }, 
 ];

 const  secondSection=[
    {
        icon:StarIcon,
        label:"Upgrade",
        href:"/upgrade",
    },
 ];

 export const DashboardSidebar=() => { 
    const pathname= usePathname();
  return(
    <Sidebar>
        <SidebarHeader className="text-sidebar-accent-foreground">
            <Link href={"/"} className="flex items-center gap-2 px-6 pt-2">
                <Image src={"/logo.svg"} height={36} width={36} alt="GoMeet"/>
                <p className="text-xl font-semibold">GoMeet</p>
            </Link>
        </SidebarHeader>
        <div className="px-4 py-2 ">
          <Separator className="opacity-100 text-[#5D6B68]"/>
        </div>
        <SidebarContent>
            <SidebarGroup>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {firstSection.map((item)=>(
                         <SidebarMenuItem key={item.href}>
                             <SidebarMenuButton 
                             asChild
                             className={cn(
                               "h-10 border border-transparent hover:border-[#5D6B68]/10 hover:bg-gradient-to-l from-sidebar-accent from-[5%] via-[30%] via-sidebar/50  to-sidebar/50",
                                 pathname === item.href && "bg-linear-to-r/oklch border-[#5D6B68]/10"
                               )}
                               isActive={pathname===item.href} 
                               >
                                <Link href={item.href}>
                                <item.icon className="size-5"/>
                                <span className="text-sm font-medium tracking-tight">
                                    {item.label}
                                </span>
                                </Link>
                             </SidebarMenuButton>
                         </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
            <div className="px-4 py-2 ">
          <Separator className="opacity-30 text-[#5D6B68]"/>
            </div>
             <SidebarGroup>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {secondSection.map((item)=>(
                         <SidebarMenuItem key={item.href}>
                             <SidebarMenuButton 
                             asChild
                             className={cn(
                               "h-10 border border-transparent hover:border-[#5D6B68]/10 hover:bg-gradient-to-l from-sidebar-accent from-[5%] via-[30%] via-sidebar/50  to-sidebar/50",
                                 pathname === item.href && "bg-linear-to-r/oklch border-[#5D6B68]/10"
                               )}
                               isActive={pathname===item.href} 
                               >
                                <Link href={item.href}>
                                <item.icon className="size-5"/>
                                <span className="text-sm font-medium tracking-tight">
                                    {item.label}
                                </span>
                                </Link>
                             </SidebarMenuButton>
                         </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="text-white">
            <DashboardUserButton/>
        </SidebarFooter>
    </Sidebar>
  )
 }

function UsePathname() {
    throw new Error("Function not implemented.");
}

