'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { 
  Smartphone, 
  ArrowRight, 
  Globe, 
  UserPlus, 
  Eye, 
  EyeOff,
  Shield,
  Upload,
  CheckCircle,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { registrationSchema } from '@/lib/validation/security-schemas';
import { useAppStore } from '@/store/app-store';
import { useTranslation } from '@/lib/translations';
import Link from 'next/link';

type RegisterStep = 'personal' | 'contact' | 'credentials' | 'security' | 'verification' | 'complete';

interface RegistrationData {
  personalInfo?: {
    firstName: string;
    middleName?: string;
    lastName: string;
    dateOfBirth: string;
    governmentId: {
      type: 'passport' | 'drivers_license' | 'national_id';
      number: string;
      expiryDate: string;
    };
  };
  contactInfo?: {
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  credentials?: {
    username: string;
    password: string;
  };
  twoFactorMethod?: 'sms' | 'email' | 'authenticator';
}

export default function RegisterPage() {
  const router = useRouter();
  const { setUser, language, setLanguage } = useAppStore();
  const { t } = useTranslation(language);
  const [step, setStep] = useState<RegisterStep>('personal');
  const [registrationData, setRegistrationData] = useState<RegistrationData>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [verificationCode, setVerificationCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  const steps = [
    { id: 'personal', title: 'Personal Info', icon: UserPlus },
    { id: 'contact', title: 'Contact Info', icon: Smartphone },
    { id: 'credentials', title: 'Credentials', icon: Shield },
    { id: 'security', title: '2FA Setup', icon: Shield },
    { id: 'verification', title: 'Verification', icon: CheckCircle },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === step);
  const progress = step === 'complete' ? 100 : ((currentStepIndex + 1) / steps.length) * 100;

  const personalForm = useForm({
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      dateOfBirth: '',
      idType: 'national_id' as const,
      idNumber: '',
      idExpiry: ''
    }
  });

  const contactForm = useForm({
    defaultValues: {
      email: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Mozambique'
    }
  });

  const credentialsForm = useForm({
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false
    }
  });

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 12) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;
    return strength;
  };

  const handlePersonalSubmit = async (data: any) => {
    try {
      setRegistrationData(prev => ({
        ...prev,
        personalInfo: {
          firstName: data.firstName,
          middleName: data.middleName,
          lastName: data.lastName,
          dateOfBirth: data.dateOfBirth,
          governmentId: {
            type: data.idType,
            number: data.idNumber,
            expiryDate: data.idExpiry
          }
        }
      }));
      setStep('contact');
    } catch (error) {
      toast.error('Please check your information and try again');
    }
  };

  const handleContactSubmit = async (data: any) => {
    try {
      setRegistrationData(prev => ({
        ...prev,
        contactInfo: {
          email: data.email,
          phone: data.phone,
          address: {
            street: data.street,
            city: data.city,
            state: data.state,
            zipCode: data.zipCode,
            country: data.country
          }
        }
      }));
      setStep('credentials');
    } catch (error) {
      toast.error('Please check your contact information');
    }
  };

  const handleCredentialsSubmit = async (data: any) => {
    try {
      if (!data.agreeToTerms) {
        toast.error('You must agree to the terms and conditions');
        return;
      }

      setRegistrationData(prev => ({
        ...prev,
        credentials: {
          username: data.username,
          password: data.password
        }
      }));
      setStep('security');
    } catch (error) {
      toast.error('Please check your credentials');
    }
  };

  const handleSecuritySetup = async (method: 'sms' | 'email' | 'authenticator') => {
    try {
      setRegistrationData(prev => ({
        ...prev,
        twoFactorMethod: method
      }));

      // Generate verification code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setVerificationCode(code);

      if (method === 'sms') {
        toast.success(`Verification code sent to ${registrationData.contactInfo?.phone}`);
      } else if (method === 'email') {
        toast.success(`Verification code sent to ${registrationData.contactInfo?.email}`);
      }

      setStep('verification');
    } catch (error) {
      toast.error('Failed to setup 2FA');
    }
  };

  const handleVerification = async (code: string) => {
    try {
      if (code === verificationCode || code === '123456') {
        // Generate account number
        const newAccountNumber = 'ACC' + Math.random().toString().slice(2, 11);
        setAccountNumber(newAccountNumber);

        // Create user account
        const mockUser = {
          id: crypto.randomUUID(),
          phone: registrationData.contactInfo?.phone || '',
          role: 'client' as const,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        setUser(mockUser);
        
        setStep('complete');
        toast.success('Account created successfully!');
      } else {
        toast.error('Invalid verification code');
      }
    } catch (error) {
      toast.error('Verification failed');
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'pt' : 'en');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-fnb-teal rounded-xl flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Secure Account Registration</h1>
          <p className="text-gray-600">Bank-grade security for your peace of mind</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl">Create Your Account</CardTitle>
                <CardDescription>
                  {step === 'personal' && 'Enter your personal information as shown on your government ID'}
                  {step === 'contact' && 'Provide your contact information and address'}
                  {step === 'credentials' && 'Create secure login credentials'}
                  {step === 'security' && 'Setup two-factor authentication for enhanced security'}
                  {step === 'verification' && 'Verify your identity to complete registration'}
                  {step === 'complete' && 'Your secure banking account has been created'}
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={toggleLanguage}>
                <Globe className="w-4 h-4 mr-1" />
                {language.toUpperCase()}
              </Button>
            </div>

            <Progress value={progress} className="mb-4" />
            
            <div className="flex space-x-2">
              {steps.map((stepItem, index) => {
                const Icon = stepItem.icon;
                const isActive = stepItem.id === step;
                const isCompleted = index < currentStepIndex;
                
                return (
                  <div key={stepItem.id} className="flex flex-col items-center flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                      isCompleted ? 'bg-green-600 text-white' :
                      isActive ? 'bg-fnb-teal text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-xs text-center ${
                      isActive ? 'text-fnb-teal font-medium' : 'text-gray-500'
                    }`}>
                      {stepItem.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {step === 'personal' && (
              <form onSubmit={personalForm.handleSubmit(handlePersonalSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Legal First Name *</Label>
                  <Input
                    id="firstName"
                    placeholder="As shown on government ID"
                    {...personalForm.register('firstName')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="middleName">Middle Name (Optional)</Label>
                  <Input
                    id="middleName"
                    placeholder="Middle name"
                    {...personalForm.register('middleName')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Legal Last Name *</Label>
                  <Input
                    id="lastName"
                    placeholder="As shown on government ID"
                    {...personalForm.register('lastName')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth (MM/DD/YYYY) *</Label>
                  <Input
                    id="dateOfBirth"
                    placeholder="MM/DD/YYYY"
                    {...personalForm.register('dateOfBirth')}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>ID Type *</Label>
                    <Select onValueChange={(value) => personalForm.setValue('idType', value as any)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ID type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="national_id">National ID</SelectItem>
                        <SelectItem value="passport">Passport</SelectItem>
                        <SelectItem value="drivers_license">Driver's License</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="idNumber">ID Number *</Label>
                    <Input
                      id="idNumber"
                      placeholder="ID number"
                      {...personalForm.register('idNumber')}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="idExpiry">ID Expiry Date (YYYY-MM-DD) *</Label>
                  <Input
                    id="idExpiry"
                    type="date"
                    {...personalForm.register('idExpiry')}
                  />
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Continue to Contact Information
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </form>
            )}

            {step === 'contact' && (
              <form onSubmit={contactForm.handleSubmit(handleContactSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      {...contactForm.register('email')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      placeholder="+258 84 123 4567"
                      {...contactForm.register('phone')}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="street">Street Address *</Label>
                  <Input
                    id="street"
                    placeholder="123 Main Street"
                    {...contactForm.register('street')}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      placeholder="Maputo"
                      {...contactForm.register('city')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province *</Label>
                    <Input
                      id="state"
                      placeholder="Maputo Province"
                      {...contactForm.register('state')}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      placeholder="12345"
                      {...contactForm.register('zipCode')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      value="Mozambique"
                      readOnly
                      {...contactForm.register('country')}
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button type="button" variant="outline" onClick={() => setStep('personal')} className="flex-1">
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Back
                  </Button>
                  <Button type="submit" className="flex-1 bg-fnb-teal hover:bg-fnb-teal/90">
                    Continue to Credentials
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </form>
            )}

            {step === 'credentials' && (
              <form onSubmit={credentialsForm.handleSubmit(handleCredentialsSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    placeholder="Minimum 8 characters, alphanumeric"
                    {...credentialsForm.register('username')}
                  />
                  <p className="text-xs text-gray-500">
                    Must be 8-30 characters, letters, numbers, and underscores only
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Minimum 12 characters"
                      {...credentialsForm.register('password', {
                        onChange: (e) => setPasswordStrength(calculatePasswordStrength(e.target.value))
                      })}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  
                  {passwordStrength > 0 && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Password Strength</span>
                        <span className={
                          passwordStrength < 40 ? 'text-red-600' :
                          passwordStrength < 80 ? 'text-yellow-600' : 'text-green-600'
                        }>
                          {passwordStrength < 40 ? 'Weak' : passwordStrength < 80 ? 'Medium' : 'Strong'}
                        </span>
                      </div>
                      <Progress value={passwordStrength} className="h-2" />
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>Password must contain:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>At least 12 characters</li>
                      <li>Uppercase and lowercase letters</li>
                      <li>Numbers and special characters</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Re-enter your password"
                      {...credentialsForm.register('confirmPassword')}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agreeToTerms"
                    {...credentialsForm.register('agreeToTerms')}
                  />
                  <Label htmlFor="agreeToTerms" className="text-sm">
                    I agree to the <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> and{' '}
                    <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link> *
                  </Label>
                </div>

                <div className="flex space-x-3">
                  <Button type="button" variant="outline" onClick={() => setStep('contact')} className="flex-1">
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Back
                  </Button>
                  <Button type="submit" className="flex-1 bg-fnb-teal hover:bg-fnb-teal/90">
                    Continue to Security Setup
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </form>
            )}

            {step === 'security' && (
              <div className="space-y-6">
                <div className="text-center">
                  <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Setup Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-600">
                    Choose your preferred method for additional account security
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full h-16 justify-start"
                    onClick={() => handleSecuritySetup('sms')}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                        <Smartphone className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">SMS Verification</p>
                        <p className="text-sm text-gray-500">Receive codes via text message</p>
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full h-16 justify-start"
                    onClick={() => handleSecuritySetup('email')}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <Shield className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">Email Verification</p>
                        <p className="text-sm text-gray-500">Receive codes via email</p>
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full h-16 justify-start"
                    onClick={() => handleSecuritySetup('authenticator')}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                        <Shield className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">Authenticator App</p>
                        <p className="text-sm text-gray-500">Use Google Authenticator or similar</p>
                      </div>
                    </div>
                  </Button>
                </div>

                <Button variant="outline" onClick={() => setStep('credentials')} className="w-full">
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Back to Credentials
                </Button>
              </div>
            )}

            {step === 'verification' && (
              <div className="space-y-6">
                <div className="text-center">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Verify Your Identity</h3>
                  <p className="text-sm text-gray-600">
                    Enter the verification code sent to your {registrationData.twoFactorMethod}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="verificationCode">Verification Code</Label>
                    <Input
                      id="verificationCode"
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      className="text-center text-2xl tracking-widest"
                      onChange={(e) => {
                        if (e.target.value.length === 6) {
                          handleVerification(e.target.value);
                        }
                      }}
                    />
                  </div>

                  <div className="text-center">
                    <Button variant="link" size="sm">
                      Didn't receive the code? Resend
                    </Button>
                  </div>
                </div>

                <Button variant="outline" onClick={() => setStep('security')} className="w-full">
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Back to Security Setup
                </Button>
              </div>
            )}

            {step === 'complete' && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Account Created Successfully!
                  </h2>
                  <p className="text-gray-600">
                    Welcome to FNB. Your secure banking account is ready to use.
                  </p>
                </div>

                <div className="bg-fnb-light-teal p-4 rounded-lg">
                  <p className="text-sm text-fnb-teal font-medium mb-2">Your Account Details:</p>
                  <p className="text-sm text-fnb-black">Account Number: <strong>{accountNumber}</strong></p>
                  <p className="text-sm text-fnb-black">Username: <strong>{registrationData.credentials?.username}</strong></p>
                </div>

                <div className="space-y-3">
                  <Button onClick={() => router.push('/')} className="w-full bg-fnb-teal hover:bg-fnb-teal/90" size="lg">
                    Access Your Account
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                  
                  <Button variant="outline" onClick={() => router.push('/account-opening')} className="w-full">
                    Complete Account Setup
                  </Button>
                </div>
              </div>
            )}

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-fnb-teal hover:underline">
                  {t('login')}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {step !== 'complete' && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 font-medium mb-2">Demo Credentials:</p>
            <p className="text-xs text-yellow-700">Use any valid information for demo</p>
            <p className="text-xs text-yellow-700">Verification code: 123456</p>
          </div>
        )}
      </div>
    </div>
  );
}