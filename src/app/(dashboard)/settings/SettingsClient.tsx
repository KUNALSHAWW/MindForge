"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Save,
  Loader2,
  Check,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  AlertTriangle
} from "lucide-react";
import { Card, CardHeader } from "@/components/Dashboard";
import { getSettings, updateSettings, deleteAccount } from "@/lib/actions/settings";

interface SettingsData {
  notifications: {
    email: boolean;
    push: boolean;
    sessionReminders: boolean;
    achievementAlerts: boolean;
    weeklyProgress: boolean;
  };
  appearance: {
    theme: "light" | "dark" | "system";
    reducedMotion: boolean;
    compactMode: boolean;
  };
  privacy: {
    shareProgress: boolean;
    showOnLeaderboard: boolean;
  };
  audio: {
    voiceEnabled: boolean;
    soundEffects: boolean;
  };
}

interface UserInfo {
  imageUrl?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  createdAt?: string;
}

export default function SettingsClient({ userInfo }: { userInfo: UserInfo }) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const [settings, setSettings] = useState<SettingsData>({
    notifications: {
      email: true,
      push: true,
      sessionReminders: true,
      achievementAlerts: true,
      weeklyProgress: true,
    },
    appearance: {
      theme: "dark",
      reducedMotion: false,
      compactMode: false,
    },
    privacy: {
      shareProgress: true,
      showOnLeaderboard: true,
    },
    audio: {
      voiceEnabled: true,
      soundEffects: true,
    },
  });

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      setLoading(true);
      const data = await getSettings();
      if (data.settings) {
        // Type assertion with validation
        const loadedSettings = data.settings as unknown as SettingsData;
        if (loadedSettings.notifications && loadedSettings.appearance && loadedSettings.privacy && loadedSettings.audio) {
          setSettings(loadedSettings);
        }
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setLoading(false);
    }
  }

  async function saveSettings() {
    try {
      setSaving(true);
      await updateSettings(settings as unknown as Record<string, unknown>);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteAccount() {
    try {
      setDeleting(true);
      await deleteAccount();
      router.push("/");
    } catch (error) {
      console.error("Failed to delete account:", error);
      setDeleting(false);
    }
  }

  function updateSetting<K extends keyof SettingsData>(
    category: K,
    key: keyof SettingsData[K],
    value: boolean | string
  ) {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  }

  const settingsSections = [
    {
      id: "notifications",
      icon: Bell,
      title: "Notifications",
      description: "Configure how you receive updates and reminders",
    },
    {
      id: "appearance",
      icon: Palette,
      title: "Appearance",
      description: "Customize the look and feel of the application",
    },
    {
      id: "audio",
      icon: Volume2,
      title: "Audio & Voice",
      description: "Manage voice assistant and sound settings",
    },
    {
      id: "privacy",
      icon: Shield,
      title: "Privacy & Security",
      description: "Manage your privacy settings and account security",
    },
  ];

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[hsl(var(--primary))]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[hsl(var(--foreground))]">
            Settings
          </h1>
          <p className="text-sm text-[hsl(var(--foreground-muted))] mt-1">
            Manage your account settings and preferences
          </p>
        </div>
        <button
          onClick={saveSettings}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary))] text-white rounded-lg hover:bg-[hsl(var(--primary)/0.9)] transition-colors disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saved ? (
            <Check className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {/* User Info Card */}
      <Card>
        <CardHeader
          title="Account Information"
          description="Your account details"
        />
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-lg bg-[hsl(var(--background-secondary))]">
            {userInfo.imageUrl && (
              <Image
                src={userInfo.imageUrl}
                alt="Profile"
                width={64}
                height={64}
                className="w-16 h-16 rounded-full"
              />
            )}
            <div>
              <p className="font-medium text-[hsl(var(--foreground))]">
                {userInfo.firstName} {userInfo.lastName}
              </p>
              <p className="text-sm text-[hsl(var(--foreground-muted))]">
                {userInfo.email}
              </p>
              {userInfo.createdAt && (
                <p className="text-xs text-[hsl(var(--foreground-subtle))] mt-1">
                  Member since {new Date(userInfo.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Settings Sections */}
      <div className="grid gap-4">
        {settingsSections.map((section) => (
          <Card key={section.id}>
            <button
              onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
              className="w-full"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[hsl(var(--primary)/0.1)] flex items-center justify-center flex-shrink-0">
                  <section.icon className="w-5 h-5 text-[hsl(var(--primary))]" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <h3 className="text-sm font-medium text-[hsl(var(--foreground))]">
                    {section.title}
                  </h3>
                  <p className="text-sm text-[hsl(var(--foreground-muted))]">
                    {section.description}
                  </p>
                </div>
                <svg
                  className={`w-5 h-5 text-[hsl(var(--foreground-subtle))] transition-transform ${
                    activeSection === section.id ? "rotate-90" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </button>

            {/* Expanded Section Content */}
            {activeSection === section.id && (
              <div className="mt-4 pt-4 border-t border-[hsl(var(--border))] space-y-4">
                {section.id === "notifications" && (
                  <>
                    <ToggleSetting
                      label="Email Notifications"
                      description="Receive updates via email"
                      checked={settings.notifications.email}
                      onChange={(v) => updateSetting("notifications", "email", v)}
                    />
                    <ToggleSetting
                      label="Push Notifications"
                      description="Browser push notifications"
                      checked={settings.notifications.push}
                      onChange={(v) => updateSetting("notifications", "push", v)}
                    />
                    <ToggleSetting
                      label="Session Reminders"
                      description="Remind me to study daily"
                      checked={settings.notifications.sessionReminders}
                      onChange={(v) => updateSetting("notifications", "sessionReminders", v)}
                    />
                    <ToggleSetting
                      label="Achievement Alerts"
                      description="Notify when I earn achievements"
                      checked={settings.notifications.achievementAlerts}
                      onChange={(v) => updateSetting("notifications", "achievementAlerts", v)}
                    />
                    <ToggleSetting
                      label="Weekly Progress Report"
                      description="Receive weekly summary"
                      checked={settings.notifications.weeklyProgress}
                      onChange={(v) => updateSetting("notifications", "weeklyProgress", v)}
                    />
                  </>
                )}

                {section.id === "appearance" && (
                  <>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-[hsl(var(--background-secondary))]">
                      <div>
                        <p className="text-sm font-medium text-[hsl(var(--foreground))]">
                          Theme
                        </p>
                        <p className="text-sm text-[hsl(var(--foreground-muted))]">
                          Choose your preferred color theme
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {(["light", "dark", "system"] as const).map((theme) => (
                          <button
                            key={theme}
                            onClick={() => updateSetting("appearance", "theme", theme)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                              settings.appearance.theme === theme
                                ? "bg-[hsl(var(--primary))] text-white"
                                : "bg-[hsl(var(--background))] text-[hsl(var(--foreground-muted))] hover:bg-[hsl(var(--border))]"
                            }`}
                          >
                            {theme === "light" && <Sun className="w-4 h-4" />}
                            {theme === "dark" && <Moon className="w-4 h-4" />}
                            {theme === "system" && <User className="w-4 h-4" />}
                            <span className="capitalize">{theme}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <ToggleSetting
                      label="Reduced Motion"
                      description="Minimize animations"
                      checked={settings.appearance.reducedMotion}
                      onChange={(v) => updateSetting("appearance", "reducedMotion", v)}
                    />
                    <ToggleSetting
                      label="Compact Mode"
                      description="Reduce spacing between elements"
                      checked={settings.appearance.compactMode}
                      onChange={(v) => updateSetting("appearance", "compactMode", v)}
                    />
                  </>
                )}

                {section.id === "audio" && (
                  <>
                    <ToggleSetting
                      label="Voice Assistant"
                      description="Enable AI voice interactions"
                      checked={settings.audio.voiceEnabled}
                      onChange={(v) => updateSetting("audio", "voiceEnabled", v)}
                      icon={settings.audio.voiceEnabled ? Volume2 : VolumeX}
                    />
                    <ToggleSetting
                      label="Sound Effects"
                      description="Play sounds for achievements and actions"
                      checked={settings.audio.soundEffects}
                      onChange={(v) => updateSetting("audio", "soundEffects", v)}
                    />
                  </>
                )}

                {section.id === "privacy" && (
                  <>
                    <ToggleSetting
                      label="Share Progress"
                      description="Allow others to see your learning progress"
                      checked={settings.privacy.shareProgress}
                      onChange={(v) => updateSetting("privacy", "shareProgress", v)}
                    />
                    <ToggleSetting
                      label="Show on Leaderboard"
                      description="Appear in public leaderboards"
                      checked={settings.privacy.showOnLeaderboard}
                      onChange={(v) => updateSetting("privacy", "showOnLeaderboard", v)}
                    />
                  </>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Danger Zone */}
      <Card className="border-[hsl(var(--error)/0.3)]">
        <CardHeader
          title="Danger Zone"
          description="Irreversible actions for your account"
        />
        {!showDeleteConfirm ? (
          <div className="flex items-center justify-between p-4 rounded-lg bg-[hsl(var(--error)/0.05)]">
            <div>
              <p className="text-sm font-medium text-[hsl(var(--foreground))]">
                Delete Account
              </p>
              <p className="text-sm text-[hsl(var(--foreground-muted))]">
                Permanently delete your account and all data
              </p>
            </div>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-[hsl(var(--error))] rounded-lg hover:bg-[hsl(var(--error)/0.9)] transition-colors"
            >
              Delete Account
            </button>
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-[hsl(var(--error)/0.1)] border border-[hsl(var(--error)/0.3)]">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-[hsl(var(--error))] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-[hsl(var(--foreground))]">
                  Are you absolutely sure?
                </p>
                <p className="text-sm text-[hsl(var(--foreground-muted))] mt-1">
                  This action cannot be undone. This will permanently delete your account,
                  all your companions, session history, and achievements.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-[hsl(var(--foreground))] bg-[hsl(var(--background-secondary))] rounded-lg hover:bg-[hsl(var(--border))] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[hsl(var(--error))] rounded-lg hover:bg-[hsl(var(--error)/0.9)] transition-colors disabled:opacity-50"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                {deleting ? "Deleting..." : "Yes, delete my account"}
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

interface ToggleSettingProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  icon?: React.ComponentType<{ className?: string }>;
}

function ToggleSetting({ label, description, checked, onChange, icon: Icon }: ToggleSettingProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-[hsl(var(--background-secondary))]">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="w-5 h-5 text-[hsl(var(--foreground-muted))]" />}
        <div>
          <p className="text-sm font-medium text-[hsl(var(--foreground))]">
            {label}
          </p>
          <p className="text-sm text-[hsl(var(--foreground-muted))]">
            {description}
          </p>
        </div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          checked ? "bg-[hsl(var(--primary))]" : "bg-[hsl(var(--border))]"
        }`}
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </button>
    </div>
  );
}
