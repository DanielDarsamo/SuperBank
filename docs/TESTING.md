# Testing Documentation

## Testing Strategy

### Testing Pyramid
1. **Unit Tests (70%)**: Individual components and functions
2. **Integration Tests (20%)**: Component interactions and API calls
3. **End-to-End Tests (10%)**: Complete user workflows

### Testing Tools
- **Jest**: Test runner and assertion library
- **React Testing Library**: Component testing utilities
- **Cypress**: End-to-end testing framework
- **MSW**: API mocking for tests

## Test Categories

### Unit Tests
```typescript
// Component testing example
import { render, screen, fireEvent } from '@testing-library/react';
import { FAQModal } from '@/components/ui/faq-modal';

describe('FAQModal', () => {
  it('renders FAQ modal when open', () => {
    render(<FAQModal isOpen={true} onClose={jest.fn()} />);
    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
  });

  it('filters FAQs based on search term', async () => {
    render(<FAQModal isOpen={true} onClose={jest.fn()} />);
    
    const searchInput = screen.getByPlaceholderText('Search FAQ');
    fireEvent.change(searchInput, { target: { value: 'account' } });
    
    await waitFor(() => {
      expect(screen.getByText('How do I open a new account?')).toBeInTheDocument();
    });
  });
});
```

### Integration Tests
```typescript
// API integration testing
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.post('/api/account-application', (req, res, ctx) => {
    return res(ctx.json({ success: true, id: '123' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('submits account application successfully', async () => {
  render(<AccountOpeningForm />);
  
  // Fill form and submit
  fireEvent.change(screen.getByLabelText('Full Name'), {
    target: { value: 'John Doe' }
  });
  fireEvent.click(screen.getByText('Submit Application'));
  
  await waitFor(() => {
    expect(screen.getByText('Application submitted successfully')).toBeInTheDocument();
  });
});
```

### Accessibility Tests
```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('should not have accessibility violations', async () => {
  const { container } = render(<HomePage />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Performance Tests
```typescript
test('component renders within performance budget', async () => {
  const startTime = performance.now();
  
  render(<ComplexComponent data={largeDataSet} />);
  
  const endTime = performance.now();
  const renderTime = endTime - startTime;
  
  expect(renderTime).toBeLessThan(100); // 100ms budget
});
```

## End-to-End Tests

### Cypress Configuration
```typescript
// cypress/e2e/account-opening.cy.ts
describe('Account Opening Flow', () => {
  beforeEach(() => {
    cy.visit('/account-opening');
  });

  it('completes account opening process', () => {
    // Fill personal information
    cy.get('[data-testid="full-name"]').type('John Doe');
    cy.get('[data-testid="id-number"]').type('123456789');
    cy.get('[data-testid="nuit"]').type('987654321');
    
    // Upload documents
    cy.get('[data-testid="id-upload"]').selectFile('cypress/fixtures/id-document.jpg');
    
    // Submit application
    cy.get('[data-testid="submit-application"]').click();
    
    // Verify success
    cy.contains('Application submitted successfully').should('be.visible');
  });

  it('validates required fields', () => {
    cy.get('[data-testid="submit-application"]').click();
    cy.contains('Full name is required').should('be.visible');
  });
});
```

### Cross-Browser Testing
```typescript
// cypress.config.ts
export default defineConfig({
  e2e: {
    browsers: ['chrome', 'firefox', 'edge'],
    viewportSizes: [
      { width: 320, height: 568 }, // Mobile
      { width: 768, height: 1024 }, // Tablet
      { width: 1920, height: 1080 }, // Desktop
    ],
  },
});
```

## Test Data Management

### Fixtures
```typescript
// cypress/fixtures/user.json
{
  "validUser": {
    "phone": "+258841234567",
    "pin": "1234",
    "fullName": "John Doe",
    "idNumber": "123456789"
  },
  "invalidUser": {
    "phone": "invalid",
    "pin": "123"
  }
}
```

### Mock Data
```typescript
// __mocks__/api.ts
export const mockFAQData = [
  {
    id: '1',
    question: 'How do I open a new account?',
    answer: 'To open a new account...',
    category: 'Account Management',
    keywords: ['account', 'open', 'new']
  }
];
```

## Testing Best Practices

### Component Testing
1. Test behavior, not implementation
2. Use semantic queries (getByRole, getByLabelText)
3. Test user interactions
4. Mock external dependencies
5. Test error states

### Accessibility Testing
1. Test keyboard navigation
2. Verify ARIA attributes
3. Check color contrast
4. Test with screen readers
5. Validate semantic HTML

### Performance Testing
1. Set performance budgets
2. Test with realistic data sizes
3. Monitor memory usage
4. Test on various devices
5. Measure Core Web Vitals

## Continuous Integration

### GitHub Actions
```yaml
name: Test Suite
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:ci
      
      - name: Run accessibility tests
        run: npm run test:a11y
      
      - name: Run E2E tests
        run: npm run cypress:run
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

### Quality Gates
- Minimum 80% code coverage
- All accessibility tests pass
- Performance budgets met
- No critical security vulnerabilities

## Test Commands

```bash
# Unit tests
npm run test              # Run tests in watch mode
npm run test:ci           # Run tests once with coverage
npm run test:coverage     # Generate coverage report

# E2E tests
npm run cypress:open      # Open Cypress GUI
npm run cypress:run       # Run Cypress headlessly

# Accessibility tests
npm run test:a11y         # Run accessibility tests

# Performance tests
npm run test:perf         # Run performance tests
```

## Debugging Tests

### Common Issues
1. **Async operations**: Use waitFor, findBy queries
2. **Timing issues**: Add proper waits, avoid arbitrary timeouts
3. **State management**: Mock store properly
4. **Network requests**: Use MSW for consistent mocking

### Debugging Tools
```typescript
// Debug component state
import { screen } from '@testing-library/react';
screen.debug(); // Prints current DOM

// Debug queries
screen.getByRole('button', { name: /submit/i });
screen.logTestingPlaygroundURL(); // Interactive query builder
```