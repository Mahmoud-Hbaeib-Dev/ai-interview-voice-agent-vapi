import OpenAI from "openai";
import { NextResponse } from "next/server";
import { QuestionPrompt } from "../../../service/constant";

export async function POST(req) {
    try {
        const {jobPosition, jobDescription, selectedTypes, duration} = await req.json();
        
        console.log("🔍 API REQUEST DATA:", {
            jobPosition,
            jobDescription,
            selectedTypes,
            duration,
            hasPrompt: !!QuestionPrompt
        });

        const FINAL_PROMPT = QuestionPrompt
            .replace("{{jobTitle}}", jobPosition || "")
            .replace("{{jobDescription}}", jobDescription || "")
            .replace("{{duration}}", duration || "30 minutes")
            .replace("{{type}}", selectedTypes?.join(", ") || "Technical");
        
        console.log("📝 FINAL_PROMPT:", FINAL_PROMPT);
        
        const openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.OPENAI_API_KEY || "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",
            defaultHeaders: {
                "HTTP-Referer": "http://localhost:3000",
                "X-Title": "AI Interview Agent",
            },
        });
        
        console.log("🔑 Using API Key:", process.env.OPENAI_API_KEY ? "Environment Variable" : "Fallback Key");
        
        const completion = await openai.chat.completions.create({
            model: "google/gemini-2.0-flash-exp:free",
            messages: [
                { role: "user", content: FINAL_PROMPT }
            ],
            temperature: 0.7, // Slightly creative but still focused
            max_tokens: 1500,  // Generous length for detailed questions
        });
        
        console.log("✅ API Response:", completion.choices[0].message);
        return NextResponse.json(completion.choices[0].message);
        
    } catch (e) {
        console.error("❌ API Error Details:", {
            message: e.message,
            stack: e.stack,
            name: e.name
        });
        return NextResponse.json({ error: "Failed to generate questions", details: e.message }, { status: 500 });
    }
}