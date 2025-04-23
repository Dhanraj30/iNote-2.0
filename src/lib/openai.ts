
import { HfInference } from "@huggingface/inference";
import { GoogleGenerativeAI } from "@google/generative-ai";
//import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
// Initialize Hugging Face with your access token
const hf = new HfInference(process.env.HUGGING_FACE_ACCESS_TOKEN!);

export async function generateImagePrompt(name: string): Promise<string> {
  try {
    const prompt = `You are a creative and helpful AI assistant capable of generating interesting thumbnail descriptions for my notes. Your output will be fed into an image generation API to generate a thumbnail. The description should be minimalistic and flat styled. Please generate a thumbnail description for my notebook titled "${name}".`;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    // Use a lighter text generation model
    const response = await model.generateContentStream(prompt);
    // Read the stream and concatenate the chunks
    let image_description = "";
    for await (const chunk of response.stream) {
      const chunkText = chunk.text();
      image_description += chunkText;
    }
    console.log("Gemini AI Response:", image_description);
    //console.log(response.generated_text.trim());
    if (!image_description) {
      throw new Error("No response from Gemini AI");
    }
    return image_description as string;
   // console.log(response.generated_text.trim());

    //return imageDescription;
  } catch (error) {

    console.error("Error generating image prompt:", error);
    throw error;
  }
}

export async function generateImage(image_description: string): Promise<Blob> {
//export const generateImage = async (image_description: string) => {
  try {
    // Use a text-to-image model
    const response = await hf.textToImage({
      model: "black-forest-labs/FLUX.1-dev",//"stabilityai/stable-diffusion-2-1",//"runwayml/stable-diffusion-v1-5", // Replace with a model that returns a URL
      inputs: image_description,
      parameters: {
        height: 512, // Adjust the image size
        width: 512,
        num_inference_steps: 50, // Adjust the number of inference steps for better quality
      },
    });
    //console.log("Hugging Face API response:", response);

     // Ensure the response is a Blob
    if (response instanceof Blob) {
      //const image_url = URL.createObjectURL(response);
      //console.log("Hugging Face API URL:", image_url);
      return response; // Return the URL of the Blob in string 
    } else {
      throw new Error("Unexpected response format from Hugging Face API");
    }
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Error generating image");
  }
}
