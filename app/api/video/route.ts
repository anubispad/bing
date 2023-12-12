import { auth } from "@clerk/nextjs";
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
      "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
      {
        input: {
          prompt,
        }
      }
    );

    return NextResponse.json(response);
  } catch (error) {
    console.log(error);
    
    return new NextResponse("Something went wrong.", { status: 500 });
  }
}