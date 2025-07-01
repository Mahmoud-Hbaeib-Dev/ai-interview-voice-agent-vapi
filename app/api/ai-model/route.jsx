import { OpenAI } from "openai";
import { NextResponse } from "next/server";
import { QuestionPrompt } from "../../../service/constant";

export async function POST(req) {
    try {
        const {jobPosition, jobDescription, selectedTypes, duration} = await req.json();

        const FINAL_PROMPT = QuestionPrompt
            .replace("{{jobTitle}}", jobPosition)
            .replace("{{jobDescription}}", jobDescription)
            .replace("{{duration}}", duration)
            .replace("{{type}}", selectedTypes?.join(", ") || "");
        
        console.log("FINAL_PROMPT:", FINAL_PROMPT);
        
        const openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.OPENAI_API_KEY,
        });
        
        const completion = await openai.chat.completions.create({
            model: "google/gemini-2.5-pro",
            messages: [
                { role: "user", content: FINAL_PROMPT }
            ],
        });
        
        console.log("API Response:", completion.choices[0].message);
        return NextResponse.json(completion.choices[0].message);
        
    } catch (e) {
        console.error("API Error:", e);
        return NextResponse.json({ error: "Failed to generate questions" }, { status: 500 });
    }
}