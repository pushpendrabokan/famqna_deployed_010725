import { Handler } from '@netlify/functions';
import * as AWS from 'aws-sdk';

// Get AWS credentials from Netlify environment variables
const sns = new AWS.SNS({
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
    const { phoneNumber, message } = JSON.parse(event.body || '{}');

    const params = {
      Message: message,
      PhoneNumber: phoneNumber,
      MessageAttributes: {
        'AWS.SNS.SMS.SMSType': {
          DataType: 'String',
          StringValue: 'Transactional'
        }
      }
    };

    await sns.publish(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error('Error sending SMS:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send SMS' })
    };
  }
};