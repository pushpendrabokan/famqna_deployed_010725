import React, { useState } from 'react';
import { Globe, Lock, ArrowRight, ArrowLeft, Loader } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Creator } from '../../types';
import { createQuestionWithPayment } from '../../services/QuestionService';

interface GuestQuestionFormProps {
  creator: Creator;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    email: string;
    phone: string;
    question: string;
    type: 'public' | 'private';
  }) => void;
  isSubmitting?: boolean;
}

const GuestQuestionForm: React.FC<GuestQuestionFormProps> = ({ creator, onClose, onSubmit, isSubmitting = false }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    question: '',
    type: 'public' as 'public' | 'private'
  });
  
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    question: ''
  });

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    return /^[6-9]\d{9}$/.test(phone);
  };

  const handleNextStep = () => {
    // Validate first step
    const newErrors = {
      name: !formData.name.trim() ? 'Name is required' : '',
      email: !formData.email.trim() 
        ? 'Email is required' 
        : !validateEmail(formData.email)
        ? 'Please enter a valid email'
        : '',
      phone: !formData.phone.trim()
        ? 'Phone number is required'
        : !validatePhone(formData.phone)
        ? 'Please enter a valid 10-digit phone number'
        : '',
      question: ''
    };

    if (newErrors.name || newErrors.email || newErrors.phone) {
      setErrors(newErrors);
      return;
    }

    setStep(2);
  };

  const handleSubmit = () => {
    // Don't proceed if already submitting
    if (isSubmitting) return;
    
    // Validate question
    if (!formData.question.trim()) {
      setErrors(prev => ({ ...prev, question: 'Question is required' }));
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-deep-100 rounded-xl p-6 max-w-lg w-full animate-fadeIn">
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-white mb-2">
            {step === 1 ? 'Your Details' : 'Ask Your Question'}
          </h3>
          <p className="text-light-300 text-sm">
            {step === 1 
              ? 'Enter your details to continue'
              : `What would you like to ask ${creator.name}?`}
          </p>
        </div>

        {/* Step 1: User Details */}
        {step === 1 && (
          <div className="space-y-4">
            <Input
              label="Name"
              className="bg-deep-200 text-light-100"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, name: e.target.value }));
                if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
              }}
              error={errors.name}
              fullWidth
            />
            
            <Input
              label="Email"
              type="email"
              className="bg-deep-200 text-light-100"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, email: e.target.value }));
                if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
              }}
              error={errors.email}
              fullWidth
            />
            
            <Input
              label="Phone Number"
              type="tel"
              className="bg-deep-200 text-light-100"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, phone: e.target.value }));
                if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
              }}
              error={errors.phone}
              fullWidth
            />

            <div className="flex gap-3 justify-end mt-6">
              <Button 
                variant="ghost"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button 
                variant="gradient"
                onClick={handleNextStep}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Question */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="mb-6">
              <textarea
                className={`w-full bg-deep-200/70 border ${
                  errors.question ? 'border-red-500/50' : 'border-gray-700/50'
                } rounded-lg p-4 text-light-100 placeholder-light-300/50 focus:ring-primary focus:border-primary transition-all duration-300 focus:bg-deep-200 text-base min-h-[120px]`}
                rows={4}
                placeholder={`What would you like to ask ${creator.name}?`}
                value={formData.question}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, question: e.target.value }));
                  if (errors.question) setErrors(prev => ({ ...prev, question: '' }));
                }}
              />
              {errors.question && (
                <p className="mt-1 text-sm text-red-500">{errors.question}</p>
              )}
            </div>

            {/* Pricing options */}
            <div className="space-y-3">
              <p className="text-light-200 text-sm mb-3">Select visibility and pricing:</p>
              
              {/* Public option */}
              <button 
                className={`w-full p-4 rounded-lg transition-all duration-300 text-left ${
                  formData.type === 'public'
                    ? 'bg-deep-200 border-2 border-primary shadow-glow'
                    : 'bg-deep-200 hover:bg-deep-300 border border-gray-700'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, type: 'public' }))}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className={`w-5 h-5 ${formData.type === 'public' ? 'text-primary' : 'text-light-300'}`} />
                    <div>
                      <h4 className="font-medium text-white">Public Question</h4>
                      <p className="text-sm text-light-300">Visible to everyone</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-white">₹{creator.publicPrice || 800}</span>
                </div>
              </button>
                
              {/* Private option */}
              <button 
                className={`w-full p-4 rounded-lg transition-all duration-300 text-left ${
                  formData.type === 'private'
                    ? 'bg-deep-200 border-2 border-primary shadow-glow'
                    : 'bg-deep-200 hover:bg-deep-300 border border-gray-700'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, type: 'private' }))}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Lock className={`w-5 h-5 ${formData.type === 'private' ? 'text-primary' : 'text-light-300'}`} />
                    <div>
                      <h4 className="font-medium text-white">Private Question</h4>
                      <p className="text-sm text-light-300">Only visible to you</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-white">₹{creator.privatePrice || 1600}</span>
                </div>
              </button>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <Button 
                variant="ghost"
                onClick={() => setStep(1)}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                disabled={isSubmitting}
              >
                Back
              </Button>
              <Button 
                variant="gradient"
                onClick={handleSubmit}
                rightIcon={isSubmitting ? <Loader className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Submit & Pay'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestQuestionForm;