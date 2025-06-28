// Configuration for AI Interview System
export const CONFIG = {
    // API Endpoints
    JOBITE_API_URL: process.env.NEXT_PUBLIC_JOBITE_API_URL || "http://localhost:8000",

    // JWT Configuration
    JWT_SECRET: process.env.JWT_SECRET || "your-jwt-secret-key",

    // Supabase Configuration
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,

    // VAPI Configuration
    VAPI_PUBLIC_KEY: process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY,
    VAPI_PRIVATE_KEY: process.env.VAPI_PRIVATE_KEY,

    // App Configuration
    APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

    // Database Tables
    TABLES: {
        COMPANIES: "companies",
        AI_AGENTS: "ai_agents",
        INTERVIEWS: "interviews",
        INTERVIEW_RESULTS: "interview_results",
    },
};