# Accessibility Guidelines

## WCAG 2.1 AA Compliance

This application is designed to meet WCAG 2.1 AA accessibility standards.

### Key Features

#### Keyboard Navigation
- All interactive elements are keyboard accessible
- Logical tab order throughout the application
- Skip links for main content navigation
- Escape key support for modals and dropdowns

#### Screen Reader Support
- Semantic HTML structure with proper landmarks
- ARIA labels and descriptions where needed
- Live regions for dynamic content updates
- Proper heading hierarchy (h1-h6)

#### Visual Accessibility
- Minimum 16px base font size
- High contrast ratios (4.5:1 for normal text, 3:1 for large text)
- Focus indicators on all interactive elements
- No reliance on color alone for information

#### Motor Accessibility
- Large touch targets (minimum 44px)
- Generous spacing between interactive elements
- Support for various input methods

### Testing Checklist

#### Automated Testing
- [ ] Run axe-core accessibility tests
- [ ] Validate HTML semantics
- [ ] Check color contrast ratios
- [ ] Test with screen reader simulation

#### Manual Testing
- [ ] Navigate entire app using only keyboard
- [ ] Test with actual screen reader (NVDA, JAWS, VoiceOver)
- [ ] Verify focus management in modals
- [ ] Test with high contrast mode
- [ ] Validate with users who have disabilities

### Implementation Details

#### Focus Management
```typescript
// Example: Focus management in modals
useEffect(() => {
  if (isOpen) {
    const firstFocusable = modalRef.current?.querySelector('[tabindex="0"]');
    firstFocusable?.focus();
  }
}, [isOpen]);
```

#### ARIA Labels
```tsx
// Example: Proper ARIA labeling
<Button
  aria-label="Close modal"
  aria-describedby="modal-description"
  onClick={onClose}
>
  <X className="w-4 h-4" />
</Button>
```

#### Live Regions
```tsx
// Example: Announcing dynamic changes
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>
```

### Common Patterns

#### Form Accessibility
- Associate labels with form controls
- Provide error messages with aria-describedby
- Use fieldsets for grouped controls
- Indicate required fields clearly

#### Navigation Accessibility
- Use nav landmarks
- Provide current page indication
- Implement breadcrumbs where appropriate
- Ensure consistent navigation structure

#### Content Accessibility
- Use proper heading hierarchy
- Provide alt text for images
- Use descriptive link text
- Structure content logically

### Testing Tools

#### Browser Extensions
- axe DevTools
- WAVE Web Accessibility Evaluator
- Lighthouse Accessibility Audit

#### Screen Readers
- NVDA (Windows)
- JAWS (Windows)
- VoiceOver (macOS/iOS)
- TalkBack (Android)

#### Automated Testing
```bash
# Run accessibility tests
npm run test:a11y

# Check color contrast
npm run test:contrast

# Validate HTML
npm run test:html
```

### Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Resources](https://webaim.org/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)