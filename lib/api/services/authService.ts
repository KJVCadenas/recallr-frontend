import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, AuthToken } from "../models/types";
import { FileStorageService } from "./fileStorageService";
import { randomUUID } from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export class AuthService {
  private storage = new FileStorageService();

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  generateToken(user: User): string {
    const payload: AuthToken = {
      userId: user.id,
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
    };
    return jwt.sign(payload, JWT_SECRET);
  }

  verifyToken(token: string): AuthToken | null {
    try {
      return jwt.verify(token, JWT_SECRET) as AuthToken;
    } catch {
      return null;
    }
  }

  async createUser(email: string, password: string): Promise<User> {
    const existingUser = await this.findUserByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await this.hashPassword(password);
    const user: User = {
      id: randomUUID(),
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    await this.storage.create("users.json", user);
    return user;
  }

  async authenticateUser(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.findUserByEmail(email);
    if (!user) return null;

    const isValid = await this.verifyPassword(password, user.password);
    return isValid ? user : null;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const users = await this.storage.readJsonFile<User>("users.json");
    return users.find((user) => user.email === email) || null;
  }

  async findUserById(id: string): Promise<User | null> {
    return this.storage.findById<User>("users.json", id);
  }
}
