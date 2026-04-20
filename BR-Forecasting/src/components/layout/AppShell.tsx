import type { PropsWithChildren } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import ChatbotSidebar from "./ChatbotSidebar";
import AlertBanner from "./AlertBanner";

export default function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-sprinkle p-4 text-text">
      <div className="mx-auto flex max-w-[1600px] gap-4">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <TopBar />
          <AlertBanner />
          {children}
        </main>
        <ChatbotSidebar />
      </div>
    </div>
  );
}
