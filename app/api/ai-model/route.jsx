import OpenAI from "openai";
import { NextResponse } from "next/server";
import { QuestionPrompt } from "../../../service/constant";

// OpenRouter API Key
const OPENROUTER_API_KEY = "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";

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

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:3000",
                "X-Title": "Jobite Interview Agent"
            },
            body: JSON.stringify({
                model: "moonshotai/kimi-dev-72b:free",
                messages: [
                    {
                        role: "system",
                        content: `You are an expert technical interviewer. Generate interview questions in the following JSON format EXACTLY:
{
  "interviewQuestions": [
    {
      "question": "detailed question text",
      "type": "one of the provided types"
    }
  ]
}
Only include questions of the types specified. Ensure each question is detailed and relevant to the job position. Focus on practical, real-world scenarios and problem-solving questions.`
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
            console.error("❌ API Error Response:", {
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers),
                error: errorData
            });
            
            // Handle rate limiting specifically
            if (response.status === 429) {
                return NextResponse.json({ 
                    error: "Rate limit exceeded", 
                    details: "Please try again in a few minutes",
                    raw: errorData
                }, { status: 429 });
            }
            
            throw new Error(`API request failed: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        console.log("✅ API Response:", data);

        if (!data.choices?.[0]?.message?.content) {
            throw new Error("Invalid API response format");
        }

        let parsedContent;
        try {
            parsedContent = typeof data.choices[0].message.content === 'string' 
                ? JSON.parse(data.choices[0].message.content)
                : data.choices[0].message.content;

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

        } catch (e) {
            console.error("❌ Failed to parse response:", data.choices[0].message.content);
            throw new Error("Failed to parse API response");
        }

        return NextResponse.json(parsedContent);

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