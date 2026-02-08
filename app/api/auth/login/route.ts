import { login } from "@/lib/controllers/authController";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  return login(request);
}
