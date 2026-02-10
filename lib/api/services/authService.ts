import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, AuthToken } from "../models/types";
import { ProfileUpdateInput } from "../models/schemas";
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

  async createUser(email: string, password: string, username?: string): Promise<User> {
    const existingUser = await this.findUserByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    if (username) {
      const existingUsername = await this.findUserByUsername(username);
      if (existingUsername) {
        throw new Error("Username already taken");
      }
    }

    const hashedPassword = await this.hashPassword(password);
    const user: User = {
      id: randomUUID(),
      email,
      username,
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

  async findUserByUsername(username: string): Promise<User | null> {
    const users = await this.storage.readJsonFile<User>("users.json");
    return users.find((user) => user.username === username) || null;
  }

  async updateUserProfile(userId: string, updates: ProfileUpdateInput): Promise<User> {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // If updating password, verify current password
    if (updates.newPassword) {
      if (!updates.currentPassword) {
        throw new Error("Current password is required to change password");
      }
      const isCurrentValid = await this.verifyPassword(updates.currentPassword, user.password);
      if (!isCurrentValid) {
        throw new Error("Current password is incorrect");
      }
    }

    // Check username uniqueness if updating
    if (updates.username && updates.username !== user.username) {
      const existingUsername = await this.findUserByUsername(updates.username);
      if (existingUsername) {
        throw new Error("Username already taken");
      }
    }

    // Update user
    const updatedUser: User = {
      ...user,
      username: updates.username !== undefined ? updates.username : user.username,
      password: updates.newPassword ? await this.hashPassword(updates.newPassword) : user.password,
    };

    await this.storage.update("users.json", userId, updatedUser);
    return updatedUser;
  }
}
