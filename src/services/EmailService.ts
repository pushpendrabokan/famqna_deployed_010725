import { SESClient, SendEmailCommand, SendEmailCommandInput } from "@aws-sdk/client-ses";
import { getFirestore } from 'firebase/firestore';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

interface EmailLog {
  to: string;
  subject: string;
  templateId: string;
  status: 'sent' | 'failed';
  error?: string;
  sentAt: Date;
}

class EmailService {
  private ses: SESClient;
  private db = getFirestore();
  private fromEmail: string;

  constructor() {
    console.log('Initializing EmailService...');
    
    // Log AWS configuration
    console.log('AWS Region:', import.meta.env.VITE_AWS_REGION);
    console.log('AWS Access Key ID:', import.meta.env.VITE_AWS_ACCESS_KEY_ID?.substring(0, 5) + '...');
    console.log('From Email:', import.meta.env.VITE_AWS_SES_FROM_EMAIL || 'noreply@famqna.com');
    
    this.ses = new SESClient({
      region: import.meta.env.VITE_AWS_REGION || 'ap-south-1',
      credentials: {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
      }
    });
    
    // Set the sender email address - this must be verified in SES
    this.fromEmail = import.meta.env.VITE_AWS_SES_FROM_EMAIL || 'noreply@famqna.com';
    
    console.log('EmailService initialized successfully');
  }

  /**
   * Log email sending activity to Firestore
   */
  private async logEmailActivity(userId: string, emailLog: EmailLog): Promise<void> {
    try {
      console.log('Logging email activity:', { userId, ...emailLog });
      const logRef = doc(this.db, 'users', userId, 'emailLogs', new Date().toISOString());
      await setDoc(logRef, {
        ...emailLog,
        sentAt: serverTimestamp()
      });
      console.log('Email activity logged successfully');
    } catch (error) {
      console.error('Error logging email activity:', error);
      // Log detailed error information
      if (error instanceof Error) {
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
      }
    }
  }

  /**
   * Send a welcome email to a new user
   */
  async sendWelcomeEmail(userId: string, toEmail: string, userName: string): Promise<boolean> {
    const subject = 'Welcome to FamQnA - Start Earning by Answering Questions!';
    
    const htmlBody = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #6366F1; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
            .button { display: inline-block; background-color: #6366F1; color: white; padding: 10px 20px; 
                     text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .tip { margin: 15px 0; padding: 10px; background-color: #e9ecef; border-left: 4px solid #6366F1; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to FamQnA!</h1>
            </div>
            <div class="content">
              <p>Hi ${userName},</p>
              <p>Thank you for joining FamQnA! We're excited to have you on board. FamQnA is the platform where you can monetize your expertise by answering questions from your followers.</p>
              
              <h2>Here are some tips to get started:</h2>
              
              <div class="tip">
                <strong>Complete Your Profile</strong>
                <p>Add your expertise areas, a professional photo, and a compelling bio to attract more questions.</p>
              </div>
              
              <div class="tip">
                <strong>Connect Your Social Accounts</strong>
                <p>Link your social media accounts to let your followers know they can ask you questions on FamQnA.</p>
              </div>
              
              <div class="tip">
                <strong>Set Your Pricing</strong>
                <p>Choose how much you want to charge for answering questions. You can set different prices for different types of questions.</p>
              </div>
              
              <div class="tip">
                <strong>Promote Your FamQnA Link</strong>
                <p>Share your unique FamQnA link on your social media profiles and in your content to start receiving questions.</p>
              </div>
              
              <div class="tip">
                <strong>Provide Quality Answers</strong>
                <p>Detailed, thoughtful answers will encourage more people to ask you questions and build your reputation.</p>
              </div>
              
              <p>Ready to start earning by sharing your knowledge?</p>
              
              <a href="https://playful-zabaione-0a3324.netlify.app/dashboard" class="button">Go to Your Dashboard</a>
              
              <p>If you have any questions or need assistance, feel free to reply to this email or contact our support team.</p>
              
              <p>Best regards,<br>The FamQnA Team</p>
            </div>
            <div class="footer">
              <p>© 2024 FamQnA. All rights reserved.</p>
              <p>You're receiving this email because you signed up for FamQnA.</p>
            </div>
          </div>
        </body>
      </html>
    `;
    
    const textBody = `
      Welcome to FamQnA, ${userName}!
      
      Thank you for joining FamQnA! We're excited to have you on board. FamQnA is the platform where you can monetize your expertise by answering questions from your followers.
      
      Here are some tips to get started:
      
      1. Complete Your Profile: Add your expertise areas, a professional photo, and a compelling bio to attract more questions.
      
      2. Connect Your Social Accounts: Link your social media accounts to let your followers know they can ask you questions on FamQnA.
      
      3. Set Your Pricing: Choose how much you want to charge for answering questions. You can set different prices for different types of questions.
      
      4. Promote Your FamQnA Link: Share your unique FamQnA link on your social media profiles and in your content to start receiving questions.
      
      5. Provide Quality Answers: Detailed, thoughtful answers will encourage more people to ask you questions and build your reputation.
      
      Ready to start earning by sharing your knowledge? Visit your dashboard at: https://playful-zabaione-0a3324.netlify.app/dashboard
      
      If you have any questions or need assistance, feel free to reply to this email or contact our support team.
      
      Best regards,
      The FamQnA Team
      
      © 2024 FamQnA. All rights reserved.
      You're receiving this email because you signed up for FamQnA.
    `;
    
    try {
      const params: SendEmailCommandInput = {
        Source: this.fromEmail,
        Destination: {
          ToAddresses: [toEmail]
        },
        Message: {
          Subject: {
            Data: subject
          },
          Body: {
            Html: {
              Data: htmlBody
            },
            Text: {
              Data: textBody
            }
          }
        }
      };
      
      return await this.sendEmail(params, userId, 'welcome_email');
    } catch (error) {
      console.error('Error sending welcome email:', error);
      
      // Log the failed attempt
      if (userId) {
        await this.logEmailActivity(userId, {
          to: toEmail,
          subject,
          templateId: 'welcome_email',
          status: 'failed',
          error: error instanceof Error ? error.message : String(error),
          sentAt: new Date()
        });
      }
      
      return false;
    }
  }

  /**
   * Send a question creation confirmation email
   */
  async sendQuestionCreatedEmail(
    userId: string, 
    toEmail: string, 
    userName: string, 
    questionId: string, 
    questionContent: string,
    creatorName: string
  ): Promise<boolean> {
    const subject = `Your Question to ${creatorName} Has Been Submitted - FamQnA`;
    const trackingLink = `https://playful-zabaione-0a3324.netlify.app/question/${questionId}`;
    
    const htmlBody = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #6366F1; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
            .button { display: inline-block; background-color: #6366F1; color: white; padding: 10px 20px; 
                     text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .question-box { margin: 15px 0; padding: 15px; background-color: #e9ecef; border-radius: 5px; }
            .tracking-id { font-family: monospace; background-color: #e9ecef; padding: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Question Submitted!</h1>
            </div>
            <div class="content">
              <p>Hi ${userName},</p>
              <p>Your question to <strong>${creatorName}</strong> has been successfully submitted. We'll notify you when they respond.</p>
              
              <p><strong>Tracking ID:</strong> <span class="tracking-id">${questionId}</span></p>
              
              <div class="question-box">
                <h3>Your Question:</h3>
                <p>${questionContent}</p>
              </div>
              
              <p>You can track the status of your question and view the response when it's ready using the link below:</p>
              
              <a href="${trackingLink}" class="button">Track Your Question</a>
              
              <p>Thank you for using FamQnA to connect with creators you admire!</p>
              
              <p>Best regards,<br>The FamQnA Team</p>
            </div>
            <div class="footer">
              <p>© 2024 FamQnA. All rights reserved.</p>
              <p>You're receiving this email because you submitted a question on FamQnA.</p>
            </div>
          </div>
        </body>
      </html>
    `;
    
    const textBody = `
      Question Submitted! - FamQnA
      
      Hi ${userName},
      
      Your question to ${creatorName} has been successfully submitted. We'll notify you when they respond.
      
      Tracking ID: ${questionId}
      
      Your Question:
      ${questionContent}
      
      You can track the status of your question and view the response when it's ready using this link:
      ${trackingLink}
      
      Thank you for using FamQnA to connect with creators you admire!
      
      Best regards,
      The FamQnA Team
      
      © 2024 FamQnA. All rights reserved.
      You're receiving this email because you submitted a question on FamQnA.
    `;
    
    try {
      const params: SendEmailCommandInput = {
        Source: this.fromEmail,
        Destination: {
          ToAddresses: [toEmail]
        },
        Message: {
          Subject: {
            Data: subject
          },
          Body: {
            Html: {
              Data: htmlBody
            },
            Text: {
              Data: textBody
            }
          }
        }
      };
      
      return await this.sendEmail(params, userId, 'question_created');
    } catch (error) {
      console.error('Error sending question created email:', error);
      
      // Log the failed attempt
      if (userId) {
        await this.logEmailActivity(userId, {
          to: toEmail,
          subject,
          templateId: 'question_created',
          status: 'failed',
          error: error instanceof Error ? error.message : String(error),
          sentAt: new Date()
        });
      }
      
      return false;
    }
  }

  private async sendEmail(params: SendEmailCommandInput, userId: string, templateId: string): Promise<boolean> {
    console.log('Attempting to send email with params:', {
      to: params.Destination?.ToAddresses,
      subject: params.Message?.Subject?.Data,
      from: params.Source
    });
    
    try {
      const command = new SendEmailCommand(params);
      console.log('Sending email command...');
      const response = await this.ses.send(command);
      console.log('Email sent successfully:', response);
      
      // Log success
      await this.logEmailActivity(userId, {
        to: params.Destination?.ToAddresses?.[0] || '',
        subject: params.Message?.Subject?.Data || '',
        templateId,
        status: 'sent',
        sentAt: new Date()
      });
      
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      // Log detailed error information
      if (error instanceof Error) {
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
      }
      
      // Log failure
      await this.logEmailActivity(userId, {
        to: params.Destination?.ToAddresses?.[0] || '',
        subject: params.Message?.Subject?.Data || '',
        templateId,
        status: 'failed',
        error: error instanceof Error ? error.message : String(error),
        sentAt: new Date()
      });
      
      return false;
    }
  }
}

// Create a singleton instance
const emailService = new EmailService();
export default emailService; 