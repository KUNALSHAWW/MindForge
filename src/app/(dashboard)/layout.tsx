import { currentUser } from "@clerk/nextjs/server";
import { ReactNode } from "react";
import { DashboardLayout as DashboardLayoutComponent } from "@/components/Dashboard";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await currentUser();
  const userName = user ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() : null;

  return (
    <DashboardLayoutComponent userName={userName}>
      {children}
    </DashboardLayoutComponent>
  );
}
