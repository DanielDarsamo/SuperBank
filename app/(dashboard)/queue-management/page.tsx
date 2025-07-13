'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PageLayout } from '@/components/layout/page-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle, 
  AlertCircle,
  Phone,
  CreditCard,
  FileText,
  DollarSign,
  RefreshCw
} from 'lucide-react';
import { queueJoinSchema } from '@/lib/validation/schemas';
import { useAppStore } from '@/store/app-store';
import { useTranslation } from '@/lib/translations';
import { Branch, QueueEntry } from '@/types';

const mockBranches: Branch[] = [
  {
    id: '1',
    name: 'Maputo Central',
    address: 'Av. Julius Nyerere, 123',
    phone: '+258 21 123 456',
    current_queue_count: 12,
    average_service_time: 15,
    status: 'open'
  },
  {
    id: '2',
    name: 'Matola Shopping',
    address: 'Matola Shopping Center',
    phone: '+258 21 789 012',
    current_queue_count: 8,
    average_service_time: 12,
    status: 'open'
  },
  {
    id: '3',
    name: 'Beira Centro',
    address: 'Rua do Aeroporto, 456',
    phone: '+258 23 345 678',
    current_queue_count: 15,
    average_service_time: 18,
    status: 'open'
  }
];

const serviceTypes = [
  { id: 'account_opening', name: 'Account Opening', icon: FileText, estimatedTime: 20 },
  { id: 'cash_deposit', name: 'Cash Deposit', icon: DollarSign, estimatedTime: 5 },
  { id: 'cash_withdrawal', name: 'Cash Withdrawal', icon: CreditCard, estimatedTime: 5 },
  { id: 'loan_application', name: 'Loan Application', icon: FileText, estimatedTime: 30 },
  { id: 'customer_service', name: 'Customer Service', icon: Phone, estimatedTime: 15 },
];

export default function QueueManagementPage() {
  const router = useRouter();
  const { user, currentQueue, setCurrentQueue, language } = useAppStore();
  const { t } = useTranslation(language);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [queuePosition, setQueuePosition] = useState(0);

  const form = useForm({
    resolver: zodResolver(queueJoinSchema),
    defaultValues: {
      branchId: '',
      serviceType: ''
    }
  });

  // Simulate real-time queue updates
  useEffect(() => {
    if (currentQueue) {
      const interval = setInterval(() => {
        setQueuePosition(prev => {
          if (prev > 1) {
            return prev - 1;
          } else if (prev === 1) {
            // Simulate being called
            setCurrentQueue({
              ...currentQueue,
              status: 'called'
            });
            toast.success('You are being called! Please proceed to the counter.');
            return 0;
          }
          return prev;
        });
      }, 10000); // Update every 10 seconds for demo

      return () => clearInterval(interval);
    }
  }, [currentQueue, setCurrentQueue]);

  const handleJoinQueue = async (data: { branchId: string; serviceType: string }) => {
    if (!user) {
      router.push('/login');
      return;
    }

    setIsJoining(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const branch = mockBranches.find(b => b.id === data.branchId);
      const service = serviceTypes.find(s => s.id === data.serviceType);
      
      if (!branch || !service) {
        throw new Error('Invalid selection');
      }

      const queueNumber = Math.floor(Math.random() * 50) + 1;
      const position = Math.floor(Math.random() * 10) + 1;
      
      const newQueueEntry: QueueEntry = {
        id: Date.now().toString(),
        user_id: user.id,
        branch_id: data.branchId,
        queue_number: queueNumber,
        status: 'waiting',
        service_type: data.serviceType,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        estimated_wait_time: position * service.estimatedTime
      };

      setCurrentQueue(newQueueEntry);
      setQueuePosition(position);
      
      toast.success(`Joined queue successfully! Your number is ${queueNumber}`);
      
      // Simulate SMS notification
      setTimeout(() => {
        toast.info(`SMS: You are #${queueNumber} in queue at ${branch.name}. Estimated wait: ${position * service.estimatedTime} minutes.`);
      }, 1000);
      
    } catch (error) {
      toast.error('Failed to join queue');
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeaveQueue = () => {
    if (currentQueue) {
      setCurrentQueue(null);
      setQueuePosition(0);
      toast.success('Left queue successfully');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      case 'called': return 'bg-green-100 text-green-800';
      case 'being_served': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'waiting': return Clock;
      case 'called': return AlertCircle;
      case 'being_served': return Users;
      case 'completed': return CheckCircle;
      default: return Clock;
    }
  };

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <PageLayout 
      title={t('queueManagement')} 
      description="Join virtual queues and track your position in real-time"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Current Queue Status */}
        {currentQueue && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-900">
                <Clock className="w-5 h-5 mr-2" />
                Current Queue Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-900">#{currentQueue.queue_number}</p>
                  <p className="text-sm text-blue-700">Queue Number</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-900">{queuePosition}</p>
                  <p className="text-sm text-blue-700">Position</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-900">{queuePosition * 15}m</p>
                  <p className="text-sm text-blue-700">Est. Wait</p>
                </div>
                <div className="text-center">
                  <Badge className={getStatusColor(currentQueue.status)}>
                    {currentQueue.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </div>

              {queuePosition > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Queue Progress</span>
                    <span>{Math.max(0, 10 - queuePosition)}/10 served</span>
                  </div>
                  <Progress value={Math.max(0, (10 - queuePosition) / 10 * 100)} />
                </div>
              )}

              <div className="flex space-x-4">
                <Button 
                  variant="outline" 
                  onClick={() => setQueuePosition(prev => Math.max(0, prev - 1))}
                  disabled={queuePosition === 0}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Status
                </Button>
                <Button variant="destructive" onClick={handleLeaveQueue}>
                  Leave Queue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Join Queue Form */}
        {!currentQueue && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                {t('joinQueue')}
              </CardTitle>
              <CardDescription>
                Select a branch and service to join the virtual queue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(handleJoinQueue)} className="space-y-6">
                <div className="space-y-2">
                  <Label>{t('selectBranch')}</Label>
                  <Select 
                    onValueChange={(value) => {
                      form.setValue('branchId', value);
                      setSelectedBranch(mockBranches.find(b => b.id === value) || null);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockBranches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{branch.name}</span>
                            <Badge variant="secondary" className="ml-2">
                              {branch.current_queue_count} in queue
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.branchId && (
                    <p className="text-sm text-red-600">{form.formState.errors.branchId.message}</p>
                  )}
                </div>

                {selectedBranch && (
                  <Card className="bg-gray-50">
                    <CardContent className="pt-4">
                      <div className="flex items-start space-x-3">
                        <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                        <div>
                          <p className="font-medium">{selectedBranch.name}</p>
                          <p className="text-sm text-gray-600">{selectedBranch.address}</p>
                          <p className="text-sm text-gray-600">{selectedBranch.phone}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-sm">
                              <strong>{selectedBranch.current_queue_count}</strong> people in queue
                            </span>
                            <span className="text-sm">
                              Avg. service time: <strong>{selectedBranch.average_service_time}min</strong>
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-2">
                  <Label>{t('selectService')}</Label>
                  <Select onValueChange={(value) => form.setValue('serviceType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceTypes.map((service) => {
                        const Icon = service.icon;
                        return (
                          <SelectItem key={service.id} value={service.id}>
                            <div className="flex items-center">
                              <Icon className="w-4 h-4 mr-2" />
                              <span>{service.name}</span>
                              <span className="ml-auto text-xs text-gray-500">
                                ~{service.estimatedTime}min
                              </span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.serviceType && (
                    <p className="text-sm text-red-600">{form.formState.errors.serviceType.message}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isJoining}>
                  {isJoining ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Joining Queue...
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4 mr-2" />
                      {t('joinQueue')}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Branch Information */}
        <div className="grid md:grid-cols-3 gap-6">
          {mockBranches.map((branch) => (
            <Card key={branch.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{branch.name}</CardTitle>
                <CardDescription className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {branch.address}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Current Queue</span>
                    <Badge variant="secondary">
                      {branch.current_queue_count} people
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avg. Service Time</span>
                    <span className="text-sm font-medium">{branch.average_service_time} min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status</span>
                    <Badge className={branch.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {branch.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="pt-2">
                    <p className="text-xs text-gray-500">
                      Est. wait time: {Math.ceil(branch.current_queue_count * branch.average_service_time / 3)} minutes
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Queue Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Queue Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium">Before Joining:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Have your ID and documents ready</li>
                  <li>• Check branch operating hours</li>
                  <li>• Consider off-peak hours for shorter waits</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">While Waiting:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• You'll receive SMS updates on your position</li>
                  <li>• Arrive 5 minutes before being called</li>
                  <li>• You can leave and rejoin if needed</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}