import React, { useState } from 'react';
import { DollarSign, Globe, Lock } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface PricingSetupFormProps {
  onSubmit: (data: {
    publicPrice: number;
    privatePrice: number;
  }) => Promise<void>;
  isLoading?: boolean;
  initialData?: {
    publicPrice: number;
    privatePrice: number;
  };
}

const PricingSetupForm: React.FC<PricingSetupFormProps> = ({ onSubmit, isLoading, initialData }) => {
  const [formData, setFormData] = useState({
    publicPrice: initialData?.publicPrice || 800,
    privatePrice: initialData?.privatePrice || 1600
  });
  
  const [errors, setErrors] = useState({
    publicPrice: '',
    privatePrice: ''
  });

  const validateForm = () => {
    const newErrors = {
      publicPrice: formData.publicPrice < 100 
        ? 'Minimum price is ₹100' 
        : formData.publicPrice > 10000
        ? 'Maximum price is ₹10,000'
        : '',
      privatePrice: formData.privatePrice < formData.publicPrice 
        ? 'Private price must be higher than public price' 
        : formData.privatePrice > 20000
        ? 'Maximum price is ₹20,000'
        : ''
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting pricing details:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
          <DollarSign className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-white">Set Your Prices</h3>
          <p className="text-light-300 text-sm">Define pricing for public and private questions</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-deep-200 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <Globe className="w-5 h-5 text-light-300" />
            <h4 className="text-white font-medium">Public Questions</h4>
          </div>
          <div className="flex items-center">
            <span className="text-light-300 mr-2">₹</span>
            <Input
              type="number"
              value={formData.publicPrice}
              className="bg-deep-200 text-light-100 w-32"
              onChange={(e) => setFormData(prev => ({ ...prev, publicPrice: Number(e.target.value) }))}
              error={errors.publicPrice}
              min={100}
              max={10000}
            />
          </div>
          <p className="text-sm text-light-300 mt-2">Visible to everyone on your profile</p>
        </div>

        <div className="bg-deep-200 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <Lock className="w-5 h-5 text-light-300" />
            <h4 className="text-white font-medium">Private Questions</h4>
          </div>
          <div className="flex items-center">
            <span className="text-light-300 mr-2">₹</span>
            <Input
              type="number"
              value={formData.privatePrice}
              className="bg-deep-200 text-light-100 w-32"
              onChange={(e) => setFormData(prev => ({ ...prev, privatePrice: Number(e.target.value) }))}
              error={errors.privatePrice}
              min={100}
              max={20000}
            />
          </div>
          <p className="text-sm text-light-300 mt-2">Only visible to you and the asker</p>
        </div>
      </div>

      <Button
        type="submit"
        variant="gradient"
        fullWidth
        isLoading={isLoading}
      >
        Save Pricing
      </Button>
    </form>
  );
};

export default PricingSetupForm;