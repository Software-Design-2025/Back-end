import { sendPromptToGemini } from "@/configs/AIModel";
import { NextResponse } from "next/server";

export async function generateVideoScript(req) {
    try {
        const { prompt } = await req.json();
        const text = await sendPromptToGemini(prompt);

        let jsonString = text;
        const jsonMatch = text.match(/```json\s*([\s\S]*?)```/);
        if (jsonMatch) {
            jsonString = jsonMatch[1];
        }
        let jsonResult;
        try {
            jsonResult = JSON.parse(jsonString);
        } catch (e) {
            return NextResponse.json({ error: "AI response is not valid JSON", raw: jsonString }, { status: 500 });
        }

        return NextResponse.json({ result: jsonResult });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
