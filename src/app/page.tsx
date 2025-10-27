'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Shield, Database, Zap, Users, Lock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Navbar } from '@/components/layout/Navbar';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <Navbar user={null} />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Production-Ready
            <span className="block bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              SaaS Platform
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Enterprise-grade authentication, role-based access control, and multi-database architecture
            built with Next.js 15+ and MongoDB
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" onClick={() => router.push('/dashboard')}>
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => router.push('/login')}>
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Enterprise Features Out of the Box
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Shield className="w-12 h-12 text-purple-600 mb-4" />
              <CardTitle>Complete Authentication</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Email/password authentication, Google OAuth, and owner 2FA via email for maximum security
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Database className="w-12 h-12 text-indigo-600 mb-4" />
              <CardTitle>Multi-Database Architecture</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Isolated databases for paid users, shared read-only data for free users, and centralized user management
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Lock className="w-12 h-12 text-purple-600 mb-4" />
              <CardTitle>Role-Based Access Control</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Owner, admin, and user roles with granular permissions and middleware protection
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="w-12 h-12 text-indigo-600 mb-4" />
              <CardTitle>Plan-Based Features</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Free, Pro, and Max plans with automatic routing to isolated databases and feature limitations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="w-12 h-12 text-purple-600 mb-4" />
              <CardTitle>Project Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Create and manage projects with plan-based limits and isolated data storage
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CheckCircle className="w-12 h-12 text-indigo-600 mb-4" />
              <CardTitle>Production Ready</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                TypeScript, modern folder structure, middleware protection, and deployment-ready configuration
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Simple, Transparent Pricing
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <p className="text-3xl font-bold text-gray-900 mt-4">$0</p>
              <p className="text-gray-600">per month</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                  <span>Read-only shared data access</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                  <span>Basic authentication</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                  <span>Community support</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full mt-6" onClick={() => router.push('/register')}>
                Get Started
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-600">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>Pro</CardTitle>
                <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">Popular</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 mt-4">$29</p>
              <p className="text-gray-600">per month</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                  <span>Isolated database</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                  <span>Up to 10 projects</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                  <span>Priority support</span>
                </li>
              </ul>
              <Button className="w-full mt-6" onClick={() => router.push('/register')}>
                Start Pro Trial
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Max</CardTitle>
              <p className="text-3xl font-bold text-gray-900 mt-4">$99</p>
              <p className="text-gray-600">per month</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                  <span>Dedicated database</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                  <span>Up to 100 projects</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                  <span>24/7 priority support</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full mt-6" onClick={() => router.push('/register')}>
                Contact Sales
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2024 SaaS App. All rights reserved. Built with Next.js 15+ and MongoDB.
          </p>
        </div>
      </footer>
    </div>
  );
}
