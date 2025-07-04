import { FEEDBACK_PROMPT, AI_MODELS, SystemPrompt } from "../../../service/constant";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export async function POST(req) { 
    const { conversation } = await req.json();
    const FINAL_PROMPT = FEEDBACK_PROMPT.replace("{{conversation}}", JSON.stringify(conversation));
    
    // Try each model in order until one succeeds
    for (let i = 0; i < AI_MODELS.length; i++) {
        const model = AI_MODELS[i];
        const retryCount = i;
        
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
            console.log(`✅ Success with model: ${model.name}`);
            
            return new Response(JSON.stringify({ 
                success: true, 
                data: data.choices[0].message.content,
                model: model.name 
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
            
        } catch (error) {
            console.error(`❌ Error with model ${model.name}:`, error);
            
            // If this is the last model, return the error
            if (i === AI_MODELS.length - 1) {
                return new Response(JSON.stringify({ 
                    success: false, 
                    error: error.message 
                }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            
            // Continue to next model
            continue;
        }
    }
    
    // Fallback error (shouldn't reach here)
    return new Response(JSON.stringify({ 
        success: false, 
        error: "All models failed" 
    }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
    });
}





