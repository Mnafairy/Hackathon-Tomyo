import { getServerSession } from 'next-auth';
import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const groundingTool = {
  googleSearch: {},
};

const config = {
  tools: [groundingTool],
};

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Нэвтэрнэ үү' }, { status: 401 });
  }

  try {
    const { message } = await req.json();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config,
    });
    const reply = response.text;
    return NextResponse.json({ reply });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
