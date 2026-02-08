import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "../services/authService";
import { loginSchema } from "../models/schemas";
import { handleApiError } from "../middleware/errorMiddleware";

const authService = new AuthService();

export async function login(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    const user = await authService.authenticateUser(email, password);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const token = authService.generateToken(user);
    return NextResponse.json({
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function register(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    const user = await authService.createUser(email, password);
    const token = authService.generateToken(user);

    return NextResponse.json(
      { token, user: { id: user.id, email: user.email } },
      { status: 201 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
