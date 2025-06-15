
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, Home, Users, DollarSign, Calendar, Shield, CheckCircle, UserPlus, Bell, CreditCard, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLogoWithBg from "@/components/AppLogoWithBg";

const Documentation = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const gettingStartedSteps = [
    {
      title: "Create Your Account",
      description: "Sign up with your email address in just 30 seconds",
      icon: UserPlus,
      image: "/api/placeholder/600/400",
      details: [
        "Click 'Get Started' on the homepage",
        "Enter your email and create a secure password",
        "Verify your email address",
        "You're ready to go!"
      ]
    },
    {
      title: "Choose Your Role",
      description: "Select whether you're a renter (managing rent) or resident (paying rent)",
      icon: Users,
      image: "/api/placeholder/600/400",
      details: [
        "Renter: You manage the household and collect rent",
        "Resident: You pay rent and track your payments",
        "You can change this role later if needed",
        "Each role has different features and permissions"
      ]
    },
    {
      title: "Set Up Your Household",
      description: "Create or join a household to start splitting rent",
      icon: Home,
      image: "/api/placeholder/600/400",
      details: [
        "Renters: Create a new household with rent amount and due date",
        "Residents: Join an existing household with an invitation link",
        "Add household details like name and monthly rent",
        "Invite other roommates to join"
      ]
    },
    {
      title: "Start Managing Rent",
      description: "Track payments, send reminders, and maintain transparency",
      icon: DollarSign,
      image: "/api/placeholder/600/400",
      details: [
        "View your dashboard with payment status",
        "Send gentle reminders to roommates",
        "Track payment history and due dates",
        "Export payment records for your records"
      ]
    }
  ];

  const userRoles = [
    {
      role: "Renter",
      description: "Property managers and primary leaseholders",
      color: "bg-blue-100 text-blue-800",
      features: [
        "Create and manage households",
        "Set rent amounts and due dates",
        "Invite residents to join",
        "Track all payments across households",
        "Send payment reminders",
        "Generate payment reports",
        "Manage household members"
      ],
      workflow: [
        "Create household with rent details",
        "Generate invitation links for residents",
        "Monitor payment status on dashboard",
        "Send reminders when payments are due",
        "Review payment history and analytics"
      ]
    },
    {
      role: "Resident",
      description: "Tenants and roommates who pay rent",
      color: "bg-green-100 text-green-800",
      features: [
        "Join households via invitation",
        "View your payment obligations",
        "Track payment history",
        "Receive payment notifications",
        "Update payment status",
        "View household information",
        "Leave households when moving out"
      ],
      workflow: [
        "Receive invitation link from renter",
        "Join household and set display name",
        "View dashboard with payment information",
        "Mark payments as completed",
        "Receive reminders for upcoming payments"
      ]
    }
  ];

  const features = [
    {
      category: "Payment Management",
      icon: CreditCard,
      items: [
        {
          name: "Fair Rent Splitting",
          description: "Automatically calculate each person's share of rent and utilities",
          benefit: "No more manual calculations or disputes"
        },
        {
          name: "Payment Tracking",
          description: "Visual indicators show who's paid and who hasn't",
          benefit: "Complete transparency for all household members"
        },
        {
          name: "Due Date Management",
          description: "Set custom due dates that work for your household",
          benefit: "Never miss a payment deadline again"
        }
      ]
    },
    {
      category: "Communication",
      icon: Bell,
      items: [
        {
          name: "Gentle Reminders",
          description: "Optional automated reminders keep everyone on track",
          benefit: "Reduce awkward conversations about money"
        },
        {
          name: "Real-time Updates",
          description: "Instant notifications when payments are made",
          benefit: "Stay informed without constant checking"
        },
        {
          name: "Household Messages",
          description: "Communicate with all household members easily",
          benefit: "Keep everyone in the loop effortlessly"
        }
      ]
    },
    {
      category: "Privacy & Security",
      icon: Shield,
      items: [
        {
          name: "Privacy First",
          description: "Your data stays yours - no tracking or ads",
          benefit: "Complete peace of mind about your information"
        },
        {
          name: "Secure Platform",
          description: "Bank-level security protects your data",
          benefit: "Trust that your information is safe"
        },
        {
          name: "No Hidden Costs",
          description: "Always free with no premium features locked away",
          benefit: "Access all features without worrying about costs"
        }
      ]
    }
  ];

  const faqs = [
    {
      question: "How do I create a household?",
      answer: "As a renter, go to your dashboard and click 'Create Household'. Enter the household name, monthly rent amount, and due date. You'll then receive invitation links to share with your residents."
    },
    {
      question: "How do residents join my household?",
      answer: "Share the invitation link from your dashboard with your residents. They'll click the link, create an account (if needed), and join your household automatically."
    },
    {
      question: "Can I manage multiple properties?",
      answer: "Yes! Renters can create and manage multiple households, each with different residents and rent amounts."
    },
    {
      question: "How do payment reminders work?",
      answer: "You can enable optional automated reminders that send gentle notifications to residents when payments are due. These are respectful and help maintain good relationships."
    },
    {
      question: "Is my financial information secure?",
      answer: "Absolutely. We use bank-level encryption and never store payment methods. We only track payment status, not actual financial transactions."
    },
    {
      question: "What if someone leaves the household?",
      answer: "Residents can leave households from their dashboard, and renters can remove members. The system automatically adjusts future payment calculations."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="bg-white/95 backdrop-blur-xl border-b border-green-200/50 shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <AppLogoWithBg size={40} />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-green-700 bg-clip-text text-transparent">
                  Rentable Documentation
                </h1>
                <p className="text-sm text-gray-600">Complete guide to mastering rent management</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate('/')}>
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="getting-started" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
            <TabsTrigger value="user-roles">User Roles</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="getting-started" className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                From Zero to Hero in 4 Simple Steps
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Follow this comprehensive guide to become a Rentable expert in minutes
              </p>
            </div>

            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-4">
                {gettingStartedSteps.map((_, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      index <= currentStep ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    {index < gettingStartedSteps.length - 1 && (
                      <div className={`w-16 h-1 mx-2 ${
                        index < currentStep ? 'bg-green-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Card className="max-w-4xl mx-auto">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {React.createElement(gettingStartedSteps[currentStep].icon, { className: "w-8 h-8 text-white" })}
                </div>
                <CardTitle className="text-2xl">{gettingStartedSteps[currentStep].title}</CardTitle>
                <CardDescription className="text-lg">
                  {gettingStartedSteps[currentStep].description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <img 
                    src={gettingStartedSteps[currentStep].image} 
                    alt={gettingStartedSteps[currentStep].title}
                    className="w-full rounded-lg mb-6"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {gettingStartedSteps[currentStep].details.map((detail, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  <Button 
                    onClick={() => setCurrentStep(Math.min(gettingStartedSteps.length - 1, currentStep + 1))}
                    disabled={currentStep === gettingStartedSteps.length - 1}
                    className="bg-gradient-to-r from-green-600 to-blue-600"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="user-roles" className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Understanding User Roles
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Learn about the two main user types and their capabilities
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {userRoles.map((role, index) => (
                <Card key={index} className="h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <CardTitle className="text-2xl">{role.role}</CardTitle>
                      <Badge className={role.color}>{role.role}</Badge>
                    </div>
                    <CardDescription className="text-lg">
                      {role.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-lg mb-3">Key Features</h4>
                      <div className="space-y-2">
                        {role.features.map((feature, fIndex) => (
                          <div key={fIndex} className="flex items-start space-x-3">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg mb-3">Typical Workflow</h4>
                      <div className="space-y-3">
                        {role.workflow.map((step, wIndex) => (
                          <div key={wIndex} className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                              {wIndex + 1}
                            </div>
                            <span className="text-gray-700 text-sm">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Powerful Features for Rent Management
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover all the tools that make Rentable the best choice for rent splitting
              </p>
            </div>

            <div className="space-y-12">
              {features.map((category, index) => (
                <div key={index}>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl flex items-center justify-center">
                      {React.createElement(category.icon, { className: "w-6 h-6 text-white" })}
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">{category.category}</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {category.items.map((item, itemIndex) => (
                      <Card key={itemIndex} className="h-full hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <CardTitle className="text-lg">{item.name}</CardTitle>
                          <CardDescription>{item.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-green-50 p-4 rounded-lg">
                            <p className="text-sm text-green-800 font-medium">
                              💡 {item.benefit}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="workflows" className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Common Workflows & Scenarios
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Real-world examples of how to use Rentable effectively
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Setting Up a New Household</CardTitle>
                  <CardDescription>Perfect for renters getting started</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">1</div>
                      <div>
                        <p className="font-medium">Create Account & Select Renter Role</p>
                        <p className="text-sm text-gray-600">Sign up and choose "Renter" when prompted for your role</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">2</div>
                      <div>
                        <p className="font-medium">Create Your Household</p>
                        <p className="text-sm text-gray-600">Enter household name, monthly rent ($2,500), and due date (1st of month)</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">3</div>
                      <div>
                        <p className="font-medium">Invite Residents</p>
                        <p className="text-sm text-gray-600">Share invitation links with your 3 roommates via text or email</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">4</div>
                      <div>
                        <p className="font-medium">Monitor & Manage</p>
                        <p className="text-sm text-gray-600">Track payments, send reminders, and maintain household harmony</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Joining an Existing Household</CardTitle>
                  <CardDescription>For residents moving into a shared space</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">1</div>
                      <div>
                        <p className="font-medium">Receive Invitation Link</p>
                        <p className="text-sm text-gray-600">Get the special link from your renter via text, email, or messaging app</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">2</div>
                      <div>
                        <p className="font-medium">Create Account</p>
                        <p className="text-sm text-gray-600">Sign up with your email and select "Resident" as your role</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">3</div>
                      <div>
                        <p className="font-medium">Join Household</p>
                        <p className="text-sm text-gray-600">Enter your display name and confirm joining the household</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">4</div>
                      <div>
                        <p className="font-medium">Track Your Payments</p>
                        <p className="text-sm text-gray-600">View your dashboard, mark payments as complete, and stay informed</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="faq" className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get answers to common questions about using Rentable
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg text-left">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Card className="max-w-2xl mx-auto bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
                  <p className="text-gray-700 mb-6">
                    Now that you're a Rentable expert, it's time to create your account and start managing rent like a pro!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      size="lg"
                      onClick={() => navigate('/register')}
                      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                    >
                      Create Your Account
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button variant="outline" size="lg" onClick={() => navigate('/')}>
                      Back to Homepage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Documentation;
