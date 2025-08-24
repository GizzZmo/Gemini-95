
import { GoogleGenAI } from "@google/genai";

// Security Note: In a production app, API keys should be handled on the server-side
// For this demo app, the API key should be set as a Vite environment variable: VITE_API_KEY
const API_KEY = import.meta.env.VITE_API_KEY;

if (!API_KEY) {
    console.error("VITE_API_KEY environment variable not set.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

async function generateText(prompt: string): Promise<string> {
    if (!ai) {
        throw new Error("Gemini AI service not initialized. Please check API key configuration.");
    }
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error in generateText:", error);
        throw new Error("Failed to generate text from Gemini.");
    }
}

async function generateTextWithVision(prompt: string, base64Image: string, mimeType: string = "image/png"): Promise<string> {
    if (!ai) {
        throw new Error("Gemini AI service not initialized. Please check API key configuration.");
    }
    
    try {
        const imagePart = {
            inlineData: {
                mimeType: mimeType,
                data: base64Image,
            },
        };
        const textPart = { text: prompt };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [textPart, imagePart] },
        });
        return response.text;
    } catch (error) {
        console.error("Error in generateTextWithVision:", error);
        throw new Error("Failed to generate text with vision from Gemini.");
    }
}

async function generateImage(prompt: string): Promise<string> {
    if (!ai) {
        throw new Error("Gemini AI service not initialized. Please check API key configuration.");
    }
    
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/png',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/png;base64,${base64ImageBytes}`;
        }
        throw new Error("No image was generated.");
    } catch (error) {
        console.error("Error in generateImage:", error);
        throw new Error("Failed to generate image from Imagen.");
    }
}

export const GeminiService = {
    generateStory: () => generateText("Write me a short creative story (250-300 words) with an unexpected twist ending. Make it engaging and suitable for all ages."),
    generateWebsiteHtml: async (domain: string) => {
        const imagePrompt = `A 1996-style web icon or pixel art related to ${domain}, like a spinning globe or a pixelated server.`;
        const imageUrl = await generateImage(imagePrompt);

        const websitePrompt = `
            Create a complete, single-file 90s-style website in HTML.
            MUST include: a relevant image using this exact src: ${imageUrl}. The content must be specific to "${domain}".
            MUST also include: garish 90s styling (e.g., bright colors, maybe a tiled background), content arranged in tables, a scrolling marquee, a blinking text effect, an animated GIF "Under Construction" sign, and a visitor counter.
            The tone should be fun and humorous, as if it were a fan page from 1996.
            Do not include any JavaScript. Respond with ONLY the HTML code.
        `;
        return generateText(websitePrompt);
    },
    critiqueDrawing: (base64Image: string) => generateTextWithVision("Critique this drawing with witty sarcasm (1-2 sentences). Be funny but not mean.", base64Image),
    getMinesweeperHint: (boardState: string) => generateText(`Minesweeper board state:\n${boardState}\nProvide a short, witty hint (1-2 sentences) for a safe move or a dangerous area. Don't reveal exact mine locations unless it's the only logical deduction. Be clever, like a smug AI watching a human play.`),
    getChatResponse: (message: string, history: { role: string; parts: { text: string }[] }[]) => generateText(message), // Simplified for now
};
