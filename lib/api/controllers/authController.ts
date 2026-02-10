import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "../services/authService";
import { loginSchema, profileUpdateSchema } from "../models/schemas";
import { handleApiError } from "../middleware/errorMiddleware";
import { requireAuth } from "../middleware/authMiddleware";

const authService = new AuthService();

async function verifyRecaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    console.error("RECAPTCHA_SECRET_KEY not set");
    return false;
  }

  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`,
    { method: 'POST' }
  );
  const data = await response.json();

  if (!data.success) {
    return false;
  }

  // For v3, check score > 0.5
  if (data.score !== undefined && data.score < 0.5) {
    return false;
  }

  return true;
}

export async function login(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, recaptchaToken } = loginSchema.parse(body);

    // Verify reCAPTCHA
    const isValidRecaptcha = await verifyRecaptcha(recaptchaToken);
    if (!isValidRecaptcha) {
      return NextResponse.json(
        { error: "reCAPTCHA verification failed" },
        { status: 400 },
      );
    }

    const user = await authService.authenticateUser(email, password);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const token = authService.generateToken(user);
    const response = NextResponse.json({
      message: "Login successful",
      user: { id: user.id, email: user.email },
    });

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60, // 24 hours, matching token exp
      path: "/",
    });

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function register(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, recaptchaToken } = loginSchema.parse(body);

    // Verify reCAPTCHA
    const isValidRecaptcha = await verifyRecaptcha(recaptchaToken);
    if (!isValidRecaptcha) {
      return NextResponse.json(
        { error: "reCAPTCHA verification failed" },
        { status: 400 },
      );
    }

    const user = await authService.createUser(email, password);
    const token = authService.generateToken(user);

    const response = NextResponse.json(
      {
        message: "Registration successful",
        user: { id: user.id, email: user.email },
      },
      { status: 201 },
    );

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    });

    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getProfile(request: NextRequest) {
  try {
    const authToken = await requireAuth(request);
    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await authService.findUserById(authToken.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      username: user.username,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function updateProfile(request: NextRequest) {
  try {
    const authToken = await requireAuth(request);
    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await authService.findUserById(authToken.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const updates = profileUpdateSchema.parse(body);

    const updatedUser = await authService.updateUserProfile(user.id, updates);

    return NextResponse.json({
      id: updatedUser.id,
      email: updatedUser.email,
      username: updatedUser.username,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
