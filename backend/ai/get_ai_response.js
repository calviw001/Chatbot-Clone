import OpenAI from "openai";

// Initialize the OpenAI client
const client = new OpenAI({
    baseURL: process.env.AI_URL,   // The API endpoint URL
    apiKey: process.env.AI_API_KEY // The authentication key for the API
});

// Send a message history to an AI chatbot and then return the response back
export async function chatbot(prompts) {
  const response = await client.chat.completions.create({
    model: process.env.AI_MODEL,
    messages: prompts,
    temperature: 0.6,
  });

  // Extract and return only the AI's response
  return response.choices[0].message.content.trim();
}
