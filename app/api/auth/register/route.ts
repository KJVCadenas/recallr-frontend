import { register } from "@/lib/controllers/authController";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  return register(request);
}
