import React, { useState, useEffect } from 'react';
import { User, Creator } from '../../../types';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import NotificationSettings from '../../notifications/NotificationSettings';
import { notificationService, NotificationTopic } from '../../../services/NotificationService';
import { updateUser } from '../../../lib/firestore';

interface SettingsProps {
  currentUser: Creator;
  onSave: (data: Partial<Creator>) => Promise<void>;
}

const Settings: React.FC<SettingsProps> = ({ currentUser, onSave }) => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [marketingUpdates, setMarketingUpdates] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    publicPrice: currentUser.publicPrice || 100,
    privatePrice: currentUser.privatePrice || 200
  });

  // Load user notification preferences
  useEffect(() => {
    if (currentUser.settings) {
      setEmailNotifications(currentUser.settings.emailNotifications ?? true);
      setPushNotifications(currentUser.settings.pushNotifications ?? false);
      setMarketingUpdates(currentUser.settings.marketingUpdates ?? false);
    }
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await onSave({
        settings: {
          emailNotifications,
          pushNotifications,
          marketingUpdates
        }
      });
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationSave = async (preferences: { topics: NotificationTopic[] }) => {
    try {
      await updateUser(currentUser.id, {
        notificationPreferences: {
          topics: preferences.topics.map(topic => topic.toString()),
          updatedAt: new Date()
        }
      });
    } catch (error) {
      console.error('Error saving notification preferences:', error);
    }
  };

  const handlePriceUpdate = async () => {
    setIsLoading(true);
    try {
      await updateUser(currentUser.id, {
        publicPrice: Number(formData.publicPrice),
        privatePrice: Number(formData.privatePrice)
      });
      
      // Show success message
      alert('Pricing updated successfully');
    } catch (error) {
      console.error('Error updating pricing:', error);
      alert('Failed to update pricing');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-deep-100">
        <h3 className="text-lg font-medium text-white mb-6">Question Pricing</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-light-200 mb-2">Public Question Price</label>
            <div className="flex items-center">
              <span className="text-light-300 mr-2">₹</span>
              <input
                type="number"
                className="w-32 bg-deep-200 border border-gray-600 rounded-lg p-3 text-light-100 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                value={formData.publicPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, publicPrice: Number(e.target.value) }))}
                min={100}
                max={10000}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-light-200 mb-2">Private Question Price</label>
            <div className="flex items-center">
              <span className="text-light-300 mr-2">₹</span>
              <input
                type="number"
                className="w-32 bg-deep-200 border border-gray-600 rounded-lg p-3 text-light-100 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                value={formData.privatePrice}
                onChange={(e) => setFormData(prev => ({ ...prev, privatePrice: Number(e.target.value) }))}
                min={100}
                max={20000}
              />
            </div>
          </div>

          <Button 
            variant="gradient" 
            onClick={handlePriceUpdate}
            isLoading={isLoading}
          >
            Update Pricing
          </Button>
        </div>
      </Card>

      {/* Push Notification Settings */}
      <NotificationSettings 
        userId={currentUser.id}
        preferences={{
          topics: currentUser.notificationPreferences?.topics?.map(topic => topic as NotificationTopic) || []
        }}
        onSave={handleNotificationSave}
      />

      <Card className="bg-deep-100">
        <h3 className="text-lg font-medium text-white mb-6">Email Notification Preferences</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-light-100">Email Notifications</p>
              <p className="text-light-300 text-sm">Receive emails for new questions and answers</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
              />
              <div className="w-11 h-6 bg-deep-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-light-100">Marketing Updates</p>
              <p className="text-light-300 text-sm">Receive news and promotional offers</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={marketingUpdates}
                onChange={(e) => setMarketingUpdates(e.target.checked)}
              />
              <div className="w-11 h-6 bg-deep-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>

        <Button 
          variant="primary" 
          className="mt-6"
          onClick={handleSubmit}
          isLoading={isLoading}
        >
          Save Email Preferences
        </Button>
      </Card>

      <Card className="bg-deep-100">
        <h3 className="text-lg font-medium text-white mb-6">Account Security</h3>
        
        <div className="space-y-4">
          <div>
            <p className="text-light-100">Two-Factor Authentication</p>
            <p className="text-light-300 text-sm mb-4">Add an extra layer of security to your account</p>
            <Button variant="outline">Enable 2FA</Button>
          </div>
          
          <div className="border-t border-gray-700 pt-4 mt-4">
            <p className="text-light-100">Delete Account</p>
            <p className="text-light-300 text-sm mb-4">Permanently delete your account and all data</p>
            <Button variant="danger">Delete Account</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;