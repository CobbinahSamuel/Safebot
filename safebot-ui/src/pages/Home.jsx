import React, { useEffect } from "react";
import { href, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Shield,
  MessageSquare,
  AlertTriangle,
  Clock,
  Users,
  CheckCircle,
  ArrowRight,
  Phone,
  MapPin,
  Zap,
} from "lucide-react";

export default function Home() {
  useEffect(() => {
    // Inject ChatGPTBuilder widget script
    const script = document.createElement("script");
    script.src = "https://app.chatgptbuilder.io/webchat/plugin.js?v=6";
    script.async = true;
    script.onload = () => {
      if (window.ktt10) {
        window.ktt10.setup({
          id: "rOUB1oZCfB1u2lbf",
          accountId: "1359090",
          color: "#36D6B5",
        });

        // Auto-open the widget after a short delay
        setTimeout(() => {
          if (typeof window.ktt10.open === "function") {
            window.ktt10.open();
          }
        }, 1000);
      }
    };
    document.body.appendChild(script);
  }, []);

  return (
    <div className='bg-white'>
      {/* Hero Section */}
      <section className='relative overflow-hidden'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32'>
          <div className='text-center'>
            <div className='inline-flex items-center gap-2 bg-green-100 border border-green-200 rounded-full px-4 py-2 mb-8'>
              <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
              <span className='text-green-700 text-sm font-medium'>
                Live Campus Safety System
              </span>
            </div>

            <h1 className='text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight'>
              <span className='bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent'>
                Report.
              </span>{" "}
              Stay Informed. Be Safe.
            </h1>

            <p className='text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed'>
              Your intelligent campus safety companion. Report incidents, get
              real-time alerts, and access emergency support with UMaT's
              advanced safety assistant.
            </p>

            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center mb-16'>
              <Link to={createPageUrl("ReportIncident")}>
                <Button
                  size='lg'
                  className='bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-green-500/25 transition-all duration-300 group w-full sm:w-auto'
                >
                  <AlertTriangle className='w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300' />
                  Report Now
                  <ArrowRight className='w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300' />
                </Button>
              </Link>

              <a
                href={`https://t.me/${
                  import.meta.env.VITE_TELEGRAM_BOT_USERNAME || "UMaT_safebot"
                }`}
                target='_blank'
                rel='noopener noreferrer'
                className='w-full sm:w-auto'
              >
                <Button
                  variant='outline'
                  size='lg'
                  className='border-gray-300 text-gray-700 hover:bg-gray-100 px-8 py-6 text-lg font-semibold rounded-xl w-full'
                >
                  <MessageSquare className='w-5 h-5 mr-2' />
                  Chat on Telegram
                </Button>
              </a>
            </div>

            <div className='flex flex-wrap justify-center items-center gap-8 text-gray-500'>
              <div className='flex items-center gap-2'>
                <CheckCircle className='w-5 h-5 text-green-500' />
                <span className='text-sm'>Secure & Anonymous</span>
              </div>
              <div className='flex items-center gap-2'>
                <Clock className='w-5 h-5 text-green-500' />
                <span className='text-sm'>24/7 Available</span>
              </div>
              <div className='flex items-center gap-2'>
                <Users className='w-5 h-5 text-green-500' />
                <span className='text-sm'>UMaT-SRID Official</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className='relative py-20 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl lg:text-4xl font-bold text-gray-900 mb-4'>
              Campus Safety Report Made Simple
            </h2>
            <p className='text-gray-600 text-lg max-w-2xl mx-auto'>
              Advanced features designed to keep UMaT students safe and
              connected
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {[
              {
                icon: Zap,
                title: "Timely Alerts",
                description:
                  "notifications about campus incidents and safety updates delivered directly to you on telegram",
              },

              {
                icon: MapPin,
                title: "Location-Constraints",
                description:
                  "UMaT-SID campus, hostels and nearby communities for valid incident reporting and targeted safety alerts.",
              },
              {
                icon: Shield,
                title: "Crime Hotspot",
                description:
                  "Identify Campus crime hotspots and related crime activities.",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className='bg-white border border-gray-200/80 shadow-sm hover:shadow-lg transition-all duration-300 group'
              >
                <CardContent className='p-8 text-center'>
                  <div className='w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300'>
                    <feature.icon className='w-8 h-8 text-white' />
                  </div>
                  <h3 className='text-xl font-bold text-gray-900 mb-4'>
                    {feature.title}
                  </h3>
                  <p className='text-gray-600 leading-relaxed'>
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Chatbot Integration Card Section */}
      <section className='relative py-20'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='text-3xl lg:text-4xl font-bold text-gray-900 mb-8'>
            Meet Your Safety Assistant
          </h2>
          <a
            href={`https://t.me/${
              import.meta.env.VITE_TELEGRAM_BOT_USERNAME || "UMaT_safebot"
            }`}
            target='_blank'
            rel='noopener noreferrer'
            className='block'
          >
            <div className='bg-white border border-gray-200/80 rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all duration-300'>
              <div className='aspect-video bg-gray-100 rounded-2xl flex items-center justify-center mb-6'>
                <div className='text-center'>
                  <MessageSquare className='w-16 h-16 text-green-500 mx-auto mb-4' />
                  <p className='text-gray-800 text-lg'>
                    Start Chat with SAFEBOT
                  </p>
                  <p className='text-gray-500 text-sm mt-2'>
                    Open Telegram App
                  </p>
                </div>
              </div>
              <p className='text-gray-600'>
                Chat with SAFEBOT for instant help, safety tips, and emergency
                guidance
              </p>
            </div>
          </a>
        </div>
      </section>
    </div>
  );
}
import { useState } from "react";
import { useNavigate } from "react-router-dom";
