import { Handler } from '@netlify/functions';
import * as AWS from 'aws-sdk';

const sns = new AWS.SNS({
  region: 'ap-south-1',
  credentials: {
    accessKeyId: process.env.CUSTOM_AWS_ACCESS_KEY || '',
    secretAccessKey: process.env.CUSTOM_AWS_SECRET_KEY || ''
  }
});

export const handler: Handler = async () => {
  try {
    // Create SNS topic for notifications
    const topic = await sns.createTopic({
      Name: 'famqna-notifications'
    }).promise();

    // Set topic attributes for SMS messaging
    await sns.setTopicAttributes({
      TopicArn: topic.TopicArn,
      AttributeName: 'DefaultSMSType',
      AttributeValue: 'Transactional'
    }).promise();

    // Set SMS attributes for the account
    await sns.setSMSAttributes({
      attributes: {
        'DefaultSMSType': 'Transactional',
        'DefaultSenderID': 'FamQnA',
        'MonthlySpendLimit': '100' // Set monthly limit in USD
      }
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'SNS topic created successfully',
        topicArn: topic.TopicArn
      })
    };
  } catch (error) {
    console.error('Error setting up SNS:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to set up SNS' })
    };
  }
};