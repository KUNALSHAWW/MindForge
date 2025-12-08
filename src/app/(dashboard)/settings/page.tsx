import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SettingsClient from "./SettingsClient";

export const metadata = {
  title: "Settings | MindForge",
  description: "Manage your account settings and preferences",
};

export default async function SettingsPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const userInfo = {
    imageUrl: user.imageUrl,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.emailAddresses[0]?.emailAddress || "",
    createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : undefined,
  };

  return <SettingsClient userInfo={userInfo} />;
}
