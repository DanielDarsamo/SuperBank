'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageLayout } from '@/components/layout/page-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  UserPlus, 
  Clock, 
  CreditCard, 
  Shield, 
  Smartphone, 
  Users,
  ArrowRight
} from 'lucide-react';
import { useAppStore } from '@/store/app-store';
import { useTranslation } from '@/lib/translations';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();
  const { user, language } = useAppStore();
  const { t } = useTranslation(language);

  const features = [
    {
      icon: UserPlus,
      title: t('accountOpening'),
      description: 'Open your account remotely with document upload and digital verification',
      href: '/account-opening',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Clock,
      title: t('queueManagement'),
      description: 'Join virtual queues and track your position in real-time',
      href: '/queue-management',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: CreditCard,
      title: t('bankingServices'),
      description: 'Access balance, transfers, and payments through USSD-style interface',
      href: '/banking-services',
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: 'Secure & Trusted',
      description: 'Bank-grade security with PIN protection and encrypted data'
    },
    {
      icon: Smartphone,
      title: 'Mobile First',
      description: 'Designed for mobile devices with USSD-style familiar interface'
    },
    {
      icon: Users,
      title: 'Customer Support',
      description: 'Multi-language support with SMS and voice assistance'
    }
  ];

  if (!user) {
    return (
      <PageLayout>
        <div className="text-center py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {t('welcome')} to MozBank
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Modern banking services designed for Mozambique. Open accounts, manage queues, 
              and access banking services through an intuitive mobile-first platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/login">
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8">
                <Link href="/faq">
                  Learn More
                </Link>
              </Button>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="text-center">
                      <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mx-auto mb-4`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>

            {/* Benefits Section */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-3xl font-bold text-center mb-8">Why Choose MozBank?</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={index} className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-8 h-8 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={`${t('welcome')}, ${user.phone}`}>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href={feature.href}>
                    Access Service
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-20 flex-col">
            <CreditCard className="w-6 h-6 mb-2" />
            Balance
          </Button>
          <Button variant="outline" className="h-20 flex-col">
            <Clock className="w-6 h-6 mb-2" />
            Queue
          </Button>
          <Button variant="outline" className="h-20 flex-col">
            <UserPlus className="w-6 h-6 mb-2" />
            Account
          </Button>
          <Button variant="outline" className="h-20 flex-col">
            <Shield className="w-6 h-6 mb-2" />
            Support
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}