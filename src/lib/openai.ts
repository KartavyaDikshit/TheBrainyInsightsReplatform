import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateContent(prompt: string): Promise<string | null> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Or another suitable model
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500, // Adjust as needed
    });
    return completion.choices[0].message?.content || null;
  } catch (error) {
    console.error('Error generating content from OpenAI:', error);
    return null;
  }
}
