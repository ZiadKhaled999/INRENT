import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield, Lock, Eye, Database, Bell, UserCheck } from 'lucide-react';
import AppLogoWithBg from "@/components/AppLogoWithBg";

const Security = () => {
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
            <h1 className="text-3xl font-bold text-gray-900">Security & Protection</h1>
          </div>
          <p className="text-gray-600">How we keep your data safe and secure</p>
        </div>

        <div className="space-y-8">
          {/* Data Security */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Database className="h-6 w-6 text-emerald-600" />
                <span>Data Security</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Encryption</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• End-to-end encryption for all data</li>
                    <li>• TLS 1.3 for data in transit</li>
                    <li>• AES-256 encryption for stored data</li>
                    <li>• Encrypted database backups</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Infrastructure</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• SOC 2 Type II compliant hosting</li>
                    <li>• Regular security audits</li>
                    <li>• Automated threat detection</li>
                    <li>• 24/7 monitoring and alerts</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Security */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Lock className="h-6 w-6 text-emerald-600" />
                <span>Account Security</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Authentication</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Strong password requirements</li>
                    <li>• Email verification required</li>
                    <li>• Account lockout after failed attempts</li>
                    <li>• Secure password reset process</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Access Control</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Role-based permissions</li>
                    <li>• Session timeout management</li>
                    <li>• Device tracking and management</li>
                    <li>• Suspicious activity detection</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Protection */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Eye className="h-6 w-6 text-emerald-600" />
                <span>Privacy Protection</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Data Minimization</h3>
                  <p className="text-gray-700">We only collect data that's necessary for our services to function properly.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">No Third-Party Sharing</h3>
                  <p className="text-gray-700">Your personal and financial information is never sold or shared with third parties.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Data Retention</h3>
                  <p className="text-gray-700">Data is automatically deleted according to our retention policies.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Features */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-emerald-600" />
                <span>Security Features</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Bell className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-2">Security Alerts</h3>
                  <p className="text-sm text-gray-700">Instant notifications for suspicious activities</p>
                </div>
                <div className="text-center">
                  <UserCheck className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-2">Identity Verification</h3>
                  <p className="text-sm text-gray-700">Multi-step verification for account changes</p>
                </div>
                <div className="text-center">
                  <Lock className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-2">Secure Sessions</h3>
                  <p className="text-sm text-gray-700">Automatic logout and session management</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reporting Security Issues */}
          <Card className="shadow-lg border-l-4 border-l-emerald-500">
            <CardHeader>
              <CardTitle>Report Security Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                If you discover a security vulnerability, please report it to us immediately:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-900">Security Team Contact</p>
                <p className="text-gray-700">Email: security@inrent.app</p>
                <p className="text-sm text-gray-600 mt-2">
                  We take all security reports seriously and will respond within 24 hours.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Security;