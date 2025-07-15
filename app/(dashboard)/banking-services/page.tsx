'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PageLayout } from '@/components/layout/page-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  CreditCard, 
  Send, 
  Receipt, 
  Eye, 
  ArrowLeft, 
  ArrowRight,
  DollarSign,
  Phone,
  Zap,
  Wifi,
  Car,
  Home,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { BackButton } from '@/components/ui/back-button';
import { transferSchema } from '@/lib/validation/schemas';
import { useAppStore } from '@/store/app-store';
import { useTranslation } from '@/lib/translations';

type ServiceType = 'main' | 'balance' | 'transfer' | 'bills' | 'history';

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'credit',
    amount: 15000,
    description: 'Salary Payment',
    date: '2024-01-15T10:30:00Z',
    status: 'completed'
  },
  {
    id: '2',
    type: 'debit',
    amount: 2500,
    description: 'Transfer to Maria Silva',
    date: '2024-01-14T15:45:00Z',
    status: 'completed'
  },
  {
    id: '3',
    type: 'debit',
    amount: 850,
    description: 'EDM Electricity Bill',
    date: '2024-01-13T09:20:00Z',
    status: 'completed'
  },
  {
    id: '4',
    type: 'debit',
    amount: 1200,
    description: 'Vodacom Airtime',
    date: '2024-01-12T14:10:00Z',
    status: 'completed'
  }
];

const billTypes = [
  { id: 'electricity', name: 'EDM - Electricity', icon: Zap, color: 'bg-yellow-100 text-yellow-600' },
  { id: 'water', name: 'FIPAG - Water', icon: Home, color: 'bg-blue-100 text-blue-600' },
  { id: 'mobile', name: 'Mobile Airtime', icon: Phone, color: 'bg-green-100 text-green-600' },
  { id: 'internet', name: 'Internet/TV', icon: Wifi, color: 'bg-purple-100 text-purple-600' },
  { id: 'insurance', name: 'Car Insurance', icon: Car, color: 'bg-red-100 text-red-600' },
];

export default function BankingServicesPage() {
  const router = useRouter();
  const { user, language } = useAppStore();
  const { t } = useTranslation(language);
  const [currentService, setCurrentService] = useState<ServiceType>('main');
  const [accountBalance] = useState(45750.50); // Mock balance
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBill, setSelectedBill] = useState('');
  const isExploreMode = !user;

  const transferForm = useForm({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      amount: 0,
      recipientAccount: '',
      description: ''
    }
  });

  const billForm = useForm({
    defaultValues: {
      billType: '',
      accountNumber: '',
      amount: 0
    }
  });

  useEffect(() => {
    // Allow exploration mode for non-authenticated users
  }, []);

  const handleTransfer = async (data: any) => {
    if (!user) {
      toast.info('Please log in to perform real transactions. This is a demo preview.');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (data.amount > accountBalance) {
        toast.error('Insufficient funds');
        return;
      }

      toast.success(`Transfer of ${data.amount.toLocaleString()} MT successful!`);
      
      // Simulate SMS notification
      setTimeout(() => {
        toast.info(`SMS: Transfer of ${data.amount.toLocaleString()} MT to ${data.recipientAccount} completed. New balance: ${(accountBalance - data.amount).toLocaleString()} MT`);
      }, 1000);
      
      transferForm.reset();
      setCurrentService('main');
    } catch (error) {
      toast.error('Transfer failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBillPayment = async (data: any) => {
    if (!user) {
      toast.info('Please log in to pay real bills. This is a demo preview.');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (data.amount > accountBalance) {
        toast.error('Insufficient funds');
        return;
      }

      const billType = billTypes.find(b => b.id === data.billType);
      toast.success(`${billType?.name} payment of ${data.amount.toLocaleString()} MT successful!`);
      
      setTimeout(() => {
        toast.info(`SMS: Payment to ${billType?.name} completed. Amount: ${data.amount.toLocaleString()} MT. Reference: ${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
      }, 1000);
      
      billForm.reset();
      setCurrentService('main');
    } catch (error) {
      toast.error('Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} MT`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <BackButton />
    <PageLayout 
      title={t('bankingServices')} 
      description="Access your banking services with USSD-style interface"
    >
      <div className="max-w-2xl mx-auto">
        {isExploreMode && (
          <Card className="mb-6 border-fnb-orange bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-6 h-6 text-fnb-orange" />
                <div>
                  <p className="font-medium text-fnb-black">Demo Mode</p>
                  <p className="text-sm text-gray-600">
                    You're exploring banking services. 
                    <Link href="/login" className="text-fnb-teal hover:underline ml-1">
                      Log in
                    </Link> to access real banking features.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* USSD-style Header */}
        <Card className="mb-6 bg-gradient-to-r from-fnb-teal to-fnb-teal/90 text-white">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">FNB Services</h2>
              <p className="text-fnb-white/80">*181# Style Interface</p>
              <div className="mt-4 p-3 bg-white/10 rounded-lg">
                <p className="text-sm">Account: {user?.phone || 'Demo Account'}</p>
                <p className="text-lg font-bold">{formatCurrency(accountBalance)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Menu */}
        {currentService === 'main' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Select Service</CardTitle>
              <CardDescription className="text-center">
                Choose the banking service you need
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <Button 
                  variant="outline" 
                  className="h-16 text-left justify-start"
                  onClick={() => setCurrentService('balance')}
                >
                  <div className="flex items-center w-full">
                    <div className="w-10 h-10 bg-fnb-light-teal rounded-lg flex items-center justify-center mr-4">
                      <Eye className="w-5 h-5 text-fnb-teal" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">1. Check Balance</p>
                      <p className="text-sm text-gray-500">View account balance and mini statement</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </Button>

                <Button 
                  variant="outline" 
                  className="h-16 text-left justify-start"
                  onClick={() => setCurrentService('transfer')}
                >
                  <div className="flex items-center w-full">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <Send className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">2. Transfer Money</p>
                      <p className="text-sm text-gray-500">Send money to another account</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </Button>

                <Button 
                  variant="outline" 
                  className="h-16 text-left justify-start"
                  onClick={() => setCurrentService('bills')}
                >
                  <div className="flex items-center w-full">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                      <Receipt className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">3. Pay Bills</p>
                      <p className="text-sm text-gray-500">Pay utilities and services</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </Button>

                <Button 
                  variant="outline" 
                  className="h-16 text-left justify-start"
                  onClick={() => setCurrentService('history')}
                >
                  <div className="flex items-center w-full">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                      <CreditCard className="w-5 h-5 text-fnb-orange" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">4. Transaction History</p>
                      <p className="text-sm text-gray-500">View recent transactions</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Balance Check */}
        {currentService === 'balance' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Account Balance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center p-6 bg-fnb-light-teal rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Available Balance</p>
                <p className="text-3xl font-bold text-fnb-teal">{formatCurrency(accountBalance)}</p>
                <p className="text-xs text-gray-500 mt-2">As of {new Date().toLocaleString()}</p>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Recent Transactions</h4>
                {mockTransactions.slice(0, 3).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {transaction.type === 'credit' ? (
                          <ArrowRight className="w-4 h-4 text-green-600 rotate-180" />
                        ) : (
                          <ArrowRight className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{transaction.description}</p>
                        <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Button onClick={() => setCurrentService('main')} className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Main Menu
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Money Transfer */}
        {currentService === 'transfer' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Send className="w-5 h-5 mr-2" />
                Transfer Money
              </CardTitle>
              <CardDescription>
                Send money to another MozBank account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={transferForm.handleSubmit(handleTransfer)} className="space-y-6">
                <div className="p-4 bg-fnb-light-teal rounded-lg">
                  <p className="text-sm text-fnb-teal">
                    Available Balance: <strong>{formatCurrency(accountBalance)}</strong>
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recipientAccount">Recipient Account Number</Label>
                  <Input
                    id="recipientAccount"
                    placeholder="Enter account number"
                    {...transferForm.register('recipientAccount')}
                  />
                  {transferForm.formState.errors.recipientAccount && (
                    <p className="text-sm text-red-600">{transferForm.formState.errors.recipientAccount.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (MT)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    {...transferForm.register('amount', { valueAsNumber: true })}
                  />
                  {transferForm.formState.errors.amount && (
                    <p className="text-sm text-red-600">{transferForm.formState.errors.amount.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    id="description"
                    placeholder="Payment description"
                    {...transferForm.register('description')}
                  />
                </div>

                <div className="flex space-x-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setCurrentService('main')}
                    className="flex-1"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading} className="flex-1 bg-fnb-teal hover:bg-fnb-teal/90">
                    {isLoading ? 'Processing...' : 'Send Money'}
                    <Send className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Bill Payment */}
        {currentService === 'bills' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Receipt className="w-5 h-5 mr-2" />
                Pay Bills
              </CardTitle>
              <CardDescription>
                Pay utilities and services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={billForm.handleSubmit(handleBillPayment)} className="space-y-6">
                <div className="p-4 bg-fnb-light-teal rounded-lg">
                  <p className="text-sm text-fnb-teal">
                    Available Balance: <strong>{formatCurrency(accountBalance)}</strong>
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Select Bill Type</Label>
                  <Select onValueChange={(value) => {
                    billForm.setValue('billType', value);
                    setSelectedBill(value);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose bill type" />
                    </SelectTrigger>
                    <SelectContent>
                      {billTypes.map((bill) => {
                        const Icon = bill.icon;
                        return (
                          <SelectItem key={bill.id} value={bill.id}>
                            <div className="flex items-center">
                              <Icon className="w-4 h-4 mr-2" />
                              {bill.name}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {selectedBill && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account/Reference Number</Label>
                      <Input
                        id="accountNumber"
                        placeholder="Enter account or reference number"
                        {...billForm.register('accountNumber')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="billAmount">Amount (MT)</Label>
                      <Input
                        id="billAmount"
                        type="number"
                        placeholder="0.00"
                        {...billForm.register('amount', { valueAsNumber: true })}
                      />
                    </div>
                  </>
                )}

                <div className="flex space-x-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setCurrentService('main')}
                    className="flex-1"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading || !selectedBill} className="flex-1 bg-fnb-teal hover:bg-fnb-teal/90">
                    {isLoading ? 'Processing...' : 'Pay Bill'}
                    <Receipt className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Transaction History */}
        {currentService === 'history' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Transaction History
              </CardTitle>
              <CardDescription>
                Your recent banking transactions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockTransactions.map((transaction) => (
                <div key={transaction.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                        transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {transaction.type === 'credit' ? (
                          <ArrowRight className="w-5 h-5 text-green-600 rotate-180" />
                        ) : (
                          <ArrowRight className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </p>
                      <Badge className={
                        transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                        transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Transaction ID: {transaction.id}
                  </div>
                </div>
              ))}

              <Button onClick={() => setCurrentService('main')} className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Main Menu
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions Footer */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">Quick USSD Codes</p>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-2 bg-gray-50 rounded">
                  <p className="font-medium">*181*1#</p>
                  <p className="text-gray-500">Check Balance</p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p className="font-medium">*181*2#</p>
                  <p className="text-gray-500">Transfer Money</p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p className="font-medium">*181*3#</p>
                  <p className="text-gray-500">Pay Bills</p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p className="font-medium">*181*4#</p>
                  <p className="text-gray-500">Mini Statement</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
    </>
  );
}