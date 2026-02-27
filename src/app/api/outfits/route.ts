import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), "backend", "outfits.json");
        const fileContents = fs.readFileSync(filePath, "utf-8");
        const outfits = JSON.parse(fileContents);
        return NextResponse.json(outfits);
    } catch (error) {
        console.error("Error reading outfits.json:", error);
        return NextResponse.json({ error: "Failed to load outfits" }, { status: 500 });
    }
}
