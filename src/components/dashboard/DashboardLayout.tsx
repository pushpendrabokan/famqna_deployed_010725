import React, { useState, useEffect } from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';
import { User } from '../../types';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentUser: User | null;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSignOut: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  currentUser,
  activeTab,
  onTabChange,
  onSignOut
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      // Auto-collapse sidebar on mobile if window resizes
      if (mobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  // Toggle sidebar state when button is clicked
  const toggleSidebar = () => {
    console.log("Toggle sidebar called, current state:", sidebarOpen);
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-deep-400">
      {/* Fixed Header */}
      <DashboardHeader 
        currentUser={currentUser}
        activeTab={activeTab}
        toggleSidebar={toggleSidebar}
        sidebarOpen={sidebarOpen}
      />
      
      {/* Main Layout */}
      <div className="flex pt-16">
        {/* Sidebar */}
        <DashboardSidebar 
          currentUser={currentUser}
          activeTab={activeTab}
          sidebarOpen={sidebarOpen}
          isMobile={isMobile}
          onTabChange={(tab) => {
            onTabChange(tab);
            if (isMobile) setSidebarOpen(false);
          }}
          onSignOut={onSignOut}
          onCloseSidebar={() => setSidebarOpen(false)}
        />
        
        {/* Overlay for mobile */}
        {sidebarOpen && isMobile && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}
        
        {/* Main Content */}
        <main className={`flex-1 min-h-screen transition-all duration-300 ${
          sidebarOpen ? 'lg:pl-64' : 'lg:pl-20'
        }`}>
          <div className="p-4 lg:p-6">
            {children}
          </div>
          
          <footer className="mt-auto py-4 text-center border-t border-gray-600">
            <p className="text-light-300 text-sm">
              © {new Date().getFullYear()} FamQnA. All rights reserved.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;