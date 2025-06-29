import React, { createContext, useContext } from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './_components/AppSidebar'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { ArrowLeft, LogOut } from 'lucide-react'

// Create a context for user data
const UserContext = createContext(null);

// Hook to use user data
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a DashboardProvider');
    }
    return context;
};

function DashboardProvider({ children, user }) {
    const handleBackToCompany = () => {
        window.open('http://localhost:5173/company/dashboard', '_blank');
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        window.location.href = 'http://localhost:5173/company/dashboard';
    };

    return (
        <UserContext.Provider value={user}>
            <SidebarProvider>
                <AppSidebar />
                <div className="flex-1">
                    <div className="flex justify-between items-center p-4 bg-white border-b">
                        <SidebarTrigger />
                        
                        {/* UI Component Buttons */}
                        <div className="flex items-center space-x-3">
                            <Button 
                                onClick={handleBackToCompany}
                                className="flex items-center space-x-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Back to Company</span>
                            </Button>
                            
                            <Button 
                                variant="destructive"
                                onClick={handleLogout}
                                className="flex items-center space-x-2"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </Button>
                        </div>
                    </div>
                    <div className="p-6">
                        {children}
                    </div>
                </div>
            </SidebarProvider>
        </UserContext.Provider>
    );
}

export default DashboardProvider;
