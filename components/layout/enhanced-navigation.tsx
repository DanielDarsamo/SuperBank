'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { LanguageSelector } from '@/components/ui/language-selector';
import { FAQModal } from '@/components/ui/faq-modal';
import { 
  Menu, 
  Home, 
  UserPlus, 
  Clock, 
  CreditCard, 
  HelpCircle, 
  Settings,
  LogOut,
  X
} from 'lucide-react';
import { useAppStore } from '@/store/app-store';
import { useTranslation } from '@/lib/translations';
import { cn } from '@/lib/utils';

export function EnhancedNavigation() {
  const pathname = usePathname();
  const { user, language, logout } = useAppStore();
  const { t } = useTranslation(language);
  const [isOpen, setIsOpen] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);

  const navigation = [
    { name: t('welcome'), href: '/', icon: Home },
    { name: t('accountOpening'), href: '/account-opening', icon: UserPlus },
    { name: t('queueManagement'), href: '/queue-management', icon: Clock },
    { name: t('bankingServices'), href: '/banking-services', icon: CreditCard },
  ];

  const adminNavigation = [
    { name: t('adminDashboard'), href: '/admin', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const handleFAQOpen = () => {
    setIsFAQOpen(true);
    setIsOpen(false);
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <>
      <nav 
        className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Skip to content link for accessibility */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-fnb-teal text-white px-4 py-2 rounded z-50"
            >
              {t('skipToContent')}
            </a>

            <div className="flex items-center">
              <Link 
                href="/" 
                className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-fnb-teal rounded-lg p-1"
                aria-label="FNB Home"
              >
                <div className="w-8 h-8 bg-fnb-teal rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">FNB</span>
                </div>
                <span className="font-bold text-xl text-gray-900">FNB</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-fnb-teal',
                    pathname === item.href
                      ? 'bg-fnb-light-teal text-fnb-teal'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  )}
                  aria-current={pathname === item.href ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              ))}

              {user?.role === 'admin' && adminNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-fnb-teal',
                    pathname === item.href
                      ? 'bg-fnb-light-teal text-fnb-teal'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  )}
                  aria-current={pathname === item.href ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              ))}

              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleFAQOpen}
                className="focus:ring-2 focus:ring-fnb-teal"
                aria-label="Open FAQ and Support"
              >
                <HelpCircle className="w-4 h-4 mr-1" />
                {t('help')}
              </Button>

              <LanguageSelector />

              {user && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="focus:ring-2 focus:ring-fnb-teal"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  {t('logout')}
                </Button>
              )}
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center space-x-2">
              <LanguageSelector />
              
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    aria-label={isOpen ? t('closeMenu') : t('openMenu')}
                    className="focus:ring-2 focus:ring-fnb-teal"
                  >
                    {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Navigation Menu</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col space-y-4 mt-8">
                    {navigation.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-fnb-teal',
                            pathname === item.href
                              ? 'bg-fnb-light-teal text-fnb-teal'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                          )}
                          aria-current={pathname === item.href ? 'page' : undefined}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}

                    {user?.role === 'admin' && adminNavigation.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-fnb-teal',
                            pathname === item.href
                              ? 'bg-fnb-light-teal text-fnb-teal'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                          )}
                          aria-current={pathname === item.href ? 'page' : undefined}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}

                    <Button 
                      variant="ghost" 
                      className="justify-start px-3"
                      onClick={handleFAQOpen}
                    >
                      <HelpCircle className="w-5 h-5 mr-2" />
                      {t('help')} & {t('support')}
                    </Button>

                    {user && (
                      <Button 
                        variant="ghost" 
                        className="justify-start px-3"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-5 h-5 mr-2" />
                        {t('logout')}
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      <FAQModal isOpen={isFAQOpen} onClose={() => setIsFAQOpen(false)} />
    </>
  );
}