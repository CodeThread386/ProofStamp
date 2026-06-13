require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

async function test() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: 'navigate to stamps page' }] }],
      config: {
        tools: [{
          functionDeclarations: [
            {
              name: 'navigate_to',
              description: 'Navigate to a route',
              parameters: {
                type: 'OBJECT',
                properties: { route: { type: 'STRING' } }
              }
            }
          ]
        }]
      }
    });
    console.log(JSON.stringify(response, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
}
test();
