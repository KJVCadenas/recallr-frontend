"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { validateAndSanitizeProfileUpdate } from "@/lib/frontend/validation";
import { useState, useEffect, useRef } from "react";

export default function ProfilePage() {
  const { data: profile, isLoading: isLoadingProfile } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const [successMessage, setSuccessMessage] = useState("");

  const usernameRef = useRef<HTMLInputElement>(null);
  const currentPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    username?: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  // Update form when profile loads
  useEffect(() => {
    if (profile) {
      usernameRef.current!.value = profile.username || "";
      currentPasswordRef.current!.value = "";
      newPasswordRef.current!.value = "";
      confirmPasswordRef.current!.value = "";
    }
  }, [profile]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSuccessMessage("");
    setFieldErrors({});

    const username = usernameRef.current?.value || "";
    const currentPassword = currentPasswordRef.current?.value || "";
    const newPassword = newPasswordRef.current?.value || "";
    const confirmPassword = confirmPasswordRef.current?.value || "";

    const validation = validateAndSanitizeProfileUpdate({
      username,
      currentPassword,
      newPassword,
      confirmPassword,
    });

    if (!validation.success) {
      setFieldErrors(validation.fieldErrors);
      return;
    }

    try {
      await updateProfileMutation.mutateAsync(validation.data);
      setSuccessMessage("Profile updated successfully!");
      currentPasswordRef.current!.value = "";
      newPasswordRef.current!.value = "";
      confirmPasswordRef.current!.value = "";
    } catch (error) {
      console.error("Profile update failed:", error);
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-lg">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-lg text-red-500">Failed to load profile</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {successMessage && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800">{successMessage}</p>
            </div>
          )}

          {updateProfileMutation.isError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">
                {updateProfileMutation.error?.message || "Failed to update profile"}
              </p>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Email - Read Only */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                disabled
                className="bg-gray-50"
              />
              <p className="text-sm text-gray-500">
                Email cannot be changed. Contact support if needed.
              </p>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">Username (Optional)</Label>
              <Input
                id="username"
                ref={usernameRef}
                defaultValue=""
                placeholder="Enter a username"
              />
              {fieldErrors.username && (
                <p className="text-sm text-red-600">{fieldErrors.username}</p>
              )}
            </div>

            {/* Password Change Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Change Password</h3>
              <p className="text-sm text-gray-500">
                Leave blank if you don&apos;t want to change your password.
              </p>

              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  ref={currentPasswordRef}
                  defaultValue=""
                  placeholder="Enter current password"
                />
                {fieldErrors.currentPassword && (
                  <p className="text-sm text-red-600">{fieldErrors.currentPassword}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  ref={newPasswordRef}
                  defaultValue=""
                  placeholder="Enter new password"
                />
                {fieldErrors.newPassword && (
                  <p className="text-sm text-red-600">{fieldErrors.newPassword}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  ref={confirmPasswordRef}
                  defaultValue=""
                  placeholder="Confirm new password"
                />
                {fieldErrors.confirmPassword && (
                  <p className="text-sm text-red-600">{fieldErrors.confirmPassword}</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="w-full"
            >
              {updateProfileMutation.isPending ? "Updating..." : "Update Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}