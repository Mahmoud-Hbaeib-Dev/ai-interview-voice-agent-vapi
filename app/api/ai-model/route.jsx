import OpenAI from "openai";
import { NextResponse } from "next/server";
import { QuestionPrompt, SystemPrompt, AI_MODELS } from "../../../service/constant";

// OpenRouter API Key
const OPENROUTER_API_KEY = "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";

async function tryModel(model, FINAL_PROMPT, retryCount = 0) {
    try {
        console.log(`📝 Trying model: ${model.name} (Attempt ${retryCount + 1})`);
        
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:3000",
                "X-Title": "Jobite Interview Agent"
            },
            body: JSON.stringify({
                model: model.id,
                messages: [
                    {
                        role: "system",
                        content: SystemPrompt
                    },
                    {
                        role: "user",
                        content: FINAL_PROMPT
                    }
                ],
                temperature: 0.7,
                max_tokens: 2000,
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API request failed: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error(`❌ Error with model ${model.name}:`, error);
        return { success: false, error };
    }
}

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

        // Try each model in sequence until one succeeds
        let lastError = null;
        for (const model of AI_MODELS) {
            const result = await tryModel(model, FINAL_PROMPT);
            if (result.success) {
                console.log(`✅ Successfully used model: ${model.name}`);
                
                let parsedContent;
                try {
                    parsedContent = typeof result.data.choices[0].message.content === 'string' 
                        ? JSON.parse(result.data.choices[0].message.content)
                        : result.data.choices[0].message.content;

                    // Validate and clean up the response
                    if (!parsedContent.interviewQuestions || !Array.isArray(parsedContent.interviewQuestions)) {
                        throw new Error("Invalid response format - missing questions array");
                    }

                    // Ensure all questions have the required fields and proper type
                    parsedContent.interviewQuestions = parsedContent.interviewQuestions
                        .filter(q => q && q.question && q.type)
                        .map(q => ({
                            question: q.question.trim(),
                            type: selectedTypes.includes(q.type) ? q.type : selectedTypes[0]
                        }));

                    if (parsedContent.interviewQuestions.length === 0) {
                        throw new Error("No valid questions generated");
                    }

                    return NextResponse.json({
                        ...parsedContent,
                        modelUsed: model.name
                    });
                } catch (e) {
                    console.error(`❌ Failed to parse response from ${model.name}:`, e);
                    lastError = e;
                    continue; // Try next model
                }
            }
            lastError = result.error;
        }

        // If we get here, all models failed
        throw new Error(`All models failed. Last error: ${lastError?.message || 'Unknown error'}`);
        
    } catch (error) {
        console.error("❌ Error:", error);
        return NextResponse.json(
            { 
                error: "Failed to generate questions",
                details: error.toString(),
                message: error.message
            },
            { status: error.response?.status || 500 }
        );
    }
}