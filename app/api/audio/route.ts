
import Replicate from 'replicate';
import { NextResponse } from "next/server";


const configuration = {
  auth: process.env.REPLICATE_API_KEY!,
};

const replicate = new Replicate(configuration);

export async function POST(req: Request) {
  try {

    const { prompt } = await req.json();



    if (!configuration.auth) {
      return new NextResponse("Miss Replicate API Key.", { status: 500 });
    }

    if (!prompt) {
      return new NextResponse("Prompt are required", { status: 400 });
    }

   



    const response = await replicate.run(
      "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
      {
        input: {
          prompt_a: prompt,
        }
      }
    );
  
    return NextResponse.json(response);
  } catch (error) {
    return new NextResponse("Something went wrong.", { status: 500 });
  }
}