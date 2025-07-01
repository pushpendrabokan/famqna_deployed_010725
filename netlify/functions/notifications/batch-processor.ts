import { Handler } from '@netlify/functions';
import * as AWS from 'aws-sdk';

// Initialize AWS services
const sqs = new AWS.SQS({
  region: 'ap-south-1',
  credentials: {
    accessKeyId: process.env.CUSTOM_AWS_ACCESS_KEY || '',
    secretAccessKey: process.env.CUSTOM_AWS_SECRET_KEY || ''
  }
});

const QUEUE_URL = process.env.AWS_SQS_QUEUE_URL;
const BATCH_SIZE = 10; // Process 10 messages at a time
const WAIT_TIME = 20; // Wait up to 20 seconds for messages

export const handler: Handler = async () => {
  try {
    // Receive messages from queue
    const response = await sqs.receiveMessage({
      QueueUrl: QUEUE_URL!,
      MaxNumberOfMessages: BATCH_SIZE,
      WaitTimeSeconds: WAIT_TIME,
      MessageAttributeNames: ['All']
    }).promise();

    if (!response.Messages || response.Messages.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'No messages to process' })
      };
    }

    // Group messages by type and recipient
    const groupedMessages = response.Messages.reduce((acc, message) => {
      const { type, recipient } = JSON.parse(message.Body!);
      const key = `${type}-${recipient}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(message);
      return acc;
    }, {} as Record<string, AWS.SQS.Message[]>);

    // Process each group
    for (const [key, messages] of Object.entries(groupedMessages)) {
      const [type, recipient] = key.split('-');
      
      if (messages.length > 0) {
        // Send consolidated notification
        if (type === 'email') {
          await fetch('/.netlify/functions/notifications/send-email', {
            method: 'POST',
            body: JSON.stringify({
              to: recipient,
              subject: 'FamQnA Notifications Update',
              body: createConsolidatedEmailBody(messages)
            })
          });
        } else {
          await fetch('/.netlify/functions/notifications/send-sms', {
            method: 'POST',
            body: JSON.stringify({
              phoneNumber: recipient,
              message: createConsolidatedSMSMessage(messages)
            })
          });
        }

        // Delete processed messages
        await Promise.all(messages.map(message => 
          sqs.deleteMessage({
            QueueUrl: QUEUE_URL!,
            ReceiptHandle: message.ReceiptHandle!
          }).promise()
        ));
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true,
        processedCount: response.Messages.length 
      })
    };
  } catch (error) {
    console.error('Error processing notification batch:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process notifications' })
    };
  }
};

function createConsolidatedEmailBody(messages: AWS.SQS.Message[]): string {
  const notifications = messages.map(message => {
    const { template, params } = JSON.parse(message.Body!);
    // Get template content based on template type
    return `<div class="notification">${getEmailTemplateContent(template, params)}</div>`;
  });

  return `
    <div style="font-family: sans-serif;">
      <h2>Your FamQnA Updates</h2>
      ${notifications.join('<hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;">')}
    </div>
  `;
}

function createConsolidatedSMSMessage(messages: AWS.SQS.Message[]): string {
  const notifications = messages.map(message => {
    const { template, params } = JSON.parse(message.Body!);
    return getSMSTemplateContent(template, params);
  });

  return `FamQnA Updates:\n${notifications.join('\n')}`;
}

function getEmailTemplateContent(template: string, params: Record<string, any>): string {
  // Template content based on type
  switch (template) {
    case 'newQuestion':
      return `
        <p>New question received from ${params.userName}:</p>
        <blockquote style="padding: 10px; border-left: 4px solid #9333EA; background: #f8f9fa;">
          ${params.question}
        </blockquote>
      `;
    case 'questionAnswered':
      return `
        <p>${params.creatorName} answered your question:</p>
        <blockquote style="padding: 10px; border-left: 4px solid #9333EA; background: #f8f9fa;">
          ${params.answer}
        </blockquote>
      `;
    default:
      return '';
  }
}

function getSMSTemplateContent(template: string, params: Record<string, any>): string {
  switch (template) {
    case 'newQuestion':
      return `New question from ${params.userName}`;
    case 'questionAnswered':
      return `${params.creatorName} answered your question`;
    default:
      return '';
  }
}