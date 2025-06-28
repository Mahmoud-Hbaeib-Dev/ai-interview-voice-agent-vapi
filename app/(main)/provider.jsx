import React from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './_components/AppSidebar'
import { SidebarTrigger } from '@/components/ui/sidebar'

function DashboardProvider({children}) {
    return (
        <SidebarProvider>
                  <AppSidebar />
            <div>
            <SidebarTrigger />
                {children}
            </div>
            
        </SidebarProvider>
  )
}

export default DashboardProvider
