// Email templates
const emailTemplates = {
  newQuestion: (creatorName: string, questionContent: string) => ({
    subject: `New Question Received - FamQnA`,
    body: `
      <h2>Hello ${creatorName},</h2>
      <p>You have received a new question:</p>
      <blockquote style="padding: 10px; border-left: 4px solid #9333EA; background: #f8f9fa;">
        ${questionContent}
      </blockquote>
      <p>Log in to your dashboard to answer this question.</p>
    `
  }),

  questionAnswered: (userName: string, creatorName: string, answer: string) => ({
    subject: `Your Question Has Been Answered - FamQnA`,
    body: `
      <h2>Hello ${userName},</h2>
      <p>${creatorName} has answered your question!</p>
      <blockquote style="padding: 10px; border-left: 4px solid #9333EA; background: #f8f9fa;">
        ${answer}
      </blockquote>
      <p>Visit FamQnA to view the complete answer and ask more questions.</p>
    `
  }),

  questionUnanswered: (userName: string, creatorName: string) => ({
    subject: `Question Update - Automatic Refund Initiated - FamQnA`,
    body: `
      <h2>Hello ${userName},</h2>
      <p>Your question to ${creatorName} has not been answered within 72 hours.</p>
      <p>As per our policy, we have initiated an automatic refund which will be credited to your original payment method within 5-7 business days.</p>
    `
  }),

  withdrawalStatus: (creatorName: string, amount: number, status: string) => ({
    subject: `Withdrawal Status Update - FamQnA`,
    body: `
      <h2>Hello ${creatorName},</h2>
      <p>Your withdrawal request for ₹${amount} has been ${status}.</p>
      <p>The amount will be credited to your registered bank account within 2-3 business days.</p>
    `
  })
};

// SMS templates
const smsTemplates = {
  newQuestion: (creatorName: string) => 
    `FamQnA: You have received a new question. Log in to your dashboard to answer.`,

  questionAnswered: (creatorName: string) =>
    `FamQnA: ${creatorName} has answered your question! Visit FamQnA to view the answer.`,

  questionUnanswered: () =>
    `FamQnA: Your question was not answered within 72 hours. A refund has been initiated.`,

  withdrawalStatus: (amount: number, status: string) =>
    `FamQnA: Your withdrawal request for ₹${amount} has been ${status}.`
};

// Send notifications
export const sendNotification = async (
  type: 'email' | 'sms',
  template: keyof typeof emailTemplates | keyof typeof smsTemplates,
  data: {
    to: string;
    params: Record<string, any>;
  }
) => {
  try {
    // Queue the notification
    const response = await fetch('/.netlify/functions/notifications/queue-processor', {
      method: 'POST',
      body: JSON.stringify({
        type,
        recipient: data.to,
        template,
        params: data.params,
        timestamp: Date.now()
      })
    });

    if (!response.ok) throw new Error('Failed to queue notification');
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};