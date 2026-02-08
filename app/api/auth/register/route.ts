import { register } from "@/lib/api/controllers/authController";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  return register(request);
}
