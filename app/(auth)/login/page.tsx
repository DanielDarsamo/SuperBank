'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Smartphone, ArrowRight, Globe } from 'lucide-react';
import { loginSchema, otpVerifySchema, pinVerifySchema } from '@/lib/validation/schemas';
import { useAppStore } from '@/store/app-store';
import { useTranslation } from '@/lib/translations';
import Link from 'next/link';

type LoginStep = 'phone' | 'otp' | 'pin';

export default function LoginPage() {
  const router = useRouter();
  const { setUser, language, setLanguage } = useAppStore();
  const { t } = useTranslation(language);
  const [step, setStep] = useState<LoginStep>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');

  const phoneForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { phone: '' }
  });

  const otpForm = useForm({
    resolver: zodResolver(otpVerifySchema),
    defaultValues: { otp: '' }
  });

  const pinForm = useForm({
    resolver: zodResolver(pinVerifySchema),
    defaultValues: { pin: '' }
  });

  const handlePhoneSubmit = async (data: { phone: string }) => {
    try {
      // Simulate OTP sending
      setPhoneNumber(data.phone);
      toast.success(t('otpCode') + ' sent to ' + data.phone);
      setStep('otp');
    } catch (error) {
      toast.error('Failed to send verification code');
    }
  };

  const handleOtpSubmit = async (data: { otp: string }) => {
    try {
      // Simulate OTP verification
      if (data.otp === '123456') {
        toast.success('Phone number verified');
        setStep('pin');
      } else {
        toast.error('Invalid verification code');
      }
    } catch (error) {
      toast.error('Failed to verify code');
    }
  };

  const handlePinSubmit = async (data: { pin: string }) => {
    try {
      // Simulate PIN verification and login
      if (data.pin === '1234') {
        const mockUser = {
          id: '1',
          phone: phoneNumber,
          role: 'client' as const,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        setUser(mockUser);
        toast.success('Login successful');
        router.push('/');
      } else {
        toast.error('Invalid PIN');
      }
    } catch (error) {
      toast.error('Login failed');
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'pt' : 'en');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-fnb-teal rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">FNB</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">FNB</h1>
          <p className="text-gray-600">Digital Banking for Africa</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl">{t('login')}</CardTitle>
                <CardDescription>
                  {step === 'phone' && 'Enter your phone number to get started'}
                  {step === 'otp' && 'Enter the verification code sent to your phone'}
                  {step === 'pin' && 'Enter your 4-digit PIN to access your account'}
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={toggleLanguage}>
                <Globe className="w-4 h-4 mr-1" />
                {language.toUpperCase()}
              </Button>
            </div>

            {/* Progress indicator */}
            <div className="flex space-x-2">
              <div className={`h-2 rounded-full flex-1 ${step === 'phone' ? 'bg-fnb-teal' : 'bg-gray-200'}`} />
              <div className={`h-2 rounded-full flex-1 ${step === 'otp' ? 'bg-fnb-teal' : 'bg-gray-200'}`} />
              <div className={`h-2 rounded-full flex-1 ${step === 'pin' ? 'bg-fnb-teal' : 'bg-gray-200'}`} />
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {step === 'phone' && (
              <form onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('phoneNumber')}</Label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      id="phone"
                      placeholder="+258 84 123 4567"
                      className="pl-10"
                      {...phoneForm.register('phone')}
                    />
                  </div>
                  {phoneForm.formState.errors.phone && (
                    <p className="text-sm text-red-600">{phoneForm.formState.errors.phone.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full bg-fnb-teal hover:bg-fnb-teal/90" size="lg">
                  {t('sendOtp')}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </form>
            )}

            {step === 'otp' && (
              <form onSubmit={otpForm.handleSubmit(handleOtpSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">{t('otpCode')}</Label>
                  <Input
                    id="otp"
                    placeholder="123456"
                    maxLength={6}
                    className="text-center text-2xl tracking-widest"
                    {...otpForm.register('otp')}
                  />
                  {otpForm.formState.errors.otp && (
                    <p className="text-sm text-red-600">{otpForm.formState.errors.otp.message}</p>
                  )}
                  <p className="text-sm text-gray-600 text-center">
                    Code sent to {phoneNumber}
                  </p>
                </div>
                
                <div className="flex space-x-3">
                  <Button type="button" variant="outline" onClick={() => setStep('phone')} className="flex-1">
                    {t('back')}
                  </Button>
                  <Button type="submit" className="flex-1 bg-fnb-teal hover:bg-fnb-teal/90">
                    {t('verifyOtp')}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </form>
            )}

            {step === 'pin' && (
              <form onSubmit={pinForm.handleSubmit(handlePinSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pin">{t('enterPin')}</Label>
                  <Input
                    id="pin"
                    type="password"
                    placeholder="••••"
                    maxLength={4}
                    className="text-center text-2xl tracking-widest"
                    {...pinForm.register('pin')}
                  />
                  {pinForm.formState.errors.pin && (
                    <p className="text-sm text-red-600">{pinForm.formState.errors.pin.message}</p>
                  )}
                </div>
                
                <div className="flex space-x-3">
                  <Button type="button" variant="outline" onClick={() => setStep('otp')} className="flex-1">
                    {t('back')}
                  </Button>
                  <Button type="submit" className="flex-1 bg-fnb-teal hover:bg-fnb-teal/90">
                    {t('login')}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </form>
            )}

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/register" className="text-fnb-teal hover:underline">
                  {t('register')}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo credentials */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 font-medium mb-2">Demo Credentials:</p>
          <p className="text-xs text-yellow-700">Phone: +258841234567</p>
          <p className="text-xs text-yellow-700">OTP: 123456</p>
          <p className="text-xs text-yellow-700">PIN: 1234</p>
        </div>
      </div>
    </div>
  );
}