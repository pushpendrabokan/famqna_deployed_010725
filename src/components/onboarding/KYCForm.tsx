import React, { useState } from 'react';
import { FileCheck } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface KYCFormProps {
  onSubmit: (data: {
    pan: string;
    gst?: string;
  }) => Promise<void>;
  isLoading?: boolean;
  initialData?: {
    pan: string;
    gst?: string;
  };
}

const KYCForm: React.FC<KYCFormProps> = ({ onSubmit, isLoading, initialData }) => {
  const [formData, setFormData] = useState({
    pan: initialData?.pan || '',
    gst: initialData?.gst || ''
  });
  
  const [errors, setErrors] = useState({
    pan: '',
    gst: ''
  });
  
  const [submitting, setSubmitting] = useState(false);

  const validatePAN = (pan: string) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  };

  const validateGST = (gst: string) => {
    if (!gst) return true; // GST is optional
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gst);
  };

  const validateForm = () => {
    const newErrors = {
      pan: !formData.pan.trim() 
        ? 'PAN is required' 
        : !validatePAN(formData.pan)
        ? 'Invalid PAN format (e.g., ABCDE1234F)'
        : '',
      gst: !validateGST(formData.gst)
        ? 'Invalid GST format (e.g., 22AAAAA0000A1Z5)'
        : ''
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setSubmitting(true);
    
    try {
      // Simple validation without external verification
      // PayU integration and proper KYC verification will be added later
      await onSubmit(formData);
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        pan: error instanceof Error 
          ? error.message 
          : 'Failed to save KYC details. Please try again.'
      }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
          <FileCheck className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-white">KYC Verification</h3>
          <p className="text-light-300 text-sm">Complete your KYC to start receiving payments</p>
        </div>
      </div>

      <Input
        label="PAN Number"
        type="text"
        className="bg-deep-200 text-light-100"
        value={formData.pan}
        onChange={(e) => setFormData(prev => ({ ...prev, pan: e.target.value.toUpperCase() }))}
        error={errors.pan}
        placeholder="Enter your PAN number (e.g., ABCDE1234F)"
        fullWidth
      />

      <Input
        label="GST Number (Optional)"
        type="text"
        className="bg-deep-200 text-light-100"
        value={formData.gst}
        onChange={(e) => setFormData(prev => ({ ...prev, gst: e.target.value.toUpperCase() }))}
        error={errors.gst}
        placeholder="Enter your GST number (e.g., 22AAAAA0000A1Z5)"
        fullWidth
      />

      <Button
        type="submit"
        variant="gradient"
        fullWidth
        isLoading={isLoading || submitting}
      >
        Save KYC Details
      </Button>
      
      <div className="mt-4 p-4 bg-accent-blue/10 border border-accent-blue/20 rounded-lg">
        <p className="text-sm text-light-200 mb-2">
          <strong className="text-white">Note:</strong> KYC verification will be integrated with PayU gateway later.
        </p>
        <p className="text-xs text-light-300">
          Your KYC details will be securely stored and verified when the payment system is activated.
        </p>
      </div>
    </form>
  );
};

export default KYCForm;