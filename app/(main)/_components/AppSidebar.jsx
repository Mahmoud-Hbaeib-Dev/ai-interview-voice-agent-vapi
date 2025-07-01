"use client"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { SideBarOptions } from "../../../service/constant"
export function AppSidebar() {
    const pathname = usePathname();
    console.log(pathname);  
  return (
    <Sidebar>
      <SidebarHeader className='flex flex-col items-center mt-5 space-y-4'>
        <Image 
          src="/assets/images/logo.png" 
          alt="JOBITE Logo" 
          width={150} 
          height={100}
          className="object-contain"
        />
        <Link href="/dashboard/create-interview">
          <Button className="w-full">
            <Plus className="mr-2" /> 
            Create New Interview
          </Button>
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {SideBarOptions.map((option, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild  className={` p-5 ${pathname === option.path && 'bg-blue-50'}`	}>
                    <Link href={option.path}>
                      <option.icon className={` ${pathname === option.path && 'text-primary'}`} />
                      <span className={`text-[16px] font-medium ${pathname === option.path && 'text-primary'}`}>
                        {option.name}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <div className="text-xs text-center text-muted-foreground">
          Powered by VAPI
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}