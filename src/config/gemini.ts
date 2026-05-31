import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string;

if (!apiKey) {
  console.error(
    'VITE_GEMINI_API_KEY belum diset. Salin .env.example ke .env.local dan masukkan API key kamu.'
  );
}

export const genAI = new GoogleGenerativeAI(apiKey || 'missing-key');

export const calculatorModel = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
  generationConfig: {
    temperature: 0.7,
    topP: 0.95,
    maxOutputTokens: 8192,
    responseMimeType: 'application/json',
  },
});

import { CHATBOT_SYSTEM_PROMPT } from '../constants/prompts';

export const chatModel = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
  systemInstruction: CHATBOT_SYSTEM_PROMPT,
  generationConfig: {
    temperature: 0.9,
    topP: 0.95,
    maxOutputTokens: 1024,
  },
});

export const hasApiKey = !!apiKey;
