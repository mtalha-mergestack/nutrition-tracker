import type { NextApiRequest, NextApiResponse } from "next";

import OpenAI from "openai";
import { NextResponse } from "next/server";

//add openAi Api key here
const client = new OpenAI({
  apiKey: "",
});

const instructions = `your job is to return JSON object with all nutrition details of the food in the image with the following format
  {
    protein:'90g',
    calories: '100kcl',
    and so on 
  }
   if the image does not contain a food just return "Not a food" do not respond any thing else except JSON or the no food message mentioned before`;

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    const formData = await req.formData();
    const image = formData.get("image");

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: instructions },
            {
              type: "image_url",
              image_url: {
                url: image,
              },
            },
          ],
        },
      ],
    });

    const message = response.choices.pop()?.message.content;
    try {
      const nutrition = JSON.parse(message || "");
      if (nutrition) {
        return NextResponse.json({ data: nutrition });
      } else {
        return NextResponse.json({
          error: "Error while processing, Please try again",
        });
      }
    } catch {
      return NextResponse.json({ message: "Not a food" });
    }
  } catch (error: any) {
    return NextResponse.json({
      error: "Error while processing, Please try again",
    });
  }
}
