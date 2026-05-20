export type AIGenerateType = 
  | 'website' 
  | 'profile' 
  | 'blog' 
  | 'faq' 
  | 'admissions' 
  | 'seo' 
  | 'caption' 
  | 'recommendation';

export interface AIGenerateResponse {
  text: string;
  error?: string;
}

export async function generateAIContent(
  prompt: string, 
  type: AIGenerateType, 
  options?: { imageData?: string; mimeType?: string }
): Promise<AIGenerateResponse> {
  try {
    const response = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        prompt, 
        type, 
        imageData: options?.imageData, 
        mimeType: options?.mimeType 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate AI content");
    }

    return await response.json();
  } catch (error: any) {
    console.error("AI Generation Service Error:", error);
    return { text: "", error: error.message };
  }
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export async function chatWithAI(
  messages: ChatMessage[], 
  schoolContext: any
): Promise<AIGenerateResponse> {
  try {
    const response = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, schoolContext }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to chat with AI");
    }

    return await response.json();
  } catch (error: any) {
    console.error("AI Chat Service Error:", error);
    return { text: "", error: error.message };
  }
}
