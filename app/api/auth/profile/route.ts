import { getProfile, updateProfile } from "@/lib/api/controllers/authController";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return getProfile(request);
}

export async function PUT(request: NextRequest) {
  return updateProfile(request);
}