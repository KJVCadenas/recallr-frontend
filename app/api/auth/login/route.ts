import { login } from "@/lib/api/controllers/authController";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  return login(request);
}
