import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageSelector } from '@/components/ui/language-selector';
import { useAppStore } from '@/store/app-store';

jest.mock('@/store/app-store');
const mockUseAppStore = useAppStore as jest.MockedFunction<typeof useAppStore>;

describe('LanguageSelector', () => {
  const mockSetLanguage = jest.fn();

  beforeEach(() => {
    mockUseAppStore.mockReturnValue({
      language: 'en',
      setLanguage: mockSetLanguage,
      user: null,
      setUser: jest.fn(),
      isAuthenticated: false,
      setAuthenticated: jest.fn(),
      currentQueue: null,
      setCurrentQueue: jest.fn(),
      logout: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders language selector with current language', () => {
    render(<LanguageSelector />);
    
    expect(screen.getByText('🇺🇸 English')).toBeInTheDocument();
  });

  it('opens dropdown when clicked', () => {
    render(<LanguageSelector />);
    
    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);
    
    expect(screen.getByText('Português')).toBeInTheDocument();
  });

  it('changes language when option is selected', () => {
    render(<LanguageSelector />);
    
    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);
    
    const portugueseOption = screen.getByText('Português');
    fireEvent.click(portugueseOption);
    
    expect(mockSetLanguage).toHaveBeenCalledWith('pt');
  });

  it('shows check mark for current language', () => {
    render(<LanguageSelector />);
    
    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);
    
    // Check mark should be visible for English (current language)
    const englishOption = screen.getByText('English').closest('[role="menuitem"]');
    expect(englishOption).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<LanguageSelector />);
    
    const trigger = screen.getByRole('button');
    expect(trigger).toHaveAttribute('aria-label', 'Select language');
  });
});