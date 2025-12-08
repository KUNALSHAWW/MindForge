import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { User, Bell, Shield, Palette } from "lucide-react";
import { Card, CardHeader } from "@/components/Dashboard";

export const metadata = {
  title: "Settings | MindForge",
  description: "Manage your account settings and preferences",
};

export default async function SettingsPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const settingsSections = [
    {
      icon: User,
      title: "Profile",
      description: "Update your personal information and avatar",
      href: "#profile",
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Configure how you receive updates and reminders",
      href: "#notifications",
    },
    {
      icon: Palette,
      title: "Appearance",
      description: "Customize the look and feel of the application",
      href: "#appearance",
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "Manage your privacy settings and account security",
      href: "#privacy",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[hsl(var(--foreground))]">
          Settings
        </h1>
        <p className="text-sm text-[hsl(var(--foreground-muted))] mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Settings Sections */}
      <div className="grid gap-4">
        {settingsSections.map((section) => (
          <Card key={section.title} hover className="cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[hsl(var(--primary)/0.1)] flex items-center justify-center flex-shrink-0">
                <section.icon className="w-5 h-5 text-[hsl(var(--primary))]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-[hsl(var(--foreground))]">
                  {section.title}
                </h3>
                <p className="text-sm text-[hsl(var(--foreground-muted))]">
                  {section.description}
                </p>
              </div>
              <svg
                className="w-5 h-5 text-[hsl(var(--foreground-subtle))]"
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
          </Card>
        ))}
      </div>

      {/* User Info Card */}
      <Card>
        <CardHeader
          title="Account Information"
          description="Your account details from Clerk"
        />
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-lg bg-[hsl(var(--background-secondary))]">
            {user.imageUrl && (
              <Image
                src={user.imageUrl}
                alt="Profile"
                width={64}
                height={64}
                className="w-16 h-16 rounded-full"
              />
            )}
            <div>
              <p className="font-medium text-[hsl(var(--foreground))]">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-sm text-[hsl(var(--foreground-muted))]">
                {user.emailAddresses[0]?.emailAddress}
              </p>
              <p className="text-xs text-[hsl(var(--foreground-subtle))] mt-1">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="border-[hsl(var(--error)/0.3)]">
        <CardHeader
          title="Danger Zone"
          description="Irreversible actions for your account"
        />
        <div className="flex items-center justify-between p-4 rounded-lg bg-[hsl(var(--error)/0.05)]">
          <div>
            <p className="text-sm font-medium text-[hsl(var(--foreground))]">
              Delete Account
            </p>
            <p className="text-sm text-[hsl(var(--foreground-muted))]">
              Permanently delete your account and all data
            </p>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-white bg-[hsl(var(--error))] rounded-lg hover:bg-[hsl(var(--error)/0.9)] transition-colors">
            Delete Account
          </button>
        </div>
      </Card>
    </div>
  );
}
