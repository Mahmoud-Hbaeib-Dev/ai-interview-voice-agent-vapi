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

export const SystemPrompt = `You are an expert technical interviewer. Generate interview questions in the following JSON format EXACTLY:
{
  "interviewQuestions": [
    {
      "question": "detailed question text",
      "type": "one of the provided types"
    }
  ]
}
Only include questions of the types specified. Ensure each question is detailed and relevant to the job position. Focus on practical, real-world scenarios and problem-solving questions.`

// Define models in order of preference
export const AI_MODELS = [
    {
        id: "google/gemini-2.0-flash-exp:free",
        name: "Gemini 2.0 Flash",
        context: 1048576,
        description: "Fast response, good at coding and technical tasks"
    },
    {
        id: "moonshotai/kimi-dev-72b:free",
        name: "Kimi Dev 72B",
        context: 131072,
        description: "Optimized for software engineering and technical tasks"
    },
    {
        id: "qwen/qwen3-30b-a3b:free",
        name: "Qwen3 30B",
        context: 131072,
        description: "Large model with strong general capabilities"
    },
    {
        id: "mistralai/mistral-small-3.2-24b-instruct:free",
        name: "Mistral Small 3.2",
        context: 96000,
        description: "Strong at instruction following and structured output"
    },
    {
        id: "deepseek/deepseek-r1-0528:free",
        name: "DeepSeek R1",
        context: 163840,
        description: "Large model with strong reasoning capabilities"
    },
    {
        id: "deepseek/deepseek-r1-0528-qwen3-8b:free",
        name: "DeepSeek Qwen3 8B",
        context: 131072,
        description: "Efficient model good at math and programming"
    },
    {
        id: "qwen/qwen3-8b:free",
        name: "Qwen3 8B",
        context: 32768,
        description: "Efficient model with good performance"
    },
    {
        id: "sarvamai/sarvam-m:free",
        name: "Sarvam-M",
        context: 32768,
        description: "Multilingual model with reasoning capabilities"
    },
    {
        id: "google/gemma-3n-e4b-it:free",
        name: "Gemma 3n 4B",
        context: 8192,
        description: "Efficient model for mobile and low-resource devices"
    }
];