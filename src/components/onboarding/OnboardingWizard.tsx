import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import BankAccountForm from './BankAccountForm';
import KYCForm from './KYCForm';
import PricingSetupForm from './PricingSetupForm';
import PersonalDetailsForm from './PersonalDetailsForm';
import { Creator } from '../../types';
import { updateCreatorBankDetails, updateCreatorKYCDetails, updateUser } from '../../lib/firestore';

interface OnboardingWizardProps {
  creator: Creator;
  onComplete: () => void;
}

type Step = 'personal' | 'bank' | 'kyc' | 'pricing' | 'complete';

type BankDetailsInput = {
  accountNumber: string;
  ifsc: string;
  name: string;
};

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ creator, onComplete }) => {
  const [currentStep, setCurrentStep] = useState<Step>('personal');
  const [isLoading, setIsLoading] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Step[]>([]);
  const [personalDetails, setPersonalDetails] = useState<{dateOfBirth: string; phone: string} | null>(null);
  const [bankDetails, setBankDetails] = useState<Creator['bankDetails'] | null>(null);
  const [kycDetails, setKycDetails] = useState<Creator['kycDetails'] | null>(null);
  const [processingStep, setProcessingStep] = useState<string | null>(null);

  const handlePersonalDetailsSubmit = async (data: { dateOfBirth: string; phone: string }) => {
    setIsLoading(true);
    setProcessingStep('Saving personal details...');
    try {
      await updateUser(creator.id, {
        dateOfBirth: data.dateOfBirth,
        phone: data.phone
      });
      setPersonalDetails(data);
      setCompletedSteps(prev => [...prev, 'personal']);
      setCurrentStep('bank');
    } catch (error) {
      console.error('Error saving personal details:', error);
    } finally {
      setIsLoading(false);
      setProcessingStep(null);
    }
  };

  const handleBankSubmit = async (data: BankDetailsInput) => {
    setIsLoading(true);
    setProcessingStep('Saving bank account details...');
    try {
      const updatedBankDetails = {
        accountNumber: data.accountNumber,
        ifsc: data.ifsc,
        name: data.name,
        status: 'pending' as const // Will be verified when PayU integration is complete
      };
      
      await updateCreatorBankDetails(creator.id, updatedBankDetails);
      setBankDetails(updatedBankDetails);
      setCompletedSteps(prev => [...prev, 'bank']);
      setCurrentStep('kyc');
    } catch (error) {
      console.error('Error saving bank details:', error);
    } finally {
      setIsLoading(false);
      setProcessingStep(null);
    }
  };

  const handleKYCSubmit = async (data: { pan: string; gst?: string }) => {
    setIsLoading(true);
    setProcessingStep('Saving KYC details...');
    try {
      const updatedKycDetails = {
        ...data,
        status: 'pending' as const // Will be verified when PayU integration is complete
      };
      
      await updateCreatorKYCDetails(creator.id, updatedKycDetails);
      setKycDetails(updatedKycDetails);
      setCompletedSteps(prev => [...prev, 'kyc']);
      setCurrentStep('pricing');
    } catch (error) {
      console.error('Error saving KYC details:', error);
    } finally {
      setIsLoading(false);
      setProcessingStep(null);
    }
  };

  const handlePricingSubmit = async (data: Pick<Creator, 'publicPrice' | 'privatePrice'>) => {
    setIsLoading(true);
    setProcessingStep('Updating your profile...');
    
    try {
      // Save pricing information
      await updateUser(creator.id, data);
      setCompletedSteps(prev => [...prev, 'pricing']);
      setCurrentStep('complete');
      onComplete();
    } catch (error) {
      console.error('Error saving pricing details:', error);
    } finally {
      setIsLoading(false);
      setProcessingStep(null);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'personal':
        return <PersonalDetailsForm
          onSubmit={handlePersonalDetailsSubmit}
          isLoading={isLoading}
          initialData={{
            dateOfBirth: creator.dateOfBirth || '',
            phone: creator.phone || ''
          }}
        />;
      case 'bank':
        return <BankAccountForm 
          onSubmit={handleBankSubmit} 
          isLoading={isLoading}
          initialData={creator.bankDetails || undefined}
        />;
      case 'kyc':
        return <KYCForm 
          onSubmit={handleKYCSubmit} 
          isLoading={isLoading}
          initialData={creator.kycDetails || undefined}
        />;
      case 'pricing':
        return <PricingSetupForm 
          onSubmit={handlePricingSubmit} 
          isLoading={isLoading}
          initialData={{
            publicPrice: creator.publicPrice,
            privatePrice: creator.privatePrice
          }}
        />;
      case 'complete':
        return (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-accent-green mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Setup Complete!</h3>
            <p className="text-light-300 mb-4">
              Your creator profile is now ready. You can start receiving questions and earning.
            </p>
            <div className="p-4 bg-accent-blue/10 border border-accent-blue/20 rounded-lg">
              <p className="text-sm text-light-200">
                <strong className="text-white">Note:</strong> Payment processing will be activated when PayU integration is complete.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {['personal', 'bank', 'kyc', 'pricing'].map((step, index) => (
          <div key={step} className="flex items-center">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center
              ${completedSteps.includes(step as Step)
                ? 'bg-accent-green text-white'
                : currentStep === step
                ? 'bg-primary text-white'
                : 'bg-deep-200 text-light-300'}
            `}>
              {completedSteps.includes(step as Step) ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                index + 1
              )}
            </div>
            {index < 3 && (
              <div className={`
                w-full h-1 mx-2
                ${completedSteps.includes(step as Step)
                  ? 'bg-accent-green'
                  : 'bg-deep-200'}
              `} />
            )}
          </div>
        ))}
      </div>

      {/* Processing Indicator */}
      {processingStep && (
        <div className="mb-6 p-4 bg-accent-blue/10 border border-accent-blue/20 rounded-lg">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-accent-blue mr-2"></div>
            <p className="text-accent-blue">{processingStep}</p>
          </div>
        </div>
      )}

      {/* Current Step Form */}
      {renderStep()}
    </div>
  );
};

export default OnboardingWizard;