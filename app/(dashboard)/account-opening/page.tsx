'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PageLayout } from '@/components/layout/page-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { 
  User, 
  Upload, 
  FileText, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Camera,
  DollarSign
} from 'lucide-react';
import { accountApplicationSchema } from '@/lib/validation/schemas';
import { useAppStore } from '@/store/app-store';
import { useTranslation } from '@/lib/translations';

type AccountStep = 'personal' | 'documents' | 'review' | 'submitted';

interface FormData {
  fullName: string;
  idNumber: string;
  nuit: string;
  idDocument?: File;
  incomeDocument?: File;
}

export default function AccountOpeningPage() {
  const router = useRouter();
  const { user, language } = useAppStore();
  const { t } = useTranslation(language);
  const [step, setStep] = useState<AccountStep>('personal');
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [idPreview, setIdPreview] = useState<string | null>(null);
  const [incomePreview, setIncomePreview] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(accountApplicationSchema),
    defaultValues: {
      fullName: '',
      idNumber: '',
      nuit: '',
    }
  });

  const steps = [
    { id: 'personal', title: t('personalInfo'), icon: User },
    { id: 'documents', title: 'Documents', icon: FileText },
    { id: 'review', title: 'Review', icon: CheckCircle },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === step);
  const progress = step === 'submitted' ? 100 : ((currentStepIndex + 1) / steps.length) * 100;

  const handlePersonalSubmit = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
    setStep('documents');
  };

  const handleFileUpload = (file: File, type: 'id' | 'income') => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (type === 'id') {
        setIdPreview(result);
        setFormData(prev => ({ ...prev, idDocument: file }));
      } else {
        setIncomePreview(result);
        setFormData(prev => ({ ...prev, incomeDocument: file }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDocumentsNext = () => {
    if (!formData.idDocument) {
      toast.error('Please upload your ID document');
      return;
    }
    setStep('review');
  };

  const handleSubmit = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Application submitted successfully!');
      setStep('submitted');
    } catch (error) {
      toast.error('Failed to submit application');
    }
  };

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <PageLayout 
      title={t('accountOpening')} 
      description="Complete your account opening application"
    >
      <div className="max-w-2xl mx-auto">
        {/* Progress Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-xl">Application Progress</CardTitle>
              <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="mb-4" />
            
            <div className="flex justify-between">
              {steps.map((stepItem, index) => {
                const Icon = stepItem.icon;
                const isActive = stepItem.id === step;
                const isCompleted = index < currentStepIndex;
                
                return (
                  <div key={stepItem.id} className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      isCompleted ? 'bg-green-600 text-white' :
                      isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-xs text-center ${
                      isActive ? 'text-blue-600 font-medium' : 'text-gray-500'
                    }`}>
                      {stepItem.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardHeader>
        </Card>

        {/* Step Content */}
        {step === 'personal' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                {t('personalInfo')}
              </CardTitle>
              <CardDescription>
                Please provide your personal information as it appears on your ID document
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(handlePersonalSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">{t('fullName')}</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    {...form.register('fullName')}
                  />
                  {form.formState.errors.fullName && (
                    <p className="text-sm text-red-600">{form.formState.errors.fullName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="idNumber">{t('idNumber')}</Label>
                  <Input
                    id="idNumber"
                    placeholder="Enter your ID number"
                    {...form.register('idNumber')}
                  />
                  {form.formState.errors.idNumber && (
                    <p className="text-sm text-red-600">{form.formState.errors.idNumber.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nuit">{t('nuit')}</Label>
                  <Input
                    id="nuit"
                    placeholder="Enter your NUIT"
                    maxLength={9}
                    {...form.register('nuit')}
                  />
                  {form.formState.errors.nuit && (
                    <p className="text-sm text-red-600">{form.formState.errors.nuit.message}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" size="lg">
                  {t('next')}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 'documents' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Document Upload
              </CardTitle>
              <CardDescription>
                Upload clear photos of your documents. Files must be less than 5MB.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* ID Document Upload */}
              <div className="space-y-4">
                <Label className="text-base font-medium">{t('uploadId')} *</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  {idPreview ? (
                    <div className="space-y-4">
                      <img src={idPreview} alt="ID Preview" className="max-h-32 mx-auto rounded" />
                      <p className="text-sm text-green-600 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        ID document uploaded
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIdPreview(null);
                          setFormData(prev => ({ ...prev, idDocument: undefined }));
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Camera className="w-12 h-12 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Upload your ID document</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, 'id');
                          }}
                          className="hidden"
                          id="id-upload"
                        />
                        <Button asChild variant="outline">
                          <label htmlFor="id-upload" className="cursor-pointer">
                            <Upload className="w-4 h-4 mr-2" />
                            Choose File
                          </label>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Income Document Upload */}
              <div className="space-y-4">
                <Label className="text-base font-medium">{t('uploadIncome')} (Optional)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  {incomePreview ? (
                    <div className="space-y-4">
                      <img src={incomePreview} alt="Income Preview" className="max-h-32 mx-auto rounded" />
                      <p className="text-sm text-green-600 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Income document uploaded
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIncomePreview(null);
                          setFormData(prev => ({ ...prev, incomeDocument: undefined }));
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <DollarSign className="w-12 h-12 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Upload income proof (salary slip, etc.)</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, 'income');
                          }}
                          className="hidden"
                          id="income-upload"
                        />
                        <Button asChild variant="outline">
                          <label htmlFor="income-upload" className="cursor-pointer">
                            <Upload className="w-4 h-4 mr-2" />
                            Choose File
                          </label>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-4">
                <Button variant="outline" onClick={() => setStep('personal')} className="flex-1">
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  {t('back')}
                </Button>
                <Button onClick={handleDocumentsNext} className="flex-1">
                  {t('next')}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 'review' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Review Application
              </CardTitle>
              <CardDescription>
                Please review your information before submitting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-500">Full Name</Label>
                    <p className="font-medium">{formData.fullName}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">ID Number</Label>
                    <p className="font-medium">{formData.idNumber}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">NUIT</Label>
                    <p className="font-medium">{formData.nuit}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Phone</Label>
                    <p className="font-medium">{user.phone}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-gray-500">Documents</Label>
                  <div className="flex space-x-4">
                    {idPreview && (
                      <div className="text-center">
                        <img src={idPreview} alt="ID" className="w-20 h-20 object-cover rounded border" />
                        <p className="text-xs text-gray-600 mt-1">ID Document</p>
                      </div>
                    )}
                    {incomePreview && (
                      <div className="text-center">
                        <img src={incomePreview} alt="Income" className="w-20 h-20 object-cover rounded border" />
                        <p className="text-xs text-gray-600 mt-1">Income Proof</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  By submitting this application, you confirm that all information provided is accurate 
                  and you agree to MozBank's terms and conditions.
                </p>
              </div>

              <div className="flex space-x-4">
                <Button variant="outline" onClick={() => setStep('documents')} className="flex-1">
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  {t('back')}
                </Button>
                <Button onClick={handleSubmit} className="flex-1">
                  {t('submit')} Application
                  <CheckCircle className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 'submitted' && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('applicationSubmitted')}
              </h2>
              <p className="text-gray-600 mb-6">
                Your account opening application has been submitted successfully. 
                You will receive an SMS notification once your application is reviewed.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-600">
                  <strong>Application ID:</strong> APP-{Date.now().toString().slice(-6)}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Status:</strong> {t('applicationPending')}
                </p>
              </div>
              <Button onClick={() => router.push('/')} className="w-full">
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  );
}