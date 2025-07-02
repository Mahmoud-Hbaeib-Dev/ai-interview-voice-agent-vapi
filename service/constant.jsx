import { LayoutDashboard, Bot, Users, BarChart3, Settings, Code2, User, Brain, Briefcase, FolderOpen, MoreHorizontal } from "lucide-react"

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
        name: "Create Interview",
        icon: Users,
        path: "/dashboard/create-interview",
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

export const InterviewType = [
    {
        title: "Technical",
        icon: Code2,
        description: "Coding challenges & technical knowledge"
    },
    {
        title: "Behavioral",
        icon: User,
        description: "Soft skills & personality assessment"
    },
    {
        title: "Problem Solving",
        icon: Brain,
        description: "Logic & analytical thinking"
    },
    {
        title: "Experience",
        icon: Briefcase,
        description: "Past work experience & achievements"
    },
    {
        title: "Leadership",
        icon: Users,
        description: "Management & team leadership skills"
    }
]

export const QuestionPrompt = `You are an expert technical interviewer.
Based on the following inputs, generate a well-structured list of high-quality interview questions:

Job Title: {{jobTitle}}
Job Description: {{jobDescription}}
Interview Duration: {{duration}}
Selected Question Types: {{type}}

📝 Your task:
Analyze the job description to identify key responsibilities, required skills, and expected experience.
Generate a list of interview questions depends on interview duration
Adjust the number and depth of questions to match the interview duration.
IMPORTANT: Only generate questions of the exact types specified in the Selected Question Types. Do not include any other question types.

🎯 Format your response in JSON format with array list of questions.
format: interviewQuestions=[
{
question:"",
type:"" // Must be one of the types specified in Selected Question Types
},{
...
}]

🎯 The goal is to create a structured, relevant, and time-optimized interview plan for a {{jobTitle}} role.
Remember: Only include questions of the exact types specified in Selected Question Types.`