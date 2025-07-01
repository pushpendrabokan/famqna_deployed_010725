import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { phoneVerificationService } from '../../services/PhoneVerificationService';
import toast from 'react-hot-toast';

interface PhoneVerificationProps {
  userId: string;
  phone: string;
  isVerified?: boolean;
  onVerificationComplete: (phone: string) => Promise<void>;
  disabled?: boolean;
  className?: string;
}

const PhoneVerification: React.FC<PhoneVerificationProps> = ({
  userId,
  phone,
  isVerified = false,
  onVerificationComplete,
  disabled = false,
  className = ''
}) => {
  const [verificationState, setVerificationState] = useState<{
    step: 'input' | 'verify';
    isLoading: boolean;
    otpSent: boolean;
    countdown: number;
  }>({
    step: 'input',
    isLoading: false,
    otpSent: false,
    countdown: 0
  });

  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  const startCountdown = () => {
    setVerificationState(prev => ({ ...prev, countdown: 60 }));
    const timer = setInterval(() => {
      setVerificationState(prev => {
        if (prev.countdown <= 1) {
          clearInterval(timer);
          return { ...prev, countdown: 0 };
        }
        return { ...prev, countdown: prev.countdown - 1 };
      });
    }, 1000);
  };

  const handleSendOTP = async () => {
    if (!userId || !phone) return;
    
    setVerificationState(prev => ({ ...prev, isLoading: true }));
    try {
      const success = await phoneVerificationService.sendOTP(userId, phone);
      if (success) {
        setVerificationState(prev => ({
          ...prev,
          step: 'verify',
          otpSent: true,
          isLoading: false
        }));
        startCountdown();
        toast.success('Verification code sent successfully');
      } else {
        toast.error('Failed to send verification code');
      }
    } catch (error) {
      toast.error('Failed to send verification code');
    } finally {
      setVerificationState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleVerifyOTP = async () => {
    if (!userId) return;
    
    setVerificationState(prev => ({ ...prev, isLoading: true }));
    try {
      const success = await phoneVerificationService.verifyOTP(userId, otp);
      if (success) {
        toast.success('Phone number verified successfully');
        await onVerificationComplete(phone);
        setVerificationState(prev => ({ ...prev, step: 'input' }));
        setOtp('');
      } else {
        setOtpError('Invalid verification code');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to verify code';
      setOtpError(errorMessage);
    } finally {
      setVerificationState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {isVerified ? (
        <div className="flex items-center gap-2 text-green-500">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm">Verified</span>
        </div>
      ) : phone && verificationState.step === 'input' ? (
        <Button
          type="button"
          variant="secondary"
          onClick={handleSendOTP}
          isLoading={verificationState.isLoading}
          size="sm"
          disabled={disabled}
        >
          Verify Phone Number
        </Button>
      ) : null}

      {verificationState.step === 'verify' && (
        <div className="space-y-3">
          <Input
            type="text"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value);
              if (otpError) setOtpError('');
            }}
            error={otpError}
            maxLength={6}
            placeholder="Enter 6-digit code"
            fullWidth
          />
          
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="primary"
              onClick={handleVerifyOTP}
              isLoading={verificationState.isLoading}
              size="sm"
            >
              Verify Code
            </Button>

            {verificationState.countdown > 0 ? (
              <span className="text-sm text-light-300">
                Resend in {verificationState.countdown}s
              </span>
            ) : (
              <Button
                type="button"
                variant="ghost"
                onClick={handleSendOTP}
                isLoading={verificationState.isLoading}
                size="sm"
              >
                Resend Code
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhoneVerification; 