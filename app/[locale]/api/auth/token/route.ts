import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { JwtUserPayload } from "@/interfaces";

export async function POST(request: Request) {
  try {
    const userData: JwtUserPayload = await request.json();

    const token = jwt.sign(
      {
        id: userData.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
      },
      process.env.NEXT_PUBLIC_JWT_SECRET || "",
      { expiresIn: "1h" },
    );

    return NextResponse.json({
      token,
      expiresIn: 3600,
    });
  } catch (error) {
    console.error("Token generation error:", error);

    return NextResponse.json(
      { error: "Token generation failed", details: error },
      { status: 500 },
    );
  }
}
