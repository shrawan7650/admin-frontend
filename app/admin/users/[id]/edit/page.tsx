"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Upload, X } from "lucide-react";

import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import toast from "react-hot-toast";
import uploadImageToCloudinary from "@/utils/cloudinaryUpload";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { updateUserProfile } from "@/redux/slices/authSlice";
// Mock user data

export default function EditUserPage() {
  const dispatch = useAppDispatch();
  const params = useParams();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editableUser, setEditableUser] = useState(user); // <-- local state
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar);
  console.log("user", user);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    let imageUrl = editableUser?.avatar;
    let cloudinaryPublicId: string | null = null;

    try {
      // Upload new avatar if selected
      if (file) {
        const uploadRes = await uploadImageToCloudinary(file, "avatar");
        imageUrl = uploadRes;
        cloudinaryPublicId = uploadRes?.public_id;
      }

      const updates = { ...editableUser, avatar: imageUrl };

      // Dispatch profile update
      await dispatch(updateUserProfile({ uid: user?.id, updates })).unwrap();

      toast.success("User updated successfully!");
      router.push(`/admin/users/${user?.id}`);
    } catch (error) {
      toast.error("Failed to update user");

      // 🔥 Cloudinary cleanup
      if (cloudinaryPublicId) {
        await fetch(`/api/cloudinary/delete`, {
          method: "POST",
          body: JSON.stringify({ public_id: cloudinaryPublicId }),
          headers: { "Content-Type": "application/json" },
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setAvatarPreview(result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const removeAvatar = () => {
    setAvatarPreview("");
 
  };
  const handleChange = (key: string, value: any) => {
    setEditableUser((prev:any) => {
      if (key.startsWith("socialLinks.")) {
        const field = key.split(".")[1];
        return {
          ...prev,
          socialLinks: { ...prev?.socialLinks, [field]: value },
        };
      } else {
        return { ...prev, [key]: value };
      }
    });
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-background via-background/50 to-muted/30 overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href={`/admin/users/${editableUser?.id}`}>
                <Button variant="outline" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Edit User
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Update user information and settings
                </p>
              </div>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="gap-2 w-full sm:w-auto"
            >
              <Save className="h-4 w-4" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid lg:grid-cols-3 gap-4 sm:gap-6"
          >
            {/* Profile Picture */}
            <div className="lg:col-span-1">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">
                    Profile Picture
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <Avatar className="h-24 w-24 mx-auto mb-4">
                      <AvatarImage
                        src={avatarPreview}
                        alt={editableUser?.name}
                      />
                      <AvatarFallback className="text-xl">
                        {editableUser?.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="space-y-2">
                      <Label htmlFor="avatar" className="cursor-pointer">
                        <div className="flex items-center justify-center gap-2 p-2 border border-border rounded-lg hover:bg-accent transition-colors">
                          <Upload className="h-4 w-4" />
                          <span className="text-sm">Upload Image</span>
                        </div>
                        <Input
                          id="avatar"
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                      </Label>

                      {avatarPreview && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={removeAvatar}
                          className="w-full gap-2"
                        >
                          <X className="h-4 w-4" />
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* User Details */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-sm">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        value={editableUser?.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        className="mt-1 text-sm sm:text-base"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-sm">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        readOnly
                        value={editableUser?.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className="mt-1 text-sm sm:text-base"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="role" className="text-sm">
                        Role
                      </Label>
                      <Select
                        value={editableUser?.role}
                        onValueChange={(value) => handleChange("role", value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          {/* <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="author">Author</SelectItem> */}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="status" className="text-sm">
                        Status
                      </Label>
                      <div className="flex items-center gap-2 mt-2">
                        <Switch
                          id="status"
                          checked={editableUser?.status}
                          onCheckedChange={(checked) =>
                            handleChange("status", checked)
                          }
                        />
                        <span className="text-sm">
                          {editableUser?.status ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio" className="text-sm">
                      Bio
                    </Label>
                    <Textarea
                      id="bio"
                      value={editableUser?.bio}
                      onChange={(e) => handleChange("bio", e.target.value)}
                      placeholder="Tell us about yourself..."
                      className="mt-1 text-sm sm:text-base"
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="location" className="text-sm">
                      Location
                    </Label>
                    <Input
                      id="location"
                      value={editableUser?.location}
                      onChange={(e) => handleChange("location", e.target.value)}
                      placeholder="City, Country"
                      className="mt-1 text-sm sm:text-base"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="twitter" className="text-sm">
                        Twitter
                      </Label>
                      <Input
                        id="twitter"
                        type="url"
                        value={editableUser?.socialLinks?.twitter || ""}
                        onChange={(e) =>
                          handleChange("socialLinks.twitter", e.target.value)
                        }
                        placeholder="https://twitter.com/username"
                        className="mt-1 text-sm sm:text-base"
                      />
                    </div>

                    <div>
                      <Label htmlFor="linkedin" className="text-sm">
                        LinkedIn
                      </Label>
                      <Input
                        id="linkedin"
                        type="url"
                        value={editableUser?.socialLinks?.linkedin || ""}
                        onChange={(e) =>
                          handleChange("socialLinks.linkedin", e.target.value)
                        }
                        placeholder="https://linkedin.com/in/username"
                        className="mt-1 text-sm sm:text-base"
                      />
                    </div>

                    <div>
                      <Label htmlFor="github" className="text-sm">
                        GitHub
                      </Label>
                      <Input
                        id="github"
                        type="url"
                        value={editableUser?.socialLinks?.github || ""}
                        onChange={(e) =>
                          handleChange("socialLinks.github", e.target.value)
                        }
                        placeholder="https://github.com/username"
                        className="mt-1 text-sm sm:text-base"
                      />
                    </div>

                    <div>
                      <Label htmlFor="website" className="text-sm">
                        Website
                      </Label>
                      <Input
                        id="website"
                        type="url"
                        value={editableUser?.socialLinks?.website || ""}
                        onChange={(e) =>
                          handleChange("socialLinks.website", e.target.value)
                        }
                        placeholder="https://example.com"
                        className="mt-1 text-sm sm:text-base"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
