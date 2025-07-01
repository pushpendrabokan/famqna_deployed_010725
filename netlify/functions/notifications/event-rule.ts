import { Handler } from '@netlify/functions';
import * as AWS from 'aws-sdk';

const eventbridge = new AWS.EventBridge({
  region: 'ap-south-1',
  credentials: {
    accessKeyId: process.env.CUSTOM_AWS_ACCESS_KEY || '',
    secretAccessKey: process.env.CUSTOM_AWS_SECRET_KEY || ''
  }
});

export const handler: Handler = async () => {
  try {
    // Create EventBridge rule
    const ruleName = 'process-notification-batches';
    await eventbridge.putRule({
      Name: ruleName,
      ScheduleExpression: 'rate(5 minutes)',
      State: 'ENABLED',
      Description: 'Trigger notification batch processing every 5 minutes'
    }).promise();

    // Set target for the rule (our batch processor function)
    await eventbridge.putTargets({
      Rule: ruleName,
      Targets: [{
        Id: 'NotificationBatchProcessor',
        Arn: process.env.BATCH_PROCESSOR_ARN || '',
        Input: JSON.stringify({ source: 'eventbridge-scheduler' })
      }]
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'EventBridge rule created successfully' })
    };
  } catch (error) {
    console.error('Error creating EventBridge rule:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create EventBridge rule' })
    };
  }
};