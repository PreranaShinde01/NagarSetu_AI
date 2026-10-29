import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import TitleBar from './TitleBar';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';
import CommandPalette from '../palette/CommandPalette';
import CivicAssistantChatbot from '../chat/CivicAssistantChatbot';

export default function MainLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-100 dark:bg-brand-deepCharcoal overflow-hidden font-sans text-slate-900 dark:text-slate-100 selection:bg-amber-500 selection:text-slate-950 transition-colors duration-200">
      {/* Top Custom Electron Window TitleBar */}
      <TitleBar />

      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          toggleCollapsed={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-100 dark:bg-brand-deepCharcoal transition-colors duration-200">
          {/* Top Header Bar */}
          <TopHeader
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
            onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          />

          {/* Dynamic Page Outlet Container */}
          <main className="flex-1 overflow-y-auto custom-scrollbar p-3 sm:p-6">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Ctrl+K Command Palette Modal Host */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />

      {/* Floating NagarSetu AI Civic Assistant Chatbot */}
      <CivicAssistantChatbot />
    </div>
  );
}
