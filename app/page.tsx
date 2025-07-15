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
  ArrowRight,
  CheckCircle
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

  const bankingServices = [
    {
      title: 'Personal Banking',
      description: 'Comprehensive banking solutions for individuals',
      features: ['Savings Accounts', 'Current Accounts', 'Fixed Deposits', 'Personal Loans']
    },
    {
      title: 'Business Banking',
      description: 'Tailored solutions for businesses of all sizes',
      features: ['Business Accounts', 'Trade Finance', 'Cash Management', 'Business Loans']
    },
    {
      title: 'Digital Banking',
      description: 'Modern banking at your fingertips',
      features: ['Mobile Banking', 'Online Banking', 'Digital Payments', 'Virtual Cards']
    }
  ];

  const accountTypes = [
    {
      name: 'FNB Gold Account',
      description: 'Premium banking with exclusive benefits',
      benefits: ['No monthly fees', 'Free transfers', 'Priority support', 'Travel insurance']
    },
    {
      name: 'FNB Easy Account',
      description: 'Simple banking for everyday needs',
      benefits: ['Low minimum balance', 'Basic banking services', 'Mobile banking', 'ATM access']
    },
    {
      name: 'FNB Student Account',
      description: 'Banking designed for students',
      benefits: ['No account fees', 'Student discounts', 'Online banking', 'Budgeting tools']
    }
  ];

  if (!user) {
    return (
      <PageLayout>
        <div className="text-center py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {t('welcome')} to FNB
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Modern banking services designed for Africa. Open accounts, manage queues, 
              and access banking services through an intuitive mobile-first platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button asChild size="lg" className="text-lg px-8 bg-fnb-teal hover:bg-fnb-teal/90">
                <Link href="/login">
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 border-fnb-teal text-fnb-teal hover:bg-fnb-light-teal">
                <Link href="/register">
                  Open Account
                  <UserPlus className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>

            {/* Banking Services Section */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-8 text-fnb-black">Banking Services</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {bankingServices.map((service, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow border-fnb-light-teal">
                    <CardHeader>
                      <CardTitle className="text-xl text-fnb-teal">{service.title}</CardTitle>
                      <CardDescription className="text-base">
                        {service.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm">
                            <CheckCircle className="w-4 h-4 text-fnb-teal mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Account Types Section */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-8 text-fnb-black">Account Types</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {accountTypes.map((account, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-xl text-fnb-teal">{account.name}</CardTitle>
                      <CardDescription className="text-base">
                        {account.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {account.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-center text-sm">
                            <CheckCircle className="w-4 h-4 text-fnb-orange mr-2" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Features Grid */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-8 text-fnb-black">Digital Banking Capabilities</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer border-fnb-light-teal">
                      <CardHeader className="text-center">
                        <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mx-auto mb-4`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <CardTitle className="text-xl text-fnb-black">{feature.title}</CardTitle>
                        <CardDescription className="text-base">
                          {feature.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Security Features */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-8 text-fnb-black">Security Features</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-fnb-light-teal p-6 rounded-lg">
                  <Shield className="w-12 h-12 text-fnb-teal mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-fnb-black">Advanced Security</h3>
                  <p className="text-gray-700">Multi-factor authentication, biometric login, and real-time fraud monitoring protect your account 24/7.</p>
                </div>
                <div className="bg-orange-50 p-6 rounded-lg">
                  <Smartphone className="w-12 h-12 text-fnb-orange mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-fnb-black">Secure Mobile Banking</h3>
                  <p className="text-gray-700">End-to-end encryption and secure PIN protection ensure your mobile banking is always safe.</p>
                </div>
              </div>
            </div>

            {/* Customer Benefits */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-fnb-light-teal">
              <h2 className="text-3xl font-bold text-center mb-8 text-fnb-black">Why Choose FNB?</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={index} className="text-center">
                      <div className="w-16 h-16 bg-fnb-light-teal rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-8 h-8 text-fnb-teal" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-fnb-black">{benefit.title}</h3>
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
            <Card key={index} className="hover:shadow-lg transition-shadow border-fnb-light-teal">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-fnb-black">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-fnb-teal hover:bg-fnb-teal/90">
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
      <div className="mt-8 bg-white rounded-lg p-6 shadow-sm border border-fnb-light-teal">
        <h2 className="text-xl font-semibold mb-4 text-fnb-black">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-20 flex-col border-fnb-teal text-fnb-teal hover:bg-fnb-light-teal">
            <CreditCard className="w-6 h-6 mb-2" />
            Balance
          </Button>
          <Button variant="outline" className="h-20 flex-col border-fnb-teal text-fnb-teal hover:bg-fnb-light-teal">
            <Clock className="w-6 h-6 mb-2" />
            Queue
          </Button>
          <Button variant="outline" className="h-20 flex-col border-fnb-teal text-fnb-teal hover:bg-fnb-light-teal">
            <UserPlus className="w-6 h-6 mb-2" />
            Account
          </Button>
          <Button variant="outline" className="h-20 flex-col border-fnb-teal text-fnb-teal hover:bg-fnb-light-teal">
            <Shield className="w-6 h-6 mb-2" />
            Support
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}