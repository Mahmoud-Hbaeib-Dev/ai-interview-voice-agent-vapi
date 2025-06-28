import { LayoutDashboard, Bot, Users, BarChart3, Settings } from "lucide-react"

export const SideBarOptions = [
    {
        name: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard",
    },
    {
        name: "AI Agents",
        icon: Bot,
        path: "/agents",
    },
    {
        name: "Interviews",
        icon: Users,
        path: "/interviews",
    },
    {
        name: "Analytics",
        icon: BarChart3,
        path: "/analytics",
    },
    {
        name: "Settings",
        icon: Settings,
        path: "/settings",
    },
]