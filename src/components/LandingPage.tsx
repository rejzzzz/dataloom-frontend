
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Database, Sparkles, Download, Zap, Shield, Cpu, BarChart3, Clock, Users, Code, Github, Twitter, Linkedin, Mail } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage = ({ onGetStarted }: LandingPageProps) => {
  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Schema Generation",
      description: "Simply describe your dataset and let our advanced AI models create the perfect schema structure with appropriate data types and relationships."
    },
    {
      icon: Zap,
      title: "Multiple AI Models",
      description: "Choose from Mistral, Claude, or Llama models, each optimized for different types of data generation tasks and complexity levels."
    },
    {
      icon: Download,
      title: "Export Ready Formats",
      description: "Download your generated data in JSON or CSV format, ready for immediate use in your applications, databases, or analysis tools."
    },
    {
      icon: Shield,
      title: "Privacy-First Approach",
      description: "Generate synthetic data that maintains statistical properties while ensuring complete privacy and compliance with data protection regulations."
    },
    {
      icon: Cpu,
      title: "Intelligent Data Types",
      description: "Our AI automatically detects and generates appropriate data types including strings, numbers, dates, booleans, and categorical values."
    },
    {
      icon: BarChart3,
      title: "Realistic Relationships",
      description: "Generate data with realistic correlations and patterns that mirror real-world datasets for better testing and development."
    }
  ];

  const useCases = [
    {
      icon: Code,
      title: "Software Development",
      description: "Create realistic test data for your applications without exposing sensitive production data."
    },
    {
      icon: Users,
      title: "Data Science",
      description: "Generate training datasets for machine learning models and data analysis experiments."
    },
    {
      icon: Database,
      title: "Database Testing",
      description: "Populate development and staging databases with meaningful synthetic data for testing."
    },
    {
      icon: Clock,
      title: "Rapid Prototyping",
      description: "Quickly generate sample data to demonstrate concepts and validate ideas."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-16 animate-fade-in mt-16">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-primary/10 rounded-full shadow-lg">
              <Database className="w-16 h-16 text-primary" />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            DataLoom
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Generate realistic, privacy-safe synthetic datasets for your projects.
            Power your development, testing, and analysis with AI-generated data that mirrors real-world patterns
            while maintaining complete privacy and compliance.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <Button
              onClick={onGetStarted}
              size="lg"
              className="px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Get Started Free
              <Sparkles className="w-5 h-5 ml-2" />
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4" />
              <span>No signup required • Privacy-first • Unlimited use</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Powerful Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="p-3 bg-gradient-to-br from-primary/10 to-purple-100 rounded-full w-fit">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Use Cases Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Perfect For
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white/60 backdrop-blur-sm">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full w-fit mx-auto">
                    <useCase.icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{useCase.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {useCase.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How it Works Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto">
                1
              </div>
              <h3 className="text-xl font-semibold">Describe Your Data</h3>
              <p className="text-muted-foreground">
                Simply describe what kind of dataset you need in natural language
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto">
                2
              </div>
              <h3 className="text-xl font-semibold">AI Generates Schema</h3>
              <p className="text-muted-foreground">
                Our AI creates a perfect schema with appropriate fields and data types
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto">
                3
              </div>
              <h3 className="text-xl font-semibold">Download & Use</h3>
              <p className="text-muted-foreground">
                Generate synthetic data and download in your preferred format
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">3</div>
              <div className="text-sm text-muted-foreground">AI Models</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">15</div>
              <div className="text-sm text-muted-foreground">Max Columns</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Privacy Safe</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">2</div>
              <div className="text-sm text-muted-foreground">Export Formats</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Database className="w-8 h-8 text-primary" />
                <span className="text-xl font-bold">DataLoom</span>
              </div>
              <p className="text-gray-400 text-sm">
                Generate privacy-safe synthetic datasets with the power of AI for development, testing, and analysis.
              </p>
            </div>

            {/* Product */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Product</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">AI Models</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Export Formats</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Use Cases</a></li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Company</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Connect */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Connect</h3>
              <div className="flex gap-4">
                  <a href={import.meta.env.VITE_GITHUB_URL} className="text-gray-400 hover:text-white transition-colors" target='_blank'>
                  <Github className="w-5 h-5" />
                </a>
                  <a href={import.meta.env.VITE_TWITTER_URL} className="text-gray-400 hover:text-white transition-colors" target='_blank'>
                  <Twitter className="w-5 h-5" />
                </a>
                  <a href={import.meta.env.VITE_LINKEDIN_URL} className="text-gray-400 hover:text-white transition-colors" target='_blank'>
                  <Linkedin className="w-5 h-5" />
                </a>
                  <a href={import.meta.env.VITE_EMAIL_URL} className="text-gray-400 hover:text-white transition-colors" target='_blank'>
                  <Mail className="w-5 h-5" />
                </a>
              </div>
              <p className="text-gray-400 text-sm">
                Get updates on new features and AI model improvements.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 DataLoom. All rights reserved. Built with AI for developers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
