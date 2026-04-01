"use server";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const groundingTool = {
    googleSearch: {},
};

const config = {
    tools: [groundingTool],
};

export async function POST(req: Request) {
    const { message } = await req.json();
    const prompt = message;
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config
    });
    const reply = response.text;
    return NextResponse.json({ reply });
}
