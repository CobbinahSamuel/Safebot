import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Shield, Menu, X, Github, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const navigationItems = [
  { title: "Home", url: createPageUrl("Home") },
  { title: "How It Works", url: createPageUrl("HowItWorks") },
  { title: "Analytics", url: createPageUrl("Analytics") },
  { title: "Report Incident", url: createPageUrl("ReportIncident") },
  { title: "Admin", url: createPageUrl("AdminDashboard") },
  
  
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-gray-200/80 backdrop-blur-xl bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">
                  SAFEBOT
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Campus Safety</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.url}
                  className={`text-sm font-medium transition-all duration-300 hover:text-green-600 ${
                    location.pathname === item.url
                      ? "text-green-600"
                      : "text-gray-600"
                  }`}
                >
                  {item.title}
                </Link>
              ))}
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-800">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-white border-l border-gray-200">
                  <SheetHeader>
                    <SheetTitle>Navigation</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-4 mt-8">
                    {navigationItems.map((item) => (
                      <Link
                        key={item.title}
                        to={item.url}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`text-lg font-medium transition-colors duration-300 hover:text-green-600 ${
                          location.pathname === item.url
                            ? "text-green-600"
                            : "text-gray-700"
                        }`}
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">
                  SAFEBOT
                </span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed max-w-md">
                Your campus safety is our priority. Report incidents, get help, and stay informed 
                with UMaT's intelligent safety assistant.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-gray-900 font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                {["About", "Safety Tips", "Contact", "Privacy"].map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="block text-gray-600 hover:text-green-600 transition-colors duration-300 text-sm"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-gray-900 font-semibold mb-4">Connect</h3>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-green-100 transition-colors duration-300"
                >
                  <Github className="w-4 h-4 text-gray-600" />
                </a>
                <a
                  href="mailto:safety@umat.edu.gh"
                  className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-green-100 transition-colors duration-300"
                >
                  <Mail className="w-4 h-4 text-gray-600" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2025 SAFEBOT. University of Mines and Technology (UMaT-SRID)
            </p>
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <Lock className="w-4 h-4" />
              <span>Your safety infomation well logged</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}