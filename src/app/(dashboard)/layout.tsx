import { Navbar } from "@/components/Navbar";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="dashboard-layout">
        <main className="dashboard-main">
          {children}
        </main>
      </div>
    </>
  );
}
