import React, { useRef, useEffect } from 'react';
import { 
  Home, MessageSquare, DollarSign, 
  Settings, LogOut, User,
  Building2 as BankIcon, ClipboardCopy
} from 'lucide-react';
import { User as UserType } from '../../types';
import { Link, useLocation } from 'react-router-dom';
import Button from '../ui/Button';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  section?: 'main' | 'finance' | 'settings';
}

interface DashboardSidebarProps {
  currentUser: UserType | null;
  activeTab: string;
  sidebarOpen: boolean;
  isMobile: boolean;
  onTabChange: (tab: string) => void;
  onSignOut: () => void;
  onCloseSidebar: () => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  currentUser,
  activeTab,
  sidebarOpen,
  isMobile,
  onTabChange,
  onSignOut,
  onCloseSidebar
}) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  
  // Click outside detection for mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onCloseSidebar();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, sidebarOpen, onCloseSidebar]);

  // For debugging
  useEffect(() => {
    console.log("Sidebar state updated:", { sidebarOpen, isMobile });
  }, [sidebarOpen, isMobile]);

  const mainNavigation: NavItem[] = [
    { id: 'home', label: 'Home', icon: Home, path: '/dashboard', section: 'main' },
    { id: 'questions', label: 'Questions', icon: MessageSquare, path: '/dashboard/questions', section: 'main' },
    { id: 'profile', label: 'Profile', icon: User, path: '/dashboard/profile', section: 'main' },
    { id: 'share', label: 'Share Profile', icon: ClipboardCopy, path: '/dashboard/share', section: 'main' },
  ];

  const financeNavigation: NavItem[] = [
    { id: 'income', label: 'Income', icon: DollarSign, path: '/dashboard/income', section: 'finance' },
    { id: 'payments', label: 'Payments', icon: BankIcon, path: '/dashboard/payments', section: 'finance' },
  ];

  const settingsNavigation: NavItem[] = [
    { id: 'settings', label: 'Settings', icon: Settings, path: '/dashboard/settings', section: 'settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') return true;
    return location.pathname.startsWith(path) && path !== '/dashboard';
  };

  const renderSection = (section: 'main' | 'finance' | 'settings', title?: string) => {
    const items = mainNavigation.filter(item => item.section === section)
      .concat(financeNavigation.filter(item => item.section === section))
      .concat(settingsNavigation.filter(item => item.section === section));
    if (!items.length) return null;

    return (
      <div className="mb-6">
        {sidebarOpen && title && (
          <h3 className="px-4 py-2 text-xs font-medium uppercase text-gray-400 mt-6">
            {title}
          </h3>
        )}
        <div className="space-y-1">
          {items.map(item => {
            const active = isActive(item.path);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`
                  w-full flex items-center gap-3
                  px-4 py-3 text-left rounded-lg transition-colors
                  ${sidebarOpen ? '' : 'justify-center'}
                  ${active 
                    ? 'bg-primary/20 text-white' 
                    : 'text-light-300 hover:bg-deep-300'}
                `}
                title={!sidebarOpen ? item.label : undefined}
                onClick={() => onTabChange(item.id)}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 ${active ? 'text-primary' : ''}`} />
                {sidebarOpen && <span className="text-sm whitespace-nowrap overflow-hidden">{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </div>
    );
  };

  // Don't show navigation during onboarding
  if (activeTab === 'onboarding') {
    return (
      <aside 
        ref={sidebarRef}
        className="h-screen fixed top-16 left-0 bg-deep-200 transition-all duration-300 flex flex-col z-50"
      >
        <div className="p-4 flex-1">
          <div className="flex items-center gap-3 mb-8">
            <img 
              src={currentUser?.photoURL}
              alt={currentUser?.name}
              className="w-10 h-10 rounded-full border border-gray-600"
            />
            <div>
              <h3 className="font-medium text-white">{currentUser?.name}</h3>
              <p className="text-xs text-light-300 truncate">{currentUser?.email}</p>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  // Simplify the sidebar positioning logic
  let sidebarClasses = "fixed top-16 left-0 h-[calc(100vh-4rem)] bg-deep-200 z-50 transform transition-all duration-300 ease-in-out";
  
  // Width classes
  sidebarClasses += sidebarOpen ? " w-64" : " w-20";
  
  // Translate X classes - separate for mobile vs desktop
  if (isMobile) {
    sidebarClasses += sidebarOpen ? " translate-x-0" : " -translate-x-full";
  } else {
    sidebarClasses += " translate-x-0"; // Always visible on desktop
  }

  return (
    <aside ref={sidebarRef} className={sidebarClasses}>
      <div className="h-full flex flex-col overflow-y-auto scrollbar-thin pt-6 pb-4">
        {/* Navigation Sections */}
        <div className="px-4 flex-1">
          {renderSection('main')}
          {renderSection('finance', 'Finance')}
          {renderSection('settings', 'Settings')}
          
          {/* Sign Out Button */}
          <button
            onClick={onSignOut}
            className={`
              w-full flex items-center gap-3 mt-2
              px-4 py-3 text-left rounded-lg transition-colors
              ${sidebarOpen ? '' : 'justify-center'}
              text-red-400 hover:bg-red-400/10
            `}
            title={!sidebarOpen ? "Sign Out" : undefined}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {sidebarOpen && <span className="text-sm whitespace-nowrap overflow-hidden">Sign Out</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;