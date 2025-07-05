
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, Home, Users, DollarSign, Calendar, Shield, CheckCircle, UserPlus, Bell, CreditCard, Settings, Check, Clock, AlertCircle, Mail, Star } from "lucide-react";
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
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&h=400&fit=crop",
      details: [
        "Click 'Get Started' on the homepage",
        "Enter your email and create a secure password",
        "Verify your email address",
        "Choose your role: Renter or Resident"
      ]
    },
    {
      title: "Choose Your Role",
      description: "Select whether you're a renter (managing rent) or resident (paying rent)",
      icon: Users,
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop",
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
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop",
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
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop",
      details: [
        "View your dashboard with payment status",
        "Mark payments as 'Paid' or 'Pending'",
        "Track payment history and due dates",
        "Send gentle reminders to roommates"
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
        "Manage household members",
        "View payment analytics"
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
        "Mark payments as Paid/Pending",
        "Track payment history",
        "Receive payment notifications",
        "Update payment status in real-time",
        "View household information",
        "Leave households when moving out"
      ],
      workflow: [
        "Receive invitation link from renter",
        "Join household and set display name",
        "View dashboard with payment information",
        "Mark payments as 'Paid' or 'Pending'",
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
          benefit: "No more manual calculations or disputes",
          status: "✅ Active"
        },
        {
          name: "Payment Status Tracking",
          description: "Visual indicators show who's paid and who hasn't with Paid/Pending status",
          benefit: "Complete transparency for all household members",
          status: "✅ Active"
        },
        {
          name: "Due Date Management",
          description: "Set custom due dates that work for your household",
          benefit: "Never miss a payment deadline again",
          status: "✅ Active"
        },
        {
          name: "Real-time Updates",
          description: "Instant updates when residents mark payments as paid",
          benefit: "Stay informed without constant checking",
          status: "🆕 New"
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
          benefit: "Reduce awkward conversations about money",
          status: "✅ Active"
        },
        {
          name: "Email Integration",
          description: "Send feedback and bug reports directly from the app",
          benefit: "Quick communication with support team",
          status: "🆕 New"
        },
        {
          name: "Household Messages",
          description: "Communicate with all household members easily",
          benefit: "Keep everyone in the loop effortlessly",
          status: "✅ Active"
        }
      ]
    },
    {
      category: "User Experience",
      icon: Shield,
      items: [
        {
          name: "Multi-language Support",
          description: "Available in English, Arabic, and Spanish with RTL support",
          benefit: "Accessible to users worldwide",
          status: "🆕 New"
        },
        {
          name: "Theme Customization",
          description: "Light, Dark, and Mid-Coffee Crash themes available",
          benefit: "Personalized experience for every user",
          status: "🆕 New"
        },
        {
          name: "Mobile Responsive",
          description: "Optimized for all screen sizes and devices",
          benefit: "Manage rent on-the-go from any device",
          status: "✅ Active"
        },
        {
          name: "Privacy First",
          description: "No tracking, no ads, always free platform",
          benefit: "Complete peace of mind about your information",
          status: "✅ Active"
        }
      ]
    }
  ];

  const newFeatures = [
    {
      title: "Payment Status Control",
      description: "Residents can now mark their rent as 'Paid' or 'Pending' directly from their dashboard",
      icon: Check,
      color: "text-green-600",
      details: "Real-time payment status updates for better household transparency"
    },
    {
      title: "Enhanced Dashboard",
      description: "Improved dashboard with better payment tracking and sign-out functionality",
      icon: Home,
      color: "text-blue-600",
      details: "Streamlined interface for both renters and residents"
    },
    {
      title: "Integrated Feedback System",
      description: "Send feedback and bug reports directly from the app via email",
      icon: Mail,
      color: "text-purple-600",
      details: "Quick communication channel for user suggestions and issues"
    },
    {
      title: "Multi-language & Themes",
      description: "Support for Arabic, English, Spanish with custom theme options",
      icon: Settings,
      color: "text-emerald-600",
      details: "Inclusive design with RTL support and personalization options"
    }
  ];

  const faqs = [
    {
      question: "How do I create a household?",
      answer: "As a renter, go to your dashboard and click 'Create Household'. Enter the household name, monthly rent amount, and due date. You'll then receive invitation links to share with your residents."
    },
    {
      question: "How do residents mark their payments?",
      answer: "Residents can mark their payments as 'Paid' or 'Pending' directly from their dashboard or the household detail page. This updates in real-time for all household members."
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
      question: "How do I change the app language or theme?",
      answer: "Access the Settings page from your dashboard to switch between English, Arabic, and Spanish, or choose from Light, Dark, or Mid-Coffee Crash themes."
    },
    {
      question: "How do I send feedback or report bugs?",
      answer: "Use the integrated feedback system in the Settings page. You can send feedback or bug reports directly via email from within the app."
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
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <AppLogoWithBg size={40} />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-700 to-green-700 bg-clip-text text-transparent">
                  InRent Documentation
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">Complete guide to mastering rent management</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate('/')} className="text-sm">
              <Home className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Home</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Tabs defaultValue="getting-started" className="w-full">
          <div className="overflow-x-auto mb-6 sm:mb-8">
            <TabsList className="grid w-full grid-cols-6 min-w-[600px] sm:min-w-0">
              <TabsTrigger value="getting-started" className="text-xs sm:text-sm">Getting Started</TabsTrigger>
              <TabsTrigger value="user-roles" className="text-xs sm:text-sm">User Roles</TabsTrigger>
              <TabsTrigger value="features" className="text-xs sm:text-sm">Features</TabsTrigger>
              <TabsTrigger value="new-features" className="text-xs sm:text-sm">What's New</TabsTrigger>
              <TabsTrigger value="workflows" className="text-xs sm:text-sm">Workflows</TabsTrigger>
              <TabsTrigger value="faq" className="text-xs sm:text-sm">FAQ</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="getting-started" className="space-y-6 sm:space-y-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                From Zero to Hero in 4 Simple Steps
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                Follow this comprehensive guide to become an InRent expert in minutes
              </p>
            </div>

            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto">
                {gettingStartedSteps.map((_, index) => (
                  <div key={index} className="flex items-center flex-shrink-0">
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold ${
                      index <= currentStep ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    {index < gettingStartedSteps.length - 1 && (
                      <div className={`w-8 sm:w-16 h-1 mx-1 sm:mx-2 ${
                        index < currentStep ? 'bg-green-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Card className="max-w-4xl mx-auto">
              <CardHeader className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {React.createElement(gettingStartedSteps[currentStep].icon, { className: "w-6 h-6 sm:w-8 sm:h-8 text-white" })}
                </div>
                <CardTitle className="text-xl sm:text-2xl">{gettingStartedSteps[currentStep].title}</CardTitle>
                <CardDescription className="text-base sm:text-lg">
                  {gettingStartedSteps[currentStep].description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                  <img 
                    src={gettingStartedSteps[currentStep].image} 
                    alt={gettingStartedSteps[currentStep].title}
                    className="w-full rounded-lg mb-4 sm:mb-6"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {gettingStartedSteps[currentStep].details.map((detail, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm sm:text-base text-gray-700">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                    className="w-full sm:w-auto"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  <Button 
                    onClick={() => setCurrentStep(Math.min(gettingStartedSteps.length - 1, currentStep + 1))}
                    disabled={currentStep === gettingStartedSteps.length - 1}
                    className="bg-gradient-to-r from-green-600 to-blue-600 w-full sm:w-auto"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="user-roles" className="space-y-6 sm:space-y-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Understanding User Roles
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                Learn about the two main user types and their capabilities
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {userRoles.map((role, index) => (
                <Card key={index} className="h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <CardTitle className="text-xl sm:text-2xl">{role.role}</CardTitle>
                      <Badge className={role.color}>{role.role}</Badge>
                    </div>
                    <CardDescription className="text-base sm:text-lg">
                      {role.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6">
                    <div>
                      <h4 className="font-semibold text-base sm:text-lg mb-3">Key Features</h4>
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
                      <h4 className="font-semibold text-base sm:text-lg mb-3">Typical Workflow</h4>
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

          <TabsContent value="features" className="space-y-8 sm:space-y-12">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Powerful Features for Rent Management
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                Discover all the tools that make InRent the best choice for rent splitting
              </p>
            </div>

            <div className="space-y-8 sm:space-y-12">
              {features.map((category, index) => (
                <div key={index}>
                  <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl flex items-center justify-center">
                      {React.createElement(category.icon, { className: "w-5 h-5 sm:w-6 sm:h-6 text-white" })}
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">{category.category}</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {category.items.map((item, itemIndex) => (
                      <Card key={itemIndex} className="h-full hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-center justify-between mb-2">
                            <CardTitle className="text-base sm:text-lg">{item.name}</CardTitle>
                            <Badge variant="outline" className="text-xs">{item.status}</Badge>
                          </div>
                          <CardDescription className="text-sm sm:text-base">{item.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                            <p className="text-xs sm:text-sm text-green-800 font-medium">
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

          <TabsContent value="new-features" className="space-y-6 sm:space-y-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                What's New in InRent
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                Latest features and improvements to enhance your rent management experience
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {newFeatures.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center ${feature.color}`}>
                        {React.createElement(feature.icon, { className: "w-5 h-5" })}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg sm:text-xl mb-2">{feature.title}</CardTitle>
                        <CardDescription className="text-sm sm:text-base">{feature.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs sm:text-sm text-gray-600 italic">{feature.details}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardContent className="p-6 sm:p-8 text-center">
                <Star className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">More Features Coming Soon!</h3>
                <p className="text-gray-700 mb-6 text-sm sm:text-base">
                  We're constantly working to improve InRent. Have a feature request? Send us feedback through the app!
                </p>
                <Button 
                  onClick={() => navigate('/register')}
                  className="bg-gradient-to-r from-green-600 to-blue-600"
                >
                  Try New Features Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workflows" className="space-y-6 sm:space-y-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Common Workflows & Scenarios
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                Real-world examples of how to use InRent effectively
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Setting Up a New Household</CardTitle>
                  <CardDescription>Perfect for renters getting started</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">1</div>
                      <div>
                        <p className="font-medium text-sm sm:text-base">Create Account & Select Renter Role</p>
                        <p className="text-xs sm:text-sm text-gray-600">Sign up and choose "Renter" when prompted for your role</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">2</div>
                      <div>
                        <p className="font-medium text-sm sm:text-base">Create Your Household</p>
                        <p className="text-xs sm:text-sm text-gray-600">Enter household name, monthly rent ($2,500), and due date (1st of month)</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">3</div>
                      <div>
                        <p className="font-medium text-sm sm:text-base">Invite Residents</p>
                        <p className="text-xs sm:text-sm text-gray-600">Share invitation links with your 3 roommates via text or email</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">4</div>
                      <div>
                        <p className="font-medium text-sm sm:text-base">Monitor & Manage</p>
                        <p className="text-xs sm:text-sm text-gray-600">Track payments, send reminders, and maintain household harmony</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Managing Payments as Resident</CardTitle>
                  <CardDescription>How residents track and update their payments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">1</div>
                      <div>
                        <p className="font-medium text-sm sm:text-base">Join Household</p>
                        <p className="text-xs sm:text-sm text-gray-600">Use invitation link from your renter to join the household</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">2</div>
                      <div>
                        <p className="font-medium text-sm sm:text-base">View Payment Status</p>
                        <p className="text-xs sm:text-sm text-gray-600">Check your dashboard for current payment obligations</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">3</div>
                      <div>
                        <p className="font-medium text-sm sm:text-base">Update Payment Status</p>
                        <p className="text-xs sm:text-sm text-gray-600">Mark your payment as "Paid" or "Pending" in real-time</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">4</div>
                      <div>
                        <p className="font-medium text-sm sm:text-base">Stay Informed</p>
                        <p className="text-xs sm:text-sm text-gray-600">Receive reminders and track payment history</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="faq" className="space-y-6 sm:space-y-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                Get answers to common questions about using InRent
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg text-left">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm sm:text-base text-gray-700">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8 sm:mt-12">
              <Card className="max-w-2xl mx-auto bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                <CardContent className="p-6 sm:p-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
                  <p className="text-sm sm:text-base text-gray-700 mb-6">
                    Now that you're an InRent expert, it's time to create your account and start managing rent like a pro!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                    <Button 
                      size="lg"
                      onClick={() => navigate('/register')}
                      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 w-full sm:w-auto"
                    >
                      Create Your Account
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button variant="outline" size="lg" onClick={() => navigate('/')} className="w-full sm:w-auto">
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
