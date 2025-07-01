import React from 'react';
import LegalPageLayout from '../components/layout/LegalPageLayout';

const RefundPage: React.FC = () => {
  return (
    <LegalPageLayout title="Refund Policy" updatedDate="March 6, 2025">
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">1. Overview</h2>
        <p>
          At FamQnA, a product of <strong className="text-white">C3R4 ExpeTech Private Limited</strong> hosted on <strong className="text-white">Famqna.in</strong>, we strive to ensure that all users have a positive experience. This Refund Policy outlines the circumstances under which refunds may be issued for payments made on our platform. By using FamQnA, you agree to the terms of this Refund Policy.
        </p>
        <p className="mt-2">
          This policy is operated by C3R4 ExpeTech Private Limited and applies to all transactions processed through our platform.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4">2. Types of Transactions</h2>
        <p>
          Our platform facilitates two primary types of transactions:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li><strong className="text-white">Question Payments:</strong> Users pay to submit questions to creators</li>
          <li><strong className="text-white">Creator Payouts:</strong> Creators receive payments for answering questions</li>
        </ul>
        <p className="mt-2">
          This Refund Policy primarily addresses Question Payments made by users to C3R4 ExpeTech Private Limited through the FamQnA platform.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4">3. Refund Eligibility</h2>
        <p>
          Refunds may be issued in the following circumstances:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-2">
          <li>
            <strong className="text-white">Unanswered Questions:</strong> If a creator does not answer your question within <strong className="text-primary">72 hours (3 days)</strong> of submission, you are eligible for a full refund. The refund will be processed automatically within 24 hours after the 72-hour deadline expires.
          </li>
          <li>
            <strong className="text-white">Technical Issues:</strong> If a technical error on our platform prevents your question from being delivered to a creator or prevents you from receiving an answer, you may be eligible for a refund. Technical issue refunds are processed within <strong className="text-primary">2-3 business days</strong> after verification.
          </li>
          <li>
            <strong className="text-white">Payment Processing Errors:</strong> If you were charged multiple times for the same question due to a payment processing error, the duplicate charges will be refunded within <strong className="text-primary">1-2 business days</strong> of identification.
          </li>
          <li>
            <strong className="text-white">Creator Account Termination:</strong> If a creator's account is terminated before they answer your question, you will receive a full refund within <strong className="text-primary">3-5 business days</strong> of the termination.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4">4. Non-Refundable Scenarios</h2>
        <p>
          Refunds will generally not be issued in the following circumstances:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-2">
          <li>
            <strong className="text-white">Answered Questions:</strong> Once a creator has answered your question within the 72-hour timeframe, regardless of whether you are satisfied with the answer, no refund will be issued.
          </li>
          <li>
            <strong className="text-white">Change of Mind:</strong> If you simply change your mind about asking a question after payment has been processed, no refund will be issued.
          </li>
          <li>
            <strong className="text-white">Inappropriate Content:</strong> If your question violates our Content Guidelines and is removed, no refund will be issued.
          </li>
          <li>
            <strong className="text-white">Violation of Terms:</strong> If your account has been suspended or terminated for violating our Terms & Conditions, you may not be eligible for refunds.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4">5. Refund Process and Timeline</h2>
        <p>
          To request a refund, please follow these steps:
        </p>
        <ol className="list-decimal pl-6 mt-2 space-y-2">
          <li>Visit the Question Tracking page for the specific question.</li>
          <li>Click on the "Request Refund" button (available only if the question is eligible for a refund).</li>
          <li>Complete the refund request form, providing all required information.</li>
          <li>Submit your request.</li>
        </ol>
        <p className="mt-4">
          Alternatively, you can contact our support team at support@famqna.in or call us at <strong className="text-white">+91 9680877137</strong>. Please include:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Your full name and email address</li>
          <li>The tracking ID of the question</li>
          <li>The date of the transaction</li>
          <li>The reason for the refund request</li>
        </ul>

        <div className="bg-dark-200 rounded-lg p-4 mt-6">
          <h3 className="text-lg font-semibold text-white mb-2">Refund Processing Timeline</h3>
          <ul className="list-disc pl-6 space-y-2 text-light-200">
            <li><strong className="text-accent-green">Automatic Refunds (Unanswered Questions):</strong> Processed within 24 hours after the 72-hour deadline</li>
            <li><strong className="text-accent-blue">Manual Refund Request Review:</strong> 1-2 business days for initial review</li>
            <li><strong className="text-accent-purple">Refund Approval to Payment Processor:</strong> 1-2 business days after approval</li>
            <li><strong className="text-accent-pink">Payment Processor to Your Account:</strong> 3-7 business days depending on your bank/payment method</li>
            <li><strong className="text-primary">Total Processing Time:</strong> 2-10 business days for manual refunds, 1-8 business days for automatic refunds</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4">6. Refund Processing Details</h2>
        <div className="space-y-4">
          <div className="bg-dark-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Business Days Definition</h3>
            <p className="text-light-200">
              Business days are Monday through Friday, excluding Indian national holidays and bank holidays. Weekend processing may be delayed.
            </p>
          </div>
          
          <div className="bg-dark-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Processing Timeline by Payment Method</h3>
            <ul className="list-disc pl-6 space-y-1 text-light-200">
              <li><strong className="text-white">UPI/Digital Wallets:</strong> 1-3 business days</li>
              <li><strong className="text-white">Credit/Debit Cards:</strong> 3-7 business days</li>
              <li><strong className="text-white">Net Banking:</strong> 2-5 business days</li>
              <li><strong className="text-white">International Cards:</strong> 7-14 business days</li>
            </ul>
          </div>
          
          <div className="bg-dark-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">Emergency Refund Processing</h3>
            <p className="text-light-200">
              For urgent cases involving technical errors or payment issues, we offer expedited processing within <strong className="text-primary">24-48 hours</strong>. Contact our support team at +91 9680877137 to request emergency processing.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4">7. Currency and Processing Fees</h2>
        <p>
          Refunds will be issued in the same currency as the original payment (typically Indian Rupees - INR). Please note that:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-2">
          <li>Payment processing fees charged by our payment processor are non-refundable in most cases</li>
          <li>For automatic refunds (unanswered questions), we refund the full amount including our platform fee</li>
          <li>Currency conversion fees (for international transactions) are not refundable</li>
          <li>Bank charges imposed by your financial institution are not covered by C3R4 ExpeTech Private Limited</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4">8. Disputes and Chargebacks</h2>
        <p>
          We encourage users to contact our support team at support@famqna.in or +91 9680877137 before initiating a chargeback with their payment provider. 
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-2">
          <li>Unauthorized or fraudulent chargebacks may result in the suspension or termination of your FamQnA account</li>
          <li>We provide comprehensive transaction documentation to resolve disputes fairly</li>
          <li>Most issues can be resolved faster through our direct support channels than through bank chargebacks</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4">9. Refund Status Tracking</h2>
        <p>
          You can track your refund status through multiple channels:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-2">
          <li>Your FamQnA account dashboard under "Transaction History"</li>
          <li>Email notifications sent to your registered email address</li>
          <li>SMS updates to your registered mobile number</li>
          <li>Contacting our support team with your transaction ID</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4">10. Changes to Refund Policy</h2>
        <p>
          C3R4 ExpeTech Private Limited reserves the right to modify this Refund Policy at any time. Changes will be effective immediately upon posting to our website at Famqna.in. We will provide notice of significant changes through the Service or by other means, including email notifications.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4">11. Contact Information</h2>
        <p>
          If you have any questions about this Refund Policy or need assistance with a refund, please contact us:
        </p>
        <ul className="list-none mt-2 space-y-1">
          <li><strong className="text-white">Company:</strong> C3R4 ExpeTech Private Limited</li>
          <li><strong className="text-white">Product:</strong> FamQnA</li>
          <li><strong className="text-white">Website:</strong> Famqna.in</li>
          <li><strong className="text-white">Email:</strong> support@famqna.in</li>
          <li><strong className="text-white">Phone:</strong> +91 9680877137</li>
          <li><strong className="text-white">Support Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM IST</li>
          <li><strong className="text-white">Address:</strong> Bokan Bhawan, VPO Harsh, Via-Sanwali, Sikar, Rajasthan, India, 332021</li>
        </ul>
      </section>
    </LegalPageLayout>
  );
};

export default RefundPage; 