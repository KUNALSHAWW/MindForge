"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { useClerk } from "@clerk/nextjs";
import { toast } from "sonner";
import { Download, Mic, Monitor, Moon, Sun, Trash2, Volume2 } from "lucide-react";
import { Card, CardHeader } from "@/components/Dashboard";
import { deleteAccount, exportUserData, updateProfile, updateSettings, type ProfileAndSettings } from "@/lib/actions/settings";
import type { Settings } from "@/lib/validators";

interface UserInfo {
  imageUrl: string;
  email: string;
  createdAt?: string;
}

const inputClass =
  "w-full px-3 py-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]";
const buttonClass =
  "px-4 py-2 rounded-lg bg-[hsl(var(--primary))] text-white text-sm font-medium hover:bg-[hsl(var(--primary)/0.9)] disabled:opacity-50 transition-colors";

export default function SettingsClient({ userInfo, initial }: { userInfo: UserInfo; initial: ProfileAndSettings }) {
  const { setTheme } = useTheme();
  const { signOut } = useClerk();
  const [name, setName] = useState(initial.name);
  const [bio, setBio] = useState(initial.bio);
  const [settings, setSettings] = useState<Settings>(initial.settings);
  const [busy, setBusy] = useState<string | null>(null);
  const [confirmText, setConfirmText] = useState("");

  async function run<T>(key: string, action: () => Promise<{ success: true; data: T } | { success: false; error: string }>, success?: string) {
    setBusy(key);
    const result = await action();
    setBusy(null);
    if (!result.success) {
      toast.error(result.error);
      return null;
    }
    if (success) toast.success(success);
    return result.data;
  }

  function changeSettings(next: Settings) {
    setSettings(next);
    run("settings", () => updateSettings(next), "Preferences saved");
  }

  async function handleExport() {
    const data = await run("export", exportUserData);
    if (!data) return;
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
    const link = Object.assign(document.createElement("a"), { href: url, download: `mindforge-export-${new Date().toISOString().slice(0, 10)}.json` });
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleDelete() {
    const done = await run("delete", deleteAccount);
    if (done !== null) await signOut({ redirectUrl: "/" });
  }

  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ] as const;

  return (
    <div className="space-y-6">
      {initial.demo && (
        <p className="text-sm text-[hsl(var(--foreground-muted))]">Demo mode: changes cannot be saved until a database is connected.</p>
      )}

      <Card>
        <CardHeader title="Profile" description={`${userInfo.email}${userInfo.createdAt ? ` · member since ${new Date(userInfo.createdAt).toLocaleDateString()}` : ""}`} />
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            run("profile", () => updateProfile({ name, bio }), "Profile updated");
          }}
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1">Display name</label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} required className={inputClass} />
          </div>
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-[hsl(var(--foreground))] mb-1">Learning goals</label>
            <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} maxLength={500} rows={3} placeholder="e.g. Preparing for JEE physics, comfortable with calculus" className={inputClass} />
          </div>
          <button type="submit" disabled={busy === "profile"} className={buttonClass}>
            {busy === "profile" ? "Saving…" : "Save profile"}
          </button>
        </form>
      </Card>

      <Card>
        <CardHeader title="Appearance" />
        <div className="grid grid-cols-3 gap-3" role="radiogroup" aria-label="Theme">
          {themes.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              role="radio"
              aria-checked={settings.appearance.theme === value}
              onClick={() => {
                setTheme(value);
                changeSettings({ ...settings, appearance: { theme: value } });
              }}
              className={`p-3 rounded-lg border text-sm flex flex-col items-center gap-2 transition-colors ${
                settings.appearance.theme === value
                  ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.06)] text-[hsl(var(--primary))]"
                  : "border-[hsl(var(--border))] text-[hsl(var(--foreground-muted))]"
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader title="Learning" description="How your tutors talk to you and how much you review" />
        <div className="space-y-3">
          <Toggle
            icon={Mic}
            label="Voice conversations"
            description="Show the microphone button for hands-free sessions (Chrome, Edge, Safari)"
            checked={settings.learning.voiceEnabled}
            onChange={(voiceEnabled) => changeSettings({ ...settings, learning: { ...settings.learning, voiceEnabled } })}
          />
          <Toggle
            icon={Volume2}
            label="Read replies aloud"
            description="Tutors speak their answers in the voice you chose for them"
            checked={settings.learning.autoSpeak}
            onChange={(autoSpeak) => changeSettings({ ...settings, learning: { ...settings.learning, autoSpeak } })}
          />
          <div className="flex items-center justify-between p-3 rounded-lg bg-[hsl(var(--background-secondary))]">
            <label htmlFor="goal" className="text-sm">
              <span className="block font-medium text-[hsl(var(--foreground))]">Daily review goal</span>
              <span className="text-[hsl(var(--foreground-muted))]">Flashcards per day shown on the review page</span>
            </label>
            <input
              id="goal"
              type="number"
              min={5}
              max={500}
              step={5}
              value={settings.learning.dailyReviewGoal}
              onChange={(e) => setSettings({ ...settings, learning: { ...settings.learning, dailyReviewGoal: Number(e.target.value) } })}
              onBlur={() => changeSettings(settings)}
              className="w-24 px-3 py-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-right"
            />
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Your data" description="Download everything MindForge stores about you as JSON" />
        <button onClick={handleExport} disabled={busy === "export"} className={`${buttonClass} inline-flex items-center gap-2`}>
          <Download className="w-4 h-4" />
          {busy === "export" ? "Preparing…" : "Export my data"}
        </button>
      </Card>

      <Card className="border-red-500/30">
        <CardHeader title="Delete account" description="Permanently deletes your sessions, companions, notes, flashcards, achievements and your sign-in account." />
        <div className="flex flex-col sm:flex-row gap-3">
          <label htmlFor="confirm-delete" className="sr-only">Type DELETE to confirm</label>
          <input id="confirm-delete" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} placeholder="Type DELETE to confirm" className={`${inputClass} sm:max-w-xs`} />
          <button
            onClick={handleDelete}
            disabled={confirmText !== "DELETE" || busy === "delete"}
            className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 disabled:opacity-40 inline-flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            {busy === "delete" ? "Deleting…" : "Delete account"}
          </button>
        </div>
      </Card>
    </div>
  );
}

function Toggle({ icon: Icon, label, description, checked, onChange }: {
  icon: React.ElementType;
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-3 rounded-lg bg-[hsl(var(--background-secondary))]">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-[hsl(var(--foreground-muted))]" />
        <div>
          <p className="text-sm font-medium text-[hsl(var(--foreground))]">{label}</p>
          <p className="text-sm text-[hsl(var(--foreground-muted))]">{description}</p>
        </div>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 shrink-0 rounded-full transition-colors ${checked ? "bg-[hsl(var(--primary))]" : "bg-[hsl(var(--border))]"}`}
      >
        <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${checked ? "translate-x-5" : ""}`} />
      </button>
    </div>
  );
}
