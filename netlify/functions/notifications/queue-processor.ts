import { Handler } from '@netlify/functions';
import * as AWS from 'aws-sdk';

// Initialize AWS SQS for message queuing
const sqs = new AWS.SQS({
  region: 'ap-south-1',
  credentials: {
    accessKeyId: process.env.CUSTOM_AWS_ACCESS_KEY || '',
    secretAccessKey: process.env.CUSTOM_AWS_SECRET_KEY || ''
  }
});

// Queue URL from environment variable
const QUEUE_URL = process.env.AWS_SQS_QUEUE_URL;

interface NotificationMessage {
  type: 'email' | 'sms';
  recipient: string;
  template: string;
  params: Record<string, any>;
  timestamp: number;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const message: NotificationMessage = JSON.parse(event.body || '{}');

    // Validate message
    if (!message.type || !message.recipient || !message.template) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid message format' })
      };
    }

    // Add to SQS queue
    await sqs.sendMessage({
      QueueUrl: QUEUE_URL!,
      MessageBody: JSON.stringify(message),
      // Group similar notifications (e.g., all new questions for a creator)
      MessageGroupId: `${message.type}-${message.template}`,
      // Deduplication based on recipient and timestamp
      MessageDeduplicationId: `${message.recipient}-${message.timestamp}`
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Notification queued' })
    };
  } catch (error) {
    console.error('Error queueing notification:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to queue notification' })
    };
  }
};