import React from 'react';
import { Creator } from '../../types';
import OnboardingWizard from './OnboardingWizard';
import Card from '../ui/Card';

interface OnboardingContainerProps {
  creator: Creator;
  onComplete: () => void;
}

const OnboardingContainer: React.FC<OnboardingContainerProps> = ({ creator, onComplete }) => {
  return (
    <div className="min-h-screen bg-deep-400 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Complete Your Profile</h1>
          <p className="text-light-300">
            Set up your creator profile to start receiving questions and earning
          </p>
        </div>

        <Card className="bg-deep-100">
          <OnboardingWizard creator={creator} onComplete={onComplete} />
        </Card>
      </div>
    </div>
  );
};

export default OnboardingContainer;