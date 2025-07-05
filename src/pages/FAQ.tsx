import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, HelpCircle } from 'lucide-react';
import AppLogoWithBg from "@/components/AppLogoWithBg";

const FAQ = () => {
  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "How do I create an account?",
          answer: "Simply click 'Sign Up' on our homepage, enter your email and create a password. You'll receive a verification email to activate your account."
        },
        {
          question: "Is InRent really free?",
          answer: "Yes! InRent is completely free to use. We don't charge any fees for creating households, splitting rent, or tracking payments."
        },
        {
          question: "How do I create my first household?",
          answer: "After logging in, click 'Create Household' on your dashboard. Enter your household details like rent amount, address, and start inviting your roommates."
        }
      ]
    },
    {
      category: "Household Management",
      questions: [
        {
          question: "How do I invite roommates?",
          answer: "In your household settings, click 'Invite Roommates' and send them the invitation link via email, text, or social media. They'll need to create an account to join."
        },
        {
          question: "Can I change rent splits after setting them up?",
          answer: "Yes, household admins can adjust rent splits at any time. Changes will apply to future rent periods, but past periods remain unchanged."
        },
        {
          question: "What happens if someone leaves the household?",
          answer: "You can remove members from the household settings. Their rent responsibilities will be redistributed according to your updated split preferences."
        },
        {
          question: "Can I have multiple households?",
          answer: "Yes! You can be part of multiple households - useful if you're subletting or managing properties for others."
        }
      ]
    },
    {
      category: "Payments & Tracking",
      questions: [
        {
          question: "Does InRent process payments?",
          answer: "No, InRent only tracks who has paid and who hasn't. You handle actual payments through your preferred method (Venmo, bank transfer, cash, etc.)."
        },
        {
          question: "How do I mark a payment as completed?",
          answer: "Click the payment status next to your name for the current month and mark it as 'Paid'. This updates everyone in your household."
        },
        {
          question: "Can I see payment history?",
          answer: "Yes, your dashboard shows a complete history of all payments for your household, including who paid what and when."
        },
        {
          question: "What if someone disputes a payment?",
          answer: "Use the household chat or discussion features to resolve disputes. Admins can adjust payment records if needed."
        }
      ]
    },
    {
      category: "Privacy & Security",
      questions: [
        {
          question: "Is my financial information secure?",
          answer: "Yes, we use bank-level encryption and never store sensitive financial data like bank account numbers or payment details."
        },
        {
          question: "Who can see my household information?",
          answer: "Only invited members of your household can see household details. Your information is never shared with other users or third parties."
        },
        {
          question: "Can I delete my account?",
          answer: "Yes, you can delete your account at any time from your profile settings. This will remove all your personal data from our system."
        },
        {
          question: "Do you sell my data?",
          answer: "Never. We don't sell, rent, or share your personal information with anyone. Your privacy is our priority."
        }
      ]
    },
    {
      category: "Troubleshooting",
      questions: [
        {
          question: "I forgot my password. How do I reset it?",
          answer: "Click 'Forgot Password' on the login page, enter your email, and we'll send you a secure reset link."
        },
        {
          question: "I'm not receiving email notifications",
          answer: "Check your spam folder and add support@inrent.app to your contacts. You can also adjust notification settings in your profile."
        },
        {
          question: "The app isn't working properly",
          answer: "Try refreshing your browser or logging out and back in. If problems persist, contact our support team at support@inrent.app."
        },
        {
          question: "How do I report a bug?",
          answer: "Send us details about the issue to support@inrent.app or use the feedback form in your account settings."
        }
      ]
    }
  ];

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
            <h1 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h1>
          </div>
          <p className="text-gray-600">Find answers to common questions about InRent</p>
        </div>

        <div className="space-y-8">
          {faqs.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <HelpCircle className="h-6 w-6 text-emerald-600" />
                  <span>{category.category}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${categoryIndex}-${index}`}>
                      <AccordionTrigger className="text-left font-medium text-gray-900 hover:text-emerald-600">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-700 leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Support */}
        <Card className="shadow-lg bg-emerald-50 border-emerald-200 mt-8">
          <CardContent className="p-6 text-center">
            <HelpCircle className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Still need help?</h3>
            <p className="text-gray-700 mb-4">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <Link 
              to="/support" 
              className="inline-flex items-center justify-center px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Contact Support
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FAQ;