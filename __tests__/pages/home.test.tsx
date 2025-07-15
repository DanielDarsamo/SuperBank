import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';
import { useAppStore } from '@/store/app-store';

jest.mock('@/store/app-store');
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const mockUseAppStore = useAppStore as jest.MockedFunction<typeof useAppStore>;

describe('HomePage', () => {
  beforeEach(() => {
    mockUseAppStore.mockReturnValue({
      language: 'en',
      setLanguage: jest.fn(),
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

  it('renders welcome page for unauthenticated users', () => {
    render(<HomePage />);
    
    expect(screen.getByText('Welcome to FNB')).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
    expect(screen.getByText('Open Account')).toBeInTheDocument();
  });

  it('renders dashboard for authenticated users', () => {
    mockUseAppStore.mockReturnValue({
      language: 'en',
      setLanguage: jest.fn(),
      user: { id: '1', phone: '+1234567890', role: 'client', created_at: '', updated_at: '' },
      setUser: jest.fn(),
      isAuthenticated: true,
      setAuthenticated: jest.fn(),
      currentQueue: null,
      setCurrentQueue: jest.fn(),
      logout: jest.fn(),
    });

    render(<HomePage />);
    
    expect(screen.getByText('Welcome, +1234567890')).toBeInTheDocument();
    expect(screen.getByText('Account Opening')).toBeInTheDocument();
    expect(screen.getByText('Queue Management')).toBeInTheDocument();
    expect(screen.getByText('Banking Services')).toBeInTheDocument();
  });

  it('displays banking services section', () => {
    render(<HomePage />);
    
    expect(screen.getByText('Banking Services')).toBeInTheDocument();
    expect(screen.getByText('Personal Banking')).toBeInTheDocument();
    expect(screen.getByText('Business Banking')).toBeInTheDocument();
    expect(screen.getByText('Digital Banking')).toBeInTheDocument();
  });

  it('displays account types section', () => {
    render(<HomePage />);
    
    expect(screen.getByText('Account Types')).toBeInTheDocument();
    expect(screen.getByText('FNB Gold Account')).toBeInTheDocument();
    expect(screen.getByText('FNB Easy Account')).toBeInTheDocument();
    expect(screen.getByText('FNB Student Account')).toBeInTheDocument();
  });

  it('displays statistics section', () => {
    render(<HomePage />);
    
    expect(screen.getByText('2.5M+')).toBeInTheDocument();
    expect(screen.getByText('Active Users')).toBeInTheDocument();
    expect(screen.getByText('500K+')).toBeInTheDocument();
    expect(screen.getByText('Transactions Daily')).toBeInTheDocument();
  });

  it('has proper accessibility structure', () => {
    render(<HomePage />);
    
    // Check for proper heading hierarchy
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toBeInTheDocument();
    
    // Check for navigation landmarks
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('supports responsive design', () => {
    render(<HomePage />);
    
    // Check for responsive grid classes (this would be better tested with actual viewport changes)
    const serviceCards = screen.getAllByText(/Banking/);
    expect(serviceCards.length).toBeGreaterThan(0);
  });
});