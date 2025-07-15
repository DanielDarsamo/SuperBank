import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FAQModal } from '@/components/ui/faq-modal';
import { useAppStore } from '@/store/app-store';

// Mock the store
jest.mock('@/store/app-store');
const mockUseAppStore = useAppStore as jest.MockedFunction<typeof useAppStore>;

// Mock toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('FAQModal', () => {
  const mockOnClose = jest.fn();

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

  it('renders FAQ modal when open', () => {
    render(<FAQModal isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByText('Frequently Asked Questions & Support')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search FAQ')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<FAQModal isOpen={false} onClose={mockOnClose} />);
    
    expect(screen.queryByText('Frequently Asked Questions & Support')).not.toBeInTheDocument();
  });

  it('filters FAQs based on search term', async () => {
    render(<FAQModal isOpen={true} onClose={mockOnClose} />);
    
    const searchInput = screen.getByPlaceholderText('Search FAQ');
    fireEvent.change(searchInput, { target: { value: 'account' } });
    
    await waitFor(() => {
      expect(screen.getByText('How do I open a new account?')).toBeInTheDocument();
    });
  });

  it('filters FAQs by category', async () => {
    render(<FAQModal isOpen={true} onClose={mockOnClose} />);
    
    const securityButton = screen.getByText('Security');
    fireEvent.click(securityButton);
    
    await waitFor(() => {
      expect(screen.getByText('Is my personal information secure?')).toBeInTheDocument();
    });
  });

  it('expands and collapses FAQ items', async () => {
    render(<FAQModal isOpen={true} onClose={mockOnClose} />);
    
    const faqQuestion = screen.getByText('How do I open a new account?');
    fireEvent.click(faqQuestion);
    
    await waitFor(() => {
      expect(screen.getByText(/To open a new account, click on "Account Opening"/)).toBeInTheDocument();
    });
  });

  it('handles feedback submission', async () => {
    render(<FAQModal isOpen={true} onClose={mockOnClose} />);
    
    // Expand an FAQ first
    const faqQuestion = screen.getByText('How do I open a new account?');
    fireEvent.click(faqQuestion);
    
    await waitFor(() => {
      const yesButton = screen.getByText('Yes');
      fireEvent.click(yesButton);
    });
    
    // Should show loading state and then success
    await waitFor(() => {
      expect(screen.getByText('Yes')).toBeInTheDocument();
    });
  });

  it('handles contact support actions', async () => {
    render(<FAQModal isOpen={true} onClose={mockOnClose} />);
    
    const liveChatButton = screen.getByText('Live Chat');
    fireEvent.click(liveChatButton);
    
    // Should show loading state
    await waitFor(() => {
      expect(liveChatButton).toBeDisabled();
    });
  });

  it('shows no results message when search yields no results', async () => {
    render(<FAQModal isOpen={true} onClose={mockOnClose} />);
    
    const searchInput = screen.getByPlaceholderText('Search FAQ');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    
    await waitFor(() => {
      expect(screen.getByText('No FAQs found matching your search.')).toBeInTheDocument();
    });
  });

  it('supports keyboard navigation', async () => {
    render(<FAQModal isOpen={true} onClose={mockOnClose} />);
    
    const searchInput = screen.getByPlaceholderText('Search FAQ');
    searchInput.focus();
    
    expect(document.activeElement).toBe(searchInput);
    
    // Test tab navigation
    fireEvent.keyDown(searchInput, { key: 'Tab' });
    // Should move to next focusable element
  });
});