
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const fullPrompt = `Complete the following text in a short and concise way: ##${prompt}##`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContentStream(fullPrompt);

    let completionText = "";
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      completionText += chunkText;
    }

    console.log("Gemini AI Response:", completionText);
    if (!completionText) {
      throw new Error("No response from Gemini AI");
    }

    return NextResponse.json(completionText);
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}