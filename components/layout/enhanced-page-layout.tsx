'use client';

import { ReactNode, useEffect } from 'react';
import { EnhancedNavigation } from './enhanced-navigation';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { PerformanceMonitor } from '@/components/ui/performance-monitor';
import { useAppStore } from '@/store/app-store';

interface EnhancedPageLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function EnhancedPageLayout({ children, title, description }: EnhancedPageLayoutProps) {
  const { language } = useAppStore();

  // Set document language and direction
  useEffect(() => {
    document.documentElement.lang = language;
   document.documentElement.dir = (language && (language as string) === 'ar') ? 'rtl' : 'ltr';
  }, [language]);

  // Set viewport meta tag for proper mobile scaling
  useEffect(() => {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes');
    }
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <EnhancedNavigation />
        
        <main 
          id="main-content"
          className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8"
          role="main"
          tabIndex={-1}
        >
          {(title || description) && (
            <header className="mb-8">
              {title && (
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {title}
                </h1>
              )}
              {description && (
                <p className="text-gray-600 text-lg leading-relaxed">
                  {description}
                </p>
              )}
            </header>
          )}
          
          <div className="min-h-[60vh]">
            {children}
          </div>
        </main>

        <footer 
          className="bg-white border-t border-gray-200 mt-auto"
          role="contentinfo"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center text-sm text-gray-600">
              <p>&copy; 2024 FNB - Digital Banking for Africa. All rights reserved.</p>
              <p className="mt-1">
                Secure • Reliable • Accessible
              </p>
            </div>
          </div>
        </footer>

        <PerformanceMonitor />
      </div>
    </ErrorBoundary>
  );
}