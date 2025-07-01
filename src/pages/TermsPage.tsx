import React from 'react';
import LegalPageLayout from '../components/layout/LegalPageLayout';

const TermsPage: React.FC = () => {
  return (
    <LegalPageLayout title="Terms & Conditions" updatedDate="March 6, 2025">
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
        <p>
          Welcome to FamQnA, a product of <strong className="text-white">C3R4 ExpeTech Private Limited</strong>, hosted on <strong className="text-white">Famqna.in</strong>. By accessing or using our website, mobile applications, or any other services provided by FamQnA (collectively, the "Service"), you agree to be bound by these Terms & Conditions. If you do not agree to these terms, please do not use our Service.
        </p>
        <p className="mt-2">
          These terms constitute a legally binding agreement between you and C3R4 ExpeTech Private Limited ("Company", "we", "us", or "our"), the entity that owns and operates FamQnA.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4">2. About the Service Provider</h2>
        <p>
          FamQnA is developed, owned, and operated by <strong className="text-white">C3R4 ExpeTech Private Limited</strong>, a company incorporated under the laws of India. Our platform is accessible at <strong className="text-white">Famqna.in</strong> and through our mobile applications.
        </p>
        <p className="mt-2">
          Company Details:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li><strong className="text-white">Legal Name:</strong> C3R4 ExpeTech Private Limited</li>
          <li><strong className="text-white">Product Name:</strong> FamQnA</li>
          <li><strong className="text-white">Website:</strong> Famqna.in</li>
          <li><strong className="text-white">Business Type:</strong> Technology Platform</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4">3. Description of Service</h2>
        <p>
          FamQnA is a technology platform that connects users with creators for paid Q&A interactions. Our service allows users to submit questions to creators, who may choose to answer them for a fee. The platform facilitates these interactions, manages payments, and provides tools for communication. C3R4 ExpeTech Private Limited acts as an intermediary to enable these transactions and interactions.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4">4. User Accounts</h2>
        <p>
          To use certain features of our Service, you must register for an account. You agree to provide accurate and complete information when creating your account and to keep your account information updated. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
        </p>
        <p className="mt-2">
          C3R4 ExpeTech Private Limited reserves the right to suspend or terminate your account if any information provided is found to be inaccurate, false, or outdated, or if you have violated these Terms & Conditions.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4">5. Creator Accounts</h2>
        <p>
          Creators are users who register to receive and answer questions. Creators must provide additional information, including payment details, to receive payments. Creators are responsible for:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Providing accurate information about themselves</li>
          <li>Complying with all applicable laws and regulations</li>
          <li>Providing quality responses to questions they accept</li>
          <li>Managing their tax obligations</li>
          <li>Maintaining appropriate professional conduct</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4">6. Payments and Fees</h2>
        <p>
          Users must pay for questions before they are submitted to creators. Payment processing is handled through our third-party payment processor(s). By using our Service, you agree to comply with the terms of service of the payment processor we utilize.
        </p>
        <p className="mt-2">
          Creators receive a percentage of each payment for questions they answer, with the remaining portion retained by C3R4 ExpeTech Private Limited as a platform fee. The exact fee structure will be communicated within the platform and may be updated from time to time. Payments to creators are processed after questions are answered.
        </p>
        <p className="mt-2">
          All fees and prices are in Indian Rupees (INR) unless otherwise specified and may be inclusive of applicable taxes depending on local regulations. We reserve the right to change our fee structure with reasonable notice to users.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4">7. Content Guidelines</h2>
        <p>
          All content submitted to FamQnA, including questions and answers, must comply with the following guidelines:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>No illegal, harmful, threatening, abusive, harassing, defamatory, or offensive content</li>
          <li>No content that violates intellectual property rights</li>
          <li>No spam, phishing, or fraudulent content</li>
          <li>No content that promotes discrimination or hate speech</li>
          <li>No adult or explicit sexual content</li>
          <li>No content that could harm minors</li>
        </ul>
        <p className="mt-2">
          C3R4 ExpeTech Private Limited reserves the right to remove any content that violates these guidelines or to terminate accounts that repeatedly violate them.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4">8. Intellectual Property</h2>
        <p>
          Users retain ownership of the content they submit to FamQnA. By submitting content, you grant C3R4 ExpeTech Private Limited a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute that content in connection with the Service.
        </p>
        <p className="mt-2">
          The FamQnA name, logo, and all related names, logos, product and service names, designs, and slogans are trademarks of C3R4 ExpeTech Private Limited or its affiliates. You may not use these without our prior written permission.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4">9. Privacy</h2>
        <p>
          Our Privacy Policy describes how we collect, use, and share information about you. By using our Service, you consent to our collection and use of information as described in our Privacy Policy.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4">10. Disclaimers and Limitations of Liability</h2>
        <p>
          The Service is provided "as is" and "as available" without warranties of any kind, either express or implied. C3R4 ExpeTech Private Limited does not guarantee that the Service will be uninterrupted, secure, or error-free.
        </p>
        <p className="mt-2">
          To the maximum extent permitted by law, C3R4 ExpeTech Private Limited shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising out of or in connection with your use of the Service.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4">11. Indemnification</h2>
        <p>
          You agree to indemnify, defend, and hold harmless C3R4 ExpeTech Private Limited and its officers, directors, employees, agents, and affiliates from and against any claims, liabilities, damages, losses, and expenses, including reasonable attorneys' fees, arising out of or in any way connected with your access to or use of the Service or your violation of these Terms & Conditions.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4">12. Termination</h2>
        <p>
          C3R4 ExpeTech Private Limited may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason, including if you breach these Terms & Conditions. Upon termination, your right to use the Service will immediately cease.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4">13. Changes to Terms & Conditions</h2>
        <p>
          C3R4 ExpeTech Private Limited may modify these Terms & Conditions at any time. We will provide notice of significant changes through the Service or by other means. Your continued use of the Service after such changes constitutes your acceptance of the new Terms & Conditions.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4">14. Governing Law</h2>
        <p>
          These Terms & Conditions shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. You agree to submit to the personal jurisdiction of the courts located within India for the resolution of any disputes.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4">15. Contact Information</h2>
        <p>
          If you have any questions about these Terms & Conditions, please contact us:
        </p>
        <ul className="list-none mt-2 space-y-1">
          <li><strong className="text-white">Company:</strong> C3R4 ExpeTech Private Limited</li>
          <li><strong className="text-white">Product:</strong> FamQnA</li>
          <li><strong className="text-white">Website:</strong> Famqna.in</li>
          <li><strong className="text-white">Email:</strong> support@famqna.in</li>
          <li><strong className="text-white">Phone:</strong> +91 9680877137</li>
        </ul>
      </section>
    </LegalPageLayout>
  );
};

export default TermsPage; 