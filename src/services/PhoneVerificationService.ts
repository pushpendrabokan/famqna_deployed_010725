import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { getFirestore } from 'firebase/firestore';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

interface OTPData {
  code: string;
  createdAt: Date;
  attempts: number;
  verified: boolean;
  expiresAt: Date;
}

class PhoneVerificationService {
  private sns: SNSClient;
  private db = getFirestore();

  constructor() {
    this.sns = new SNSClient({
      region: 'ap-south-1',
      credentials: {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
      }
    });
  }

  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async storeOTP(userId: string, otpData: OTPData): Promise<void> {
    const otpRef = doc(this.db, 'users', userId, 'phoneVerification', 'current');
    await setDoc(otpRef, {
      ...otpData,
      createdAt: serverTimestamp(),
      expiresAt: serverTimestamp()
    });
  }

  private async getStoredOTP(userId: string): Promise<OTPData | null> {
    const otpRef = doc(this.db, 'users', userId, 'phoneVerification', 'current');
    const otpDoc = await getDoc(otpRef);
    return otpDoc.exists() ? otpDoc.data() as OTPData : null;
  }

  async sendOTP(userId: string, phoneNumber: string): Promise<boolean> {
    try {
      const otp = this.generateOTP();
      
      // Ensure phone number is in E.164 format
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
      console.log('Sending OTP to:', formattedPhone);
      
      // Store OTP in Firestore
      const otpData: OTPData = {
        code: otp,
        createdAt: new Date(),
        attempts: 0,
        verified: false,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes expiry
      };
      await this.storeOTP(userId, otpData);

      // Send SMS via Netlify function
      const response = await fetch('/.netlify/functions/notifications/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: formattedPhone,
          message: `Your FamQnA verification code is: ${otp}. Valid for 10 minutes.`
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('SMS API Error:', errorData);
        return false;
      }

      const result = await response.json();
      console.log('SMS API Response:', result);
      
      return true;
    } catch (error) {
      console.error('Error sending OTP:', error);
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      return false;
    }
  }

  async verifyOTP(userId: string, code: string): Promise<boolean> {
    try {
      const otpData = await this.getStoredOTP(userId);
      
      if (!otpData) {
        throw new Error('No OTP request found');
      }

      if (otpData.verified) {
        throw new Error('Phone already verified');
      }

      if (otpData.attempts >= 3) {
        throw new Error('Too many attempts');
      }

      if (new Date() > otpData.expiresAt) {
        throw new Error('OTP expired');
      }

      if (otpData.code !== code) {
        // Increment attempts
        const otpRef = doc(this.db, 'users', userId, 'phoneVerification', 'current');
        await updateDoc(otpRef, {
          attempts: otpData.attempts + 1
        });
        throw new Error('Invalid OTP');
      }

      // Mark as verified
      const otpRef = doc(this.db, 'users', userId, 'phoneVerification', 'current');
      await updateDoc(otpRef, { verified: true });

      // Update user's phone verification status
      const userRef = doc(this.db, 'users', userId);
      await updateDoc(userRef, { phoneVerified: true });

      return true;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return false;
    }
  }

  async isPhoneVerified(userId: string): Promise<boolean> {
    try {
      const userRef = doc(this.db, 'users', userId);
      const userDoc = await getDoc(userRef);
      return userDoc.exists() ? (userDoc.data()?.phoneVerified || false) : false;
    } catch (error) {
      console.error('Error checking phone verification status:', error);
      return false;
    }
  }
}

export const phoneVerificationService = new PhoneVerificationService(); 