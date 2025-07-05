import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, MessageCircle, Book, Clock, Phone, HelpCircle } from 'lucide-react';
import AppLogoWithBg from "@/components/AppLogoWithBg";

const Support = () => {
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
            <h1 className="text-3xl font-bold text-gray-900">Support Center</h1>
          </div>
          <p className="text-gray-600">Get help when you need it</p>
        </div>

        <div className="space-y-8">
          {/* Contact Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <Mail className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Email Support</h3>
                <p className="text-gray-600 text-sm mb-4">Get detailed help via email</p>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Contact Support
                </Button>
                <p className="text-xs text-gray-500 mt-2">Response within 24 hours</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Live Chat</h3>
                <p className="text-gray-600 text-sm mb-4">Chat with our support team</p>
                <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">
                  Start Chat
                </Button>
                <p className="text-xs text-gray-500 mt-2">Available 9AM - 6PM EST</p>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <Book className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Documentation</h3>
                <p className="text-gray-600 text-sm mb-4">Browse our help articles</p>
                <Button 
                  variant="outline" 
                  className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
                  onClick={() => window.open('/documentation', '_blank')}
                >
                  View Docs
                </Button>
                <p className="text-xs text-gray-500 mt-2">Self-service help</p>
              </CardContent>
            </Card>
          </div>

          {/* Common Issues */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <HelpCircle className="h-6 w-6 text-emerald-600" />
                <span>Common Issues</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Account & Login</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="text-emerald-600 mt-1">•</span>
                      <span className="text-gray-700 text-sm">Forgot password or can't log in</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-emerald-600 mt-1">•</span>
                      <span className="text-gray-700 text-sm">Email verification issues</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-emerald-600 mt-1">•</span>
                      <span className="text-gray-700 text-sm">Account deletion requests</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-emerald-600 mt-1">•</span>
                      <span className="text-gray-700 text-sm">Profile information updates</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Household Management</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="text-emerald-600 mt-1">•</span>
                      <span className="text-gray-700 text-sm">Creating and managing households</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-emerald-600 mt-1">•</span>
                      <span className="text-gray-700 text-sm">Inviting roommates</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-emerald-600 mt-1">•</span>
                      <span className="text-gray-700 text-sm">Rent splitting calculations</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-emerald-600 mt-1">•</span>
                      <span className="text-gray-700 text-sm">Payment tracking issues</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support Hours */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Clock className="h-6 w-6 text-emerald-600" />
                <span>Support Hours</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Live Support</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM EST</p>
                    <p><strong>Saturday:</strong> 10:00 AM - 4:00 PM EST</p>
                    <p><strong>Sunday:</strong> Closed</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Email Support</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Response Time:</strong> Within 24 hours</p>
                    <p><strong>Availability:</strong> 24/7 submission</p>
                    <p><strong>Emergency:</strong> security@inrent.app</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="shadow-lg bg-emerald-50 border-emerald-200">
            <CardHeader>
              <CardTitle>Get in Touch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">General Support</h3>
                  <p className="text-gray-700">support@inrent.app</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Security Issues</h3>
                  <p className="text-gray-700">security@inrent.app</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Feedback</h3>
                  <p className="text-gray-700">feedback@inrent.app</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Business Inquiries</h3>
                  <p className="text-gray-700">hello@inrent.app</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Support;