import { Handler } from '@netlify/functions';
import * as AWS from 'aws-sdk';

const ses = new AWS.SES({
  region: 'ap-south-1',
  credentials: {
    accessKeyId: process.env.CUSTOM_AWS_ACCESS_KEY || '',
    secretAccessKey: process.env.CUSTOM_AWS_SECRET_KEY || ''
  }
});

export const handler: Handler = async () => {
  try {
    // Verify email identity
    await ses.verifyEmailIdentity({
      EmailAddress: 'notifications@famqna.com'
    }).promise();

    // Create template for notification emails
    await ses.createTemplate({
      Template: {
        TemplateName: 'NotificationDigest',
        SubjectPart: 'Your FamQnA Updates',
        HtmlPart: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #9333EA;">FamQnA Updates</h1>
            {{#each notifications}}
              <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #eee; border-radius: 8px;">
                {{{this}}}
              </div>
            {{/each}}
            <p style="color: #666; font-size: 14px;">
              You're receiving this because you're a member of FamQnA.
              <a href="{{unsubscribeUrl}}" style="color: #9333EA;">Unsubscribe</a>
            </p>
          </div>
        `,
        TextPart: '{{#each notifications}}{{this}}\n\n{{/each}}'
      }
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'SES setup completed successfully' })
    };
  } catch (error) {
    console.error('Error setting up SES:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to set up SES' })
    };
  }
};