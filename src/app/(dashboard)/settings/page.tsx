import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getProfileAndSettings } from "@/lib/actions/settings";
import { DEFAULT_SETTINGS } from "@/lib/validators";
import SettingsClient from "./SettingsClient";

export const metadata = {
  title: "Settings",
  description: "Manage your profile, learning preferences and data",
};

export default async function SettingsPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const result = await getProfileAndSettings();
  const initial = result.success
    ? result.data
    : { name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(), bio: "", settings: DEFAULT_SETTINGS, demo: true };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[hsl(var(--foreground))]">Settings</h1>
        <p className="text-sm text-[hsl(var(--foreground-muted))] mt-1">Profile, learning preferences and your data</p>
      </div>
      <SettingsClient
        userInfo={{
          imageUrl: user.imageUrl,
          email: user.emailAddresses[0]?.emailAddress ?? "",
          createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : undefined,
        }}
        initial={initial}
      />
    </div>
  );
}
