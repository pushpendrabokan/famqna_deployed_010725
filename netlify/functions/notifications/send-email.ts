import { Handler } from '@netlify/functions';
import * as AWS from 'aws-sdk';

// Get AWS credentials from Netlify environment variables
const ses = new AWS.SES({
  region: 'ap-south-1',
  credentials: {
    accessKeyId: process.env.CUSTOM_AWS_ACCESS_KEY || '',
    secretAccessKey: process.env.CUSTOM_AWS_SECRET_KEY || ''
  }
});

// Validate AWS credentials are present
if (!process.env.CUSTOM_AWS_ACCESS_KEY || !process.env.CUSTOM_AWS_SECRET_KEY) {
  console.error('Missing AWS credentials');
}
export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { to, subject, body } = JSON.parse(event.body || '{}');

    const params = {
      Source: 'notifications@famqna.com',
      Destination: { ToAddresses: [to] },
      Message: {
        Subject: { Data: subject },
        Body: {
          Html: { Data: body }
        }
      }
    };

    await ses.sendEmail(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send email' })
    };
  }
};