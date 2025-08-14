import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MessageSquare, 
  MapPin, 
  Shield, 
  Phone, 
  AlertTriangle,
  Clock,
  Users,
  CheckCircle,
  ArrowRight
} from "lucide-react";

const features = [
  {
    icon: AlertTriangle,
    title: "Real-Time Reporting",
    description: "Submit incident reports instantly with photos, location data, and detailed descriptions. Our AI categorizes and prioritizes your report automatically.",
    gradient: "from-red-400 to-orange-500",
  },
  {
    icon: MapPin,
    title: "Location-Aware Alerts",
    description: "Receive targeted safety notifications based on your campus location. Stay informed about incidents in your immediate area.",
    gradient: "from-green-400 to-green-600",
  },
  {
    icon: Shield,
    title: "Anonymous Tips",
    description: "Report sensitive information anonymously while maintaining your privacy. Help create a safer campus environment for everyone.",
    gradient: "from-blue-400 to-sky-500",
  },
  {
    icon: Phone,
    title: "Emergency Contacts",
    description: "One-tap access to campus security, medical services, and emergency contacts. Quick response when every second counts.",
    gradient: "from-emerald-500 to-teal-500",
  }
];

const steps = [
  { number: "01", title: "Report Incident", description: "Quickly report any safety concern using our intuitive form or chatbot interface." },
  { number: "02", title: "AI Processing", description: "Our intelligent system categorizes, prioritizes, and routes your report to the right team." },
  { number: "03", title: "Immediate Response", description: "Campus security receives instant alerts and begins appropriate response procedures." },
  { number: "04", title: "Follow-up", description: "Track your report status and receive updates until the issue is fully resolved." }
];

export default function HowItWorks() {
  return (
    <div className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-green-100 border border-green-200 rounded-full px-4 py-2 mb-8">
            <span className="text-green-700 text-sm font-medium">How SAFEBOT Works</span>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Smart Safety in{" "}
            <span className="bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">
              Four Steps
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover how our AI-powered safety platform protects the UMaT campus community 
            through intelligent reporting and rapid response systems.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {features.map((feature) => (
            <Card 
              key={feature.title}
              className="bg-white border border-gray-200/80 shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden"
            >
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-lg">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Process Steps */}
        <div className="bg-gray-50 rounded-3xl p-8 lg:p-12 border border-gray-200/80">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              The SAFEBOT Process
            </h2>
            <p className="text-gray-600 text-lg">
              From report to resolution - here's how we keep you safe
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gray-300 transform translate-y-1/2 z-0"></div>
                )}
                
                <div className="relative z-10 text-center">
                  {/* Step Number */}
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-white font-bold text-lg">{step.number}</span>
                  </div>
                  
                  {/* Step Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-5xl font-bold bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent mb-2">
              94%
            </div>
            <p className="text-gray-900 font-semibold mb-1">Report Handling Success</p>
            <p className="text-gray-500 text-sm">Issues resolved effectively</p>
          </div>
          
          <div className="text-center">
            <div className="text-5xl font-bold bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent mb-2">
              3m
            </div>
            <p className="text-gray-900 font-semibold mb-1">Average Response Time</p>
            <p className="text-gray-500 text-sm">From report to action</p>
          </div>
          
          <div className="text-center">
            <div className="text-5xl font-bold bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent mb-2">
              24/7
            </div>
            <p className="text-gray-900 font-semibold mb-1">Always Available</p>
            <p className="text-gray-500 text-sm">Round-the-clock safety</p>
          </div>
        </div>
      </div>
    </div>
  );
}