import React, { useState, useRef, useEffect } from 'react';
import { User, Globe, Twitter, Instagram, Linkedin, CheckCircle, XCircle } from 'lucide-react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import { User as UserType, Creator } from '../../../types';
import { useAuthContext } from '../../../context/AuthContext';
import { updateUser, isUsernameTaken } from '../../../lib/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from '../../../lib/firebase';
import toast from 'react-hot-toast';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import '../../../styles/phone-input.css';
import { phoneVerificationService } from '../../../services/PhoneVerificationService';
import debounce from 'lodash/debounce';

// Get storage instance
const storage = getStorage(app);

interface ProfileProps {
  currentUser: Creator;
  onSave: (data: Partial<Creator>) => Promise<void>;
}

const Profile: React.FC<ProfileProps> = ({ currentUser, onSave }) => {
  const { currentUser: authUser } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser.name || '',
    username: currentUser.username || '',
    bio: currentUser.bio || '',
    phone: currentUser.phone || '',
    photoURL: currentUser.photoURL || '',
    expertise: currentUser.expertise || [],
    twitter: currentUser.twitter || '',
    instagram: currentUser.instagram || '',
    linkedin: currentUser.linkedin || '',
    website: currentUser.website || '',
    dateOfBirth: currentUser.dateOfBirth || ''
  });

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
  const [usernameError, setUsernameError] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate max date (18 years ago from today)
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);
  const maxDateString = maxDate.toISOString().split('T')[0];

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        username: currentUser.username || '',
        bio: currentUser.bio || '',
        phone: currentUser.phone || '',
        photoURL: currentUser.photoURL || '',
        expertise: currentUser.expertise || [],
        twitter: currentUser.twitter || '',
        instagram: currentUser.instagram || '',
        linkedin: currentUser.linkedin || '',
        website: currentUser.website || '',
        dateOfBirth: currentUser.dateOfBirth || ''
      });
    }
  }, [currentUser]);

  const checkUsernameAvailability = debounce(async (username: string) => {
    if (!username || username === currentUser.username) {
      setUsernameAvailable(null);
      setUsernameError('');
      return;
    }

    setCheckingUsername(true);
    try {
      const isTaken = await isUsernameTaken(username);
      setUsernameAvailable(!isTaken);
      setUsernameError(isTaken ? 'Username is already taken' : '');
    } catch (error) {
      console.error('Error checking username:', error);
      setUsernameError('Error checking username availability');
    } finally {
      setCheckingUsername(false);
    }
  }, 500);

  useEffect(() => {
    checkUsernameAvailability(formData.username);
  }, [formData.username]);

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
    if (!currentUser.id || !formData.phone) return;
    
    setVerificationState(prev => ({ ...prev, isLoading: true }));
    try {
      const success = await phoneVerificationService.sendOTP(currentUser.id, formData.phone);
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
    if (!currentUser.id) return;
    
    setVerificationState(prev => ({ ...prev, isLoading: true }));
    try {
      const success = await phoneVerificationService.verifyOTP(currentUser.id, otp);
      if (success) {
        toast.success('Phone number verified successfully');
        await onSave({ phone: formData.phone, phoneVerified: true });
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'username') {
      setUsernameError('');
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, GIF, WEBP)');
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    try {
      setLoading(true);
      // Create a unique filename using userId and timestamp
      const fileName = `${currentUser?.id}_${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `profile-photos/${currentUser?.id}/${fileName}`);
      
      // Upload the file
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);
      
      // Update the user profile with the new photo URL
      await updateUser(currentUser?.id || '', { photoURL });
      
      // Update local state
      setFormData(prev => ({ ...prev, photoURL }));
      
      // Call the onSave callback to update the user in the parent component
      await onSave({ photoURL });
      
      toast.success('Profile photo updated successfully');
    } catch (error) {
      console.error('Error updating profile photo:', error);
      toast.error('Failed to update profile photo');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      setLoading(true);

      // Check if the username field is empty
      if (!formData.username.trim()) {
        setUsernameError('Username cannot be empty');
        setLoading(false);
        return;
      }

      // Check username uniqueness if it was changed
      if (formData.username !== currentUser.username) {
        const taken = await isUsernameTaken(formData.username);
        if (taken) {
          setUsernameError('This username is already taken');
          setLoading(false);
          return;
        }
      }

      // If phone number changed, reset verification
      const phoneChanged = formData.phone !== currentUser.phone;
      
      // Prepare data to update
      const updateData: Partial<Creator> = {
        name: formData.name,
        username: formData.username.trim(),
        bio: formData.bio,
        phone: formData.phone,
        expertise: formData.expertise,
        twitter: formData.twitter,
        instagram: formData.instagram,
        linkedin: formData.linkedin,
        website: formData.website,
        dateOfBirth: formData.dateOfBirth,
        // Reset phone verification if number changed
        ...(phoneChanged && { phoneVerified: false })
      };

      // Update user data
      await updateUser(currentUser.id, updateData);

      // Call the onSave callback with updated data
      await onSave(updateData);

      toast.success('Profile updated successfully');
      
      // If phone changed, initiate verification
      if (phoneChanged && formData.phone) {
        handleSendOTP();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-deep-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <img 
              src={formData.photoURL || '/default-avatar.png'}
              alt={currentUser.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-primary cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handlePhotoClick}
            />
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handlePhotoChange}
            />
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{currentUser.name}</h2>
            <p className="text-light-300">@{currentUser.username}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-light-200 mb-2">Email Address</label>
            <Input
              type="email"
              value={currentUser.email}
              disabled
              className="bg-deep-200 text-light-100"
              fullWidth
            />
            <p className="mt-1 text-xs text-light-300">Contact support to change your email address.</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-light-200 mb-2">Username</label>
            <div className="relative">
              <Input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                className="bg-deep-200 text-light-100 pr-10"
                error={usernameError}
                fullWidth
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {checkingUsername ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
                ) : formData.username && (
                  usernameAvailable ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : usernameAvailable === false ? (
                    <XCircle className="w-5 h-5 text-red-500" />
                  ) : null
                )}
              </div>
            </div>
          </div>

          <div>
            <Input
              label="Display Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="bg-deep-200 text-light-100"
              placeholder="Enter your display name"
              fullWidth
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-light-200 mb-2">Phone Number</label>
            <div className="space-y-3">
              <div className="bg-deep-200 rounded-md">
                <PhoneInput
                  international
                  countryCallingCodeEditable={false}
                  defaultCountry="IN"
                  value={formData.phone}
                  onChange={(value) => {
                    setFormData(prev => ({ ...prev, phone: value || '' }));
                    // Reset verification if phone number changes
                    if (value !== currentUser.phone) {
                      onSave({ phoneVerified: false });
                    }
                  }}
                  className="bg-deep-200 text-light-100 p-2.5 w-full rounded-md border border-gray-700 focus:ring-primary focus:border-primary"
                  disabled={verificationState.step === 'verify'}
                />
              </div>

              {currentUser.phoneVerified ? (
                <div className="flex items-center gap-2 text-green-500">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Verified</span>
                </div>
              ) : formData.phone && verificationState.step === 'input' ? (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleSendOTP}
                  isLoading={verificationState.isLoading}
                  size="sm"
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
          </div>

          <div>
            <label className="block text-sm font-medium text-light-200 mb-2">Date of Birth</label>
            <Input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
              className="bg-deep-200 text-light-100"
              max={maxDateString}
              fullWidth
            />
            <p className="mt-1 text-xs text-light-300">You must be at least 18 years old</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-light-200 mb-2">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              className="w-full bg-deep-200 border border-gray-600 rounded-lg p-3 text-light-100 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              rows={4}
              placeholder="Tell others about yourself..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-light-200 mb-2">Areas of Expertise</label>
            <div className="flex flex-wrap gap-2">
              {formData.expertise.map((item: string, index: number) => (
                <span key={index} className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm">
                  {item}
                </span>
              ))}
              <button
                type="button"
                className="bg-deep-200 text-light-300 px-3 py-1 rounded-full text-sm hover:bg-deep-300"
                onClick={() => {
                  const expertise = prompt('Enter area of expertise');
                  if (expertise) {
                    setFormData(prev => ({
                      ...prev,
                      expertise: [...prev.expertise, expertise]
                    }));
                  }
                }}
              >
                + Add Expertise
              </button>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-lg font-medium text-white mb-4">Social Links</h3>
            <div className="space-y-4">
              <Input
                label="Twitter"
                leftIcon={<Twitter className="w-4 h-4" />}
                value={formData.twitter}
                onChange={handleInputChange}
                placeholder="https://twitter.com/username"
                className="bg-deep-200 text-light-100"
                fullWidth
              />

              <Input
                label="Instagram"
                leftIcon={<Instagram className="w-4 h-4" />}
                value={formData.instagram}
                onChange={handleInputChange}
                placeholder="https://instagram.com/username"
                className="bg-deep-200 text-light-100"
                fullWidth
              />

              <Input
                label="LinkedIn"
                leftIcon={<Linkedin className="w-4 h-4" />}
                value={formData.linkedin}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/in/username"
                className="bg-deep-200 text-light-100"
                fullWidth
              />

              <Input
                label="Website"
                leftIcon={<Globe className="w-4 h-4" />}
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://yourwebsite.com"
                className="bg-deep-200 text-light-100"
                fullWidth
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              variant="gradient"
              fullWidth
              isLoading={loading}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Profile;