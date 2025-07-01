import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { User } from '../../types';
import NotificationCenter from '../notifications/NotificationCenter';

interface DashboardHeaderProps {
  currentUser: User | null;
  activeTab: string;
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  currentUser, 
  activeTab, 
  toggleSidebar,
  sidebarOpen
}) => {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'home': return 'Dashboard';
      case 'questions': return 'Questions';
      case 'profile': return 'Profile';
      case 'income': return 'Income';
      case 'payments': return 'Payments';
      case 'settings': return 'Settings';
      case 'share': return 'Share Profile';
      default: return 'Dashboard';
    }
  };

  // Force the toggleSidebar to be a simple function with no dependencies
  const handleToggleClick = () => {
    console.log("Menu button clicked");
    toggleSidebar();
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-deep-200/80 backdrop-blur-lg z-50">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left: Menu Button and Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleClick}
            className="text-light-100 hover:text-primary transition-colors p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            type="button"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <span className="text-xl font-bold">
            <span className="text-white">Fam</span>
            <span className="text-primary">Q</span>
            <span className="text-white">n</span>
            <span className="text-white">A</span>
          </span>
        </div>
        
        {/* Center: Page Title (visible on larger screens) */}
        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
          <h1 className="text-xl font-bold text-white">{getTabTitle()}</h1>
        </div>
        
        {/* Right: Notifications & User */}
        <div className="flex items-center gap-4">
          {/* Notification Center */}
          <NotificationCenter onSettingsClick={() => {}} />
          
          {/* User Profile */}
          {currentUser && (
            <div className="flex items-center gap-2">
              <span className="text-light-100 text-sm hidden md:block">{currentUser.name}</span>
              <img
                src={currentUser.photoURL}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full border border-gray-600 object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;