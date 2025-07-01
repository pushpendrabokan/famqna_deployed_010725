import React, { useState } from 'react';
import { 
  ClipboardCopy, 
  CheckCircle, 
  Link as LinkIcon, 
  Share2, 
  Twitter, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Globe, 
  Mail,
  MessageCircle
} from 'lucide-react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { User, Creator } from '../../../types';
import { useNotificationManager } from '../../../components/notifications/NotificationManager';

interface ShareProps {
  currentUser: User | Creator;
}

const Share: React.FC<ShareProps> = ({ currentUser }) => {
  const [isCopied, setIsCopied] = useState(false);
  const { showNotification } = useNotificationManager();
  const username = currentUser.username;
  
  // The profile URL based on the current domain and the creator's username
  const profileUrl = `${window.location.origin}/${username}`;

  const copyToClipboard = async (e: React.MouseEvent) => {
    // Prevent default to avoid page reload
    e.preventDefault();
    
    try {
      await navigator.clipboard.writeText(profileUrl);
      setIsCopied(true);
      showNotification({
        title: 'Link Copied!',
        message: 'Your profile link has been copied to clipboard',
        type: 'success',
        duration: 3000
      });
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      showNotification({
        title: 'Error',
        message: 'Failed to copy link to clipboard',
        type: 'error',
        duration: 3000
      });
    }
  };

  return (
    <div className="px-4 py-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-8">Share Your Profile</h1>
      
      <Card className="bg-dark-100 p-6 mb-8">
        <div className="flex items-center mb-6">
          <div className="rounded-lg p-3 bg-primary/20 mr-4">
            <LinkIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Your Public Profile Link</h2>
            <p className="text-light-300 text-sm mt-1">
              Share this link with your audience so they can ask you questions
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
          <div className="flex-1 w-full">
            <div className="bg-deep-300 border border-gray-600 rounded-lg p-3 break-all">
              <a 
                href={profileUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary hover:text-primary-dark text-sm sm:text-base"
              >
                {profileUrl}
              </a>
            </div>
          </div>
          
          <div>
            <Button
              variant="primary"
              className="w-full sm:w-auto"
              onClick={copyToClipboard}
              leftIcon={isCopied ? <CheckCircle className="h-5 w-5" /> : <ClipboardCopy className="h-5 w-5" />}
            >
              {isCopied ? 'Copied!' : 'Copy Link'}
            </Button>
          </div>
        </div>
        
        <div className="text-light-300 text-sm">
          <p>
            When someone visits your profile page, they can:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>See your bio and social media links</li>
            <li>Ask you public or private questions</li>
            <li>Read your previously answered public questions</li>
          </ul>
        </div>
      </Card>
      
      <Card className="bg-dark-100 p-6">
        <div className="flex items-center mb-6">
          <div className="rounded-lg p-3 bg-accent-indigo/20 mr-4">
            <Share2 className="h-6 w-6 text-accent-indigo" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Promote Your Profile</h2>
            <p className="text-light-300 text-sm mt-1">
              Share your profile on social media to increase your visibility
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 justify-center">
          {/* Twitter/X */}
          <a 
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(profileUrl)}&text=${encodeURIComponent('Ask me questions on FamQnA:')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center"
          >
            <div className="bg-[#1DA1F2] hover:bg-[#1a94e1] h-12 w-12 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-lg">
              <Twitter className="h-6 w-6 text-white" />
            </div>
            <span className="text-light-300 text-xs mt-2">Twitter</span>
          </a>

          {/* Facebook */}
          <a 
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center"
          >
            <div className="bg-[#1877F2] hover:bg-[#166fe0] h-12 w-12 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-lg">
              <Facebook className="h-6 w-6 text-white" />
            </div>
            <span className="text-light-300 text-xs mt-2">Facebook</span>
          </a>

          {/* Instagram */}
          <a 
            href={`https://www.instagram.com`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center"
            onClick={(e) => {
              e.preventDefault();
              copyToClipboard(e);
              window.open('https://www.instagram.com', '_blank');
            }}
          >
            <div className="bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] hover:opacity-90 h-12 w-12 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-lg">
              <Instagram className="h-6 w-6 text-white" />
            </div>
            <span className="text-light-300 text-xs mt-2">Instagram</span>
          </a>

          {/* LinkedIn */}
          <a 
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center"
          >
            <div className="bg-[#0A66C2] hover:bg-[#0958ab] h-12 w-12 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-lg">
              <Linkedin className="h-6 w-6 text-white" />
            </div>
            <span className="text-light-300 text-xs mt-2">LinkedIn</span>
          </a>

          {/* WhatsApp */}
          <a 
            href={`https://wa.me/?text=${encodeURIComponent(`Ask me questions on FamQnA: ${profileUrl}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center"
          >
            <div className="bg-[#25D366] hover:bg-[#20bd5a] h-12 w-12 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-lg">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <span className="text-light-300 text-xs mt-2">WhatsApp</span>
          </a>

          {/* Email */}
          <a 
            href={`mailto:?subject=${encodeURIComponent('Ask me questions on FamQnA')}&body=${encodeURIComponent(`Check out my profile and ask me questions on FamQnA: ${profileUrl}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center"
          >
            <div className="bg-[#D44638] hover:bg-[#c03c2f] h-12 w-12 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-lg">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <span className="text-light-300 text-xs mt-2">Email</span>
          </a>
        </div>
      </Card>
    </div>
  );
};

export default Share; 