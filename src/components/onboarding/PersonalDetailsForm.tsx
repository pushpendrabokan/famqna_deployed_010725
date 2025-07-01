import React, { useState } from 'react';
import { User } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useAuth } from '../../hooks/useAuth';
import PhoneVerification from '../verification/PhoneVerification';
import PhoneInput from 'react-phone-number-input';

interface PersonalDetailsFormProps {
  onSubmit: (data: {
    dateOfBirth: string;
    phone: string;
  }) => Promise<void>;
  isLoading?: boolean;
  initialData?: {
    dateOfBirth: string;
    phone: string;
  };
}

const PersonalDetailsForm: React.FC<PersonalDetailsFormProps> = ({ onSubmit, isLoading, initialData }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    dateOfBirth: initialData?.dateOfBirth || '',
    phone: initialData?.phone || ''
  });
  
  const [errors, setErrors] = useState({
    dateOfBirth: '',
    phone: ''
  });

  const validateForm = () => {
    const newErrors = {
      dateOfBirth: '',
      phone: ''
    };

    // Validate date of birth
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      // Check if age is at least 18
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      
      if (calculatedAge < 18) {
        newErrors.dateOfBirth = 'You must be at least 18 years old';
      }
    }

    // Validate phone
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      console.log('Submitting personal details:', formData);
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting personal details:', error);
    }
  };

  const handlePhoneChange = (value: string | undefined) => {
    console.log('Phone number changed:', value);
    setFormData(prev => ({ ...prev, phone: value || '' }));
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  const handlePhoneVerificationComplete = async (phone: string) => {
    console.log('Phone verification completed:', { phone });
    setFormData(prev => ({ ...prev, phone }));
    try {
      await onSubmit({ ...formData, phone });
    } catch (error) {
      console.error('Error updating phone number:', error);
    }
  };

  // Calculate max date (18 years ago from today)
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);
  const maxDateString = maxDate.toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
          <User className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-white">Personal Details</h3>
          <p className="text-light-300 text-sm">Tell us a bit more about yourself</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-light-200 mb-2">Date of Birth</label>
        <Input
          type="date"
          className="bg-deep-200 text-light-100"
          value={formData.dateOfBirth}
          onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
          error={errors.dateOfBirth}
          max={maxDateString}
          fullWidth
        />
        <p className="mt-1 text-xs text-light-300">You must be at least 18 years old</p>
        {errors.dateOfBirth && (
          <p className="mt-1 text-sm text-red-500">{errors.dateOfBirth}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-light-200 mb-2">Phone Number</label>
        <div className={`space-y-3 ${errors.phone ? 'border border-red-500 rounded-lg p-4' : ''}`}>
          <div className="bg-deep-200 rounded-md">
            <PhoneInput
              international
              countryCallingCodeEditable={false}
              defaultCountry="IN"
              value={formData.phone}
              onChange={handlePhoneChange}
              className="bg-deep-200 text-light-100 p-2.5 w-full rounded-md border border-gray-700 focus:ring-primary focus:border-primary"
            />
          </div>
          {formData.phone && (
            <div className="mt-2">
              <PhoneVerification
                userId={currentUser?.id || ''}
                phone={formData.phone}
                onVerificationComplete={handlePhoneVerificationComplete}
                disabled={isLoading || !formData.phone}
                className="w-full"
              />
            </div>
          )}
        </div>
        {errors.phone && (
          <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
        )}
      </div>

      <Button
        type="submit"
        variant="gradient"
        fullWidth
        isLoading={isLoading}
        disabled={isLoading}
      >
        Continue
      </Button>
    </form>
  );
};

export default PersonalDetailsForm; 