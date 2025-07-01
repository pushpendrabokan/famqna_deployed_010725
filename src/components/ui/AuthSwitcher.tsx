import React from 'react';
import { useAuthMode } from '../../context/AuthSwitcher';

const AuthSwitcherToggle: React.FC = () => {
  const { useMockAuth, toggleAuthMode } = useAuthMode();

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      <button
        onClick={toggleAuthMode}
        className="bg-deep-100 text-white px-4 py-3 rounded-lg text-sm shadow-xl border border-primary/50 hover:bg-deep-200 transition-all"
        title={useMockAuth ? "Using mock authentication" : "Using Firebase authentication"}
      >
        {useMockAuth ? "Mock Auth: ON" : "Firebase Auth: ON"}
      </button>
    </div>
  );
};

export default AuthSwitcherToggle;