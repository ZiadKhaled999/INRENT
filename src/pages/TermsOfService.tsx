import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from 'lucide-react';
import AppLogoWithBg from "@/components/AppLogoWithBg";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center space-x-3 mb-4">
            <AppLogoWithBg size={48} />
            <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
          </div>
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <div className="space-y-4 text-gray-700">
                <p>By accessing and using InRent ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <div className="space-y-4 text-gray-700">
                <p>InRent is a platform designed to help roommates and household members manage shared expenses, particularly rent splitting. The service includes:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Household management and organization tools</li>
                  <li>Expense tracking and splitting calculations</li>
                  <li>Payment notifications and reminders</li>
                  <li>Communication tools for household members</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
              <div className="space-y-4 text-gray-700">
                <h3 className="text-lg font-medium">Account Creation</h3>
                <p>To use InRent, you must:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and update your account information</li>
                  <li>Keep your login credentials secure and confidential</li>
                  <li>Be at least 18 years old or have parental consent</li>
                </ul>

                <h3 className="text-lg font-medium">Account Responsibility</h3>
                <p>You are responsible for all activities that occur under your account. Notify us immediately of any unauthorized use of your account.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Acceptable Use</h2>
              <div className="space-y-4 text-gray-700">
                <p>You agree not to use the Service to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Violate any laws or regulations</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Upload malicious code or compromise system security</li>
                  <li>Impersonate others or provide false information</li>
                  <li>Interfere with the proper functioning of the Service</li>
                  <li>Use the Service for commercial purposes without authorization</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Financial Information</h2>
              <div className="space-y-4 text-gray-700">
                <p>InRent helps track and calculate shared expenses but does not:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Process actual payments or financial transactions</li>
                  <li>Store sensitive payment information like credit card numbers</li>
                  <li>Guarantee the accuracy of user-provided financial data</li>
                  <li>Provide financial advice or legal counsel</li>
                </ul>
                <p>Users are responsible for the accuracy of financial information they input and for actual payment arrangements with their household members.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Privacy and Data</h2>
              <div className="space-y-4 text-gray-700">
                <p>Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Intellectual Property</h2>
              <div className="space-y-4 text-gray-700">
                <p>The Service and its original content, features, and functionality are owned by InRent and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Disclaimers</h2>
              <div className="space-y-4 text-gray-700">
                <p>The Service is provided "as is" without warranties of any kind. We do not guarantee:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Uninterrupted or error-free service</li>
                  <li>Accuracy of calculations or user-provided data</li>
                  <li>Resolution of disputes between household members</li>
                  <li>Compatibility with all devices or browsers</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Limitation of Liability</h2>
              <div className="space-y-4 text-gray-700">
                <p>InRent shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Termination</h2>
              <div className="space-y-4 text-gray-700">
                <p>We may terminate or suspend your account and access to the Service immediately, without prior notice, for any reason, including if you breach these Terms.</p>
                <p>You may also terminate your account at any time through your account settings.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to Terms</h2>
              <div className="space-y-4 text-gray-700">
                <p>We reserve the right to modify these terms at any time. We will notify users of any changes by posting the new Terms of Service on this page and updating the "Last updated" date.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Governing Law</h2>
              <div className="space-y-4 text-gray-700">
                <p>These Terms shall be interpreted and governed in accordance with the laws of the jurisdiction where InRent operates, without regard to conflict of law provisions.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Information</h2>
              <div className="space-y-4 text-gray-700">
                <p>If you have any questions about these Terms of Service, please contact us:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Email: legal@inrent.app</li>
                  <li>Through our support channels in the app</li>
                </ul>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;