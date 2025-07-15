'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle,
  Mail,
  Phone,
  Loader2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useTranslation } from '@/lib/translations';
import { useAppStore } from '@/store/app-store';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  keywords: string[];
  helpful: number;
  notHelpful: number;
}

interface FAQModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockFAQData: FAQItem[] = [
  {
    id: '1',
    question: 'How do I open a new account?',
    answer: 'To open a new account, click on "Account Opening" from the main menu. You\'ll need to provide personal information, upload your ID document, and complete the verification process. The entire process takes about 10-15 minutes.',
    category: 'Account Management',
    keywords: ['account', 'open', 'new', 'create'],
    helpful: 45,
    notHelpful: 3
  },
  {
    id: '2',
    question: 'How does the queue management system work?',
    answer: 'Our virtual queue system allows you to join a queue remotely. Select your branch and service type, receive a queue number, and track your position in real-time. You\'ll get SMS notifications when it\'s your turn.',
    category: 'Queue Management',
    keywords: ['queue', 'wait', 'branch', 'appointment'],
    helpful: 38,
    notHelpful: 2
  },
  {
    id: '3',
    question: 'What banking services are available through the app?',
    answer: 'You can check your balance, transfer money, pay bills, view transaction history, and access various banking services through our USSD-style interface. All services are available 24/7.',
    category: 'Banking Services',
    keywords: ['services', 'balance', 'transfer', 'bills', 'ussd'],
    helpful: 52,
    notHelpful: 1
  },
  {
    id: '4',
    question: 'Is my personal information secure?',
    answer: 'Yes, we use bank-grade security including end-to-end encryption, multi-factor authentication, and secure PIN protection. Your data is protected according to international banking security standards.',
    category: 'Security',
    keywords: ['security', 'safe', 'encryption', 'protection'],
    helpful: 67,
    notHelpful: 0
  },
  {
    id: '5',
    question: 'What documents do I need for account opening?',
    answer: 'You need a valid government-issued ID (passport, national ID, or driver\'s license), proof of address, and optionally, proof of income. All documents can be uploaded as photos through the app.',
    category: 'Account Management',
    keywords: ['documents', 'id', 'passport', 'requirements'],
    helpful: 41,
    notHelpful: 4
  },
  {
    id: '6',
    question: 'How long does account approval take?',
    answer: 'Account approval typically takes 1-3 business days. You\'ll receive SMS notifications about your application status. In some cases, additional verification may be required.',
    category: 'Account Management',
    keywords: ['approval', 'time', 'processing', 'verification'],
    helpful: 33,
    notHelpful: 2
  }
];

export function FAQModal({ isOpen, onClose }: FAQModalProps) {
  const { language } = useAppStore();
  const { t } = useTranslation(language);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState<string | null>(null);

  const categories = ['All', 'Account Management', 'Queue Management', 'Banking Services', 'Security'];

  const filteredFAQs = mockFAQData.filter(faq => {
    const matchesSearch = searchTerm === '' || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const handleFeedback = async (faqId: string, isHelpful: boolean) => {
    setFeedbackLoading(faqId);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(
        isHelpful ? 'Thank you for your feedback!' : 'We\'ll work to improve this answer.',
        {
          icon: isHelpful ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />
        }
      );
    } catch (error) {
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setFeedbackLoading(null);
    }
  };

  const handleContactSupport = (method: 'chat' | 'email' | 'phone') => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      switch (method) {
        case 'chat':
          toast.success('Connecting you to live chat...');
          break;
        case 'email':
          toast.success('Opening email client...');
          break;
        case 'phone':
          toast.success('Initiating phone call...');
          break;
      }
    }, 1500);
  };

  // Reset search when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setSelectedCategory('All');
      setExpandedItems(new Set());
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-fnb-teal">
            {t('faq')} & Support
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col space-y-6">
          {/* Search and Filter */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder={t('searchFaq')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                aria-label="Search FAQ"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? 'bg-fnb-teal hover:bg-fnb-teal/90' : ''}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* FAQ List */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No FAQs found matching your search.</p>
                <p className="text-sm">Try different keywords or browse categories.</p>
              </div>
            ) : (
              filteredFAQs.map((faq) => (
                <div key={faq.id} className="border rounded-lg overflow-hidden">
                  <Collapsible
                    open={expandedItems.has(faq.id)}
                    onOpenChange={() => toggleExpanded(faq.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-between p-4 h-auto text-left hover:bg-gray-50"
                      >
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">{faq.question}</h3>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="text-xs">
                              {faq.category}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {faq.helpful} helpful • {faq.notHelpful} not helpful
                            </span>
                          </div>
                        </div>
                        {expandedItems.has(faq.id) ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="px-4 pb-4 border-t bg-gray-50">
                        <p className="text-gray-700 mb-4 leading-relaxed">{faq.answer}</p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Was this helpful?</span>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleFeedback(faq.id, true)}
                              disabled={feedbackLoading === faq.id}
                              className="text-green-600 border-green-200 hover:bg-green-50"
                            >
                              {feedbackLoading === faq.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <ThumbsUp className="w-4 h-4" />
                              )}
                              <span className="ml-1">Yes</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleFeedback(faq.id, false)}
                              disabled={feedbackLoading === faq.id}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              {feedbackLoading === faq.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <ThumbsDown className="w-4 h-4" />
                              )}
                              <span className="ml-1">No</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              ))
            )}
          </div>

          {/* Contact Support Section */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Still need help? {t('contactSupport')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-16 flex-col space-y-2"
                onClick={() => handleContactSupport('chat')}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <MessageCircle className="w-5 h-5 text-fnb-teal" />
                )}
                <span className="text-sm">Live Chat</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-16 flex-col space-y-2"
                onClick={() => handleContactSupport('email')}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Mail className="w-5 h-5 text-fnb-teal" />
                )}
                <span className="text-sm">Email Support</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-16 flex-col space-y-2"
                onClick={() => handleContactSupport('phone')}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Phone className="w-5 h-5 text-fnb-teal" />
                )}
                <span className="text-sm">Call Us</span>
              </Button>
            </div>
            
            <div className="mt-4 text-center text-sm text-gray-600">
              <p>Available 24/7 • Average response time: 2 minutes</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}