"use client";

import React, { useState } from "react";
import { Save, User, Bell, Shield, Palette, Globe } from "lucide-react";

import { Sidebar } from "@/components/layout/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "@/components/ui/image-upload";
import toast from "react-hot-toast";
import { useAppSelector,useAppDispatch } from "../../../redux/hooks";
import { StorageService } from "@/lib/firebase";
import { updateUserProfile } from "@/redux/slices/authSlice";
export default function SettingsPage() {

 

  const [isLoading, setIsLoading] = useState(false);
  const [selectedColorScheme, setSelectedColorScheme] = useState("default");

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    commentNotifications: true,
    newPostNotifications: false,
  });

  const [preferences, setPreferences] = useState({
    language: "en",
    timezone: "UTC-8",
    dateFormat: "MM/DD/YYYY",
    postsPerPage: "10",
  });

  const colorSchemes = [
    { id: "default", name: "Default", colors: ["#3b82f6", "#8b5cf6"] },
    { id: "nature", name: "Nature", colors: ["#10b981", "#14b8a6"] },
    { id: "sunset", name: "Sunset", colors: ["#f59e0b", "#ef4444"] },
    { id: "ocean", name: "Ocean", colors: ["#0ea5e9", "#06b6d4"] },
    { id: "purple", name: "Purple", colors: ["#8b5cf6", "#a855f7"] },
    { id: "emerald", name: "Emerald", colors: ["#059669", "#10b981"] },
  ];

 


  

  const handleNotificationsSave = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Notification settings updated!");
    } catch (error) {
      toast.error("Failed to update notifications");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferencesSave = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Preferences updated!");
    } catch (error) {
      toast.error("Failed to update preferences");
    } finally {
      setIsLoading(false);
    }
  };
  const tabs = [
    {
      key: "notifications",
      icon: <Bell className="h-4 w-4" />,
      label: "Notifications",
    },
    {
      key: "appearance",
      icon: <Palette className="h-4 w-4" />,
      label: "Appearance",
    },
    {
      key: "preferences",
      icon: <Globe className="h-4 w-4" />,
      label: "Preferences",
    },
  ];
  const applyColorScheme = (schemeId) => {
    setSelectedColorScheme(schemeId);
    const scheme = colorSchemes.find((s) => s.id === schemeId);
    if (scheme) {
      const root = document.documentElement;
      root.style.setProperty("--color-primary", scheme.colors[0]);
      root.style.setProperty("--color-secondary", scheme.colors[1]);
      localStorage.setItem("color-scheme", schemeId);
      toast.success(`${scheme.name} color scheme applied!`);
    }
  };


  return (
    <div className="flex h-screen bg-gradient-to-br from-background via-background/50 to-muted/30 overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Settings
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>

          <Tabs defaultValue="notifications" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.key} value={tab.key} className="gap-2">
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            {/* Notifications Tab */}
            <TabsContent
              value="notifications"
              className="space-y-4 sm:space-y-6"
            >
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">
                    Notification Preferences
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Choose how you want to be notified about activity
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">
                          Email Notifications
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch
                        checked={notifications.emailNotifications}
                        onCheckedChange={(checked) =>
                          setNotifications((prev) => ({
                            ...prev,
                            emailNotifications: checked,
                          }))
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">
                          Push Notifications
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Receive push notifications in browser
                        </p>
                      </div>
                      <Switch
                        checked={notifications.pushNotifications}
                        onCheckedChange={(checked) =>
                          setNotifications((prev) => ({
                            ...prev,
                            pushNotifications: checked,
                          }))
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">
                          Weekly Digest
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Get a weekly summary of activity
                        </p>
                      </div>
                      <Switch
                        checked={notifications.weeklyDigest}
                        onCheckedChange={(checked) =>
                          setNotifications((prev) => ({
                            ...prev,
                            weeklyDigest: checked,
                          }))
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">
                          Comment Notifications
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Get notified when someone comments
                        </p>
                      </div>
                      <Switch
                        checked={notifications.commentNotifications}
                        onCheckedChange={(checked) =>
                          setNotifications((prev) => ({
                            ...prev,
                            commentNotifications: checked,
                          }))
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">
                          New Post Notifications
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Get notified about new posts
                        </p>
                      </div>
                      <Switch
                        checked={notifications.newPostNotifications}
                        onCheckedChange={(checked) =>
                          setNotifications((prev) => ({
                            ...prev,
                            newPostNotifications: checked,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleNotificationsSave}
                    disabled={isLoading}
                    className="gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {isLoading ? "Saving..." : "Save Preferences"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance Tab */}
            <TabsContent value="appearance" className="space-y-4 sm:space-y-6">
              <Card className="border border-border/50 bg-card/50 backdrop-blur-md shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">
                    Appearance Settings
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    Customize the look and feel of your admin panel.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Theme Toggle */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Theme</Label>
                    <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                      <span className="text-sm text-muted-foreground">
                        Toggle Dark / Light Mode
                      </span>
                      <ThemeToggle />
                    </div>
                  </div>

                  {/* Color Scheme Selector */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Color Scheme</Label>
                    <p className="text-xs text-muted-foreground">
                      Select your preferred accent color scheme.
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
                      {colorSchemes.map((scheme) => (
                        <button
                          key={scheme.id}
                          onClick={() => applyColorScheme(scheme.id)}
                          className={`group relative p-3 rounded-xl border-2 transition-all duration-300 ease-in-out
                ${
                  selectedColorScheme === scheme.id
                    ? "border-primary ring-2 ring-primary/50 bg-primary/10"
                    : "border-border hover:border-primary/70 hover:scale-[1.02]"
                }`}
                        >
                          <div
                            className="w-full h-8 rounded mb-2 shadow-sm"
                            style={{
                              background: `linear-gradient(135deg, ${scheme.colors[0]}, ${scheme.colors[1]})`,
                            }}
                          />
                          <p className="text-xs font-medium text-center">
                            {scheme.name}
                          </p>

                          {selectedColorScheme === scheme.id && (
                            <p className="text-xs text-center text-primary mt-1 font-semibold">
                              Active
                            </p>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-4 sm:space-y-6">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">
                    General Preferences
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Configure your general application preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="language" className="text-sm">
                        Language
                      </Label>
                      <Select
                        value={preferences.language}
                        onValueChange={(value) =>
                          setPreferences((prev) => ({
                            ...prev,
                            language: value,
                          }))
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="timezone" className="text-sm">
                        Timezone
                      </Label>
                      <Select
                        value={preferences.timezone}
                        onValueChange={(value) =>
                          setPreferences((prev) => ({
                            ...prev,
                            timezone: value,
                          }))
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC-8">
                            Pacific Time (UTC-8)
                          </SelectItem>
                          <SelectItem value="UTC-5">
                            Eastern Time (UTC-5)
                          </SelectItem>
                          <SelectItem value="UTC+0">UTC</SelectItem>
                          <SelectItem value="UTC+1">
                            Central European Time (UTC+1)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dateFormat" className="text-sm">
                        Date Format
                      </Label>
                      <Select
                        value={preferences.dateFormat}
                        onValueChange={(value) =>
                          setPreferences((prev) => ({
                            ...prev,
                            dateFormat: value,
                          }))
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="postsPerPage" className="text-sm">
                        Posts Per Page
                      </Label>
                      <Select
                        value={preferences.postsPerPage}
                        onValueChange={(value) =>
                          setPreferences((prev) => ({
                            ...prev,
                            postsPerPage: value,
                          }))
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    onClick={handlePreferencesSave}
                    disabled={isLoading}
                    className="gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {isLoading ? "Saving..." : "Save Preferences"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
