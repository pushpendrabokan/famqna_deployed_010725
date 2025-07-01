import React, { useState } from 'react';
import { BanIcon as BankIcon } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface BankAccountFormProps {
  onSubmit: (data: {
    accountNumber: string;
    ifsc: string;
    name: string;
  }) => Promise<void>;
  isLoading?: boolean;
  initialData?: {
    accountNumber: string;
    ifsc: string;
    name: string;
  };
}

const BankAccountForm: React.FC<BankAccountFormProps> = ({ onSubmit, isLoading, initialData }) => {
  const [formData, setFormData] = useState({
    accountNumber: initialData?.accountNumber || '',
    ifsc: initialData?.ifsc || '',
    name: initialData?.name || ''
  });
  
  const [errors, setErrors] = useState({
    accountNumber: '',
    ifsc: '',
    name: ''
  });
  
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {
      accountNumber: !formData.accountNumber.trim() ? 'Account number is required' : 
                    formData.accountNumber.length < 9 || formData.accountNumber.length > 18 ? 'Account number must be 9-18 digits' : '',
      ifsc: !formData.ifsc.trim() ? 'IFSC code is required' : 
            !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifsc) ? 'Invalid IFSC format (e.g., SBIN0123456)' : '',
      name: !formData.name.trim() ? 'Account holder name is required' : 
            formData.name.length < 2 ? 'Name must be at least 2 characters' : ''
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setSubmitting(true);
    
    try {
      // Simple validation without external payment gateway verification
      // PayU integration will be added later
      await onSubmit(formData);
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        accountNumber: error instanceof Error 
          ? error.message 
          : 'Failed to save bank account details. Please try again.'
      }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
          <BankIcon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-white">Bank Account Details</h3>
          <p className="text-light-300 text-sm">Connect your bank account to receive payments</p>
        </div>
      </div>

      <Input
        label="Account Number"
        type="text"
        className="bg-deep-200 text-light-100"
        value={formData.accountNumber}
        onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value.replace(/\D/g, '') }))}
        error={errors.accountNumber}
        placeholder="Enter your bank account number (9-18 digits)"
        fullWidth
      />

      <Input
        label="IFSC Code"
        type="text"
        className="bg-deep-200 text-light-100"
        value={formData.ifsc}
        onChange={(e) => setFormData(prev => ({ ...prev, ifsc: e.target.value.toUpperCase() }))}
        error={errors.ifsc}
        placeholder="Enter IFSC code (e.g., SBIN0123456)"
        fullWidth
      />

      <Input
        label="Account Holder Name"
        type="text"
        className="bg-deep-200 text-light-100"
        value={formData.name}
        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        error={errors.name}
        placeholder="Enter account holder name"
        fullWidth
      />

      <Button
        type="submit"
        variant="gradient"
        fullWidth
        isLoading={isLoading || submitting}
      >
        Save Bank Details
      </Button>
      
      <div className="mt-4 p-4 bg-accent-blue/10 border border-accent-blue/20 rounded-lg">
        <p className="text-sm text-light-200 mb-2">
          <strong className="text-white">Note:</strong> Payment processing will be integrated with PayU gateway later.
        </p>
        <p className="text-xs text-light-300">
          Your bank details will be securely stored and verified when the payment system is activated.
        </p>
      </div>
    </form>
  );
};

export default BankAccountForm;