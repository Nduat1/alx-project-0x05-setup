import { HEIGHT, WIDTH } from "@/constants";
import { RequestProps } from "@/interfaces";
import { NextApiRequest, NextApiResponse } from "next"


const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  const gptApiKey = process.env.GPT_API_KEY;
  const gptUrl = "https://chatgpt-42.p.rapidapi.com/texttoimage3";

  if (!gptApiKey || !gptUrl) {
    return response.status(500).json({ error: "API key or URL is missing" });
  }

  try {
    const { prompt }: RequestProps = request.body;

    const res = await fetch(gptUrl, {
      method: "POST",
      headers: {
        'x-rapidapi-key': gptApiKey.trim(),
        'x-rapidapi-host': 'chatgpt-42.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: prompt,
        width: WIDTH,
        height: HEIGHT
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API error response:", errorText);
      throw new Error("Failed to fetch from DALLE");
    }

    const data = await res.json();

    return response.status(200).json({
      message: data?.generated_image || "https://via.placeholder.com/600x400?text=Generated+Image",
    });
  } catch (error) {
    console.error("Error in API route:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}
