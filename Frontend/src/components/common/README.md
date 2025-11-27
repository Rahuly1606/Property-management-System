# PropertyHub Design System

A comprehensive design system for PropertyHub, a modern property marketplace web application. This design system provides consistent UI components, responsive layouts, and accessibility features across desktop, tablet, and mobile experiences.

## Overview

The PropertyHub Design System is built with:

- **Tailwind CSS** for styling
- **React** for component development
- **Material-UI** for compatibility with existing components

## Design Tokens

### Colors

- **Primary (Deep Blue)**: Conveys trust and security
  - Main: #0F172A
  - Scale: 50-900

- **Accent (Warm Orange)**: Used for CTAs and highlights
  - Main: #FF7A59
  - Scale: 50-900

- **Neutrals**: Grayscale for text and backgrounds
  - Scale: 50-900

- **Feedback Colors**:
  - Success: #10B981
  - Warning: #F59E0B
  - Error: #EF4444
  - Info: #3B82F6

### Typography

- **Fonts**:
  - Headings: Poppins
  - Body: Inter

- **Font Sizes**:
  - Display: 48px (3rem)
  - H1: 36px (2.25rem)
  - H2: 30px (1.875rem)
  - H3: 24px (1.5rem)
  - H4: 20px (1.25rem)
  - H5: 18px (1.125rem)
  - Body: 16px (1rem)
  - Small: 14px (0.875rem)
  - XSmall: 12px (0.75rem)

### Spacing

Consistent 4px spacing scale:
- 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 80px, 96px

### Breakpoints

- **Mobile**: 375px
- **Tablet**: 768px
- **Desktop**: 1440px

## Components

### Layout Components

- **Container**: For centered, max-width content containers
- **Row/Col**: Flexbox-based 12-column grid system
- **Grid**: CSS Grid-based layout system
- **Section**: Semantic section with consistent spacing
- **AspectRatio**: Maintains consistent aspect ratios for images
- **Hidden/Visible**: Components for responsive visibility control

### UI Components

- **Button**: Multiple variants (primary, secondary, accent, outline, ghost)
- **Card**: General and specialized (PropertyCard, ProfileCard, StatCard)
- **FormComponents**: Input, TextArea, Select, Checkbox, Radio, etc.
- **Modal**: Dialog component with header, body, footer
- **Toast**: Notification system with success, error, warning, info variants
- **Skeletons**: Loading placeholders for various components

### Data Display

- **Badge**: For tags, status indicators
- **PriceDisplay**: Formatted property prices
- **PropertyStats**: Key property statistics
- **FeatureList**: Property amenities and features
- **Rating**: Star ratings for properties and users
- **PropertyStatus**: Status indicators (available, sold, pending)
- **Table**: For structured data display

### Animation Components

- **Fade**: Fade in/out animations
- **Slide**: Directional slide animations
- **Scale**: Scaling animations
- **Pulse**: Attention-drawing animations
- **HoverEffect**: Hover interaction effects
- **StaggeredGroup**: Coordinated animations for groups of elements

### Accessibility Utilities

- **SkipToContent**: For keyboard navigation
- **VisuallyHidden**: Screen reader only content
- **FocusTrap**: For modal dialogs
- **LiveRegion**: For dynamic announcements
- **A11yImage**: Proper alt text handling
- **A11yLabel**: Accessible form labels

## Getting Started

### Installation

The design system is already integrated into the PropertyHub codebase. No additional installation is required.

### Usage

1. Import components from the common directory:

```jsx
import { Button, Card, Container, Row, Col } from '../components/common';
```

2. Use the components in your JSX:

```jsx
<Container>
  <Row>
    <Col span={{ sm: 12, md: 6, lg: 4 }}>
      <Card>
        <h2>Property Title</h2>
        <p>Property description...</p>
        <Button variant="primary">View Details</Button>
      </Card>
    </Col>
  </Row>
</Container>
```

## Component Documentation

For a complete visual documentation of all components, visit the Component Guide page in the application:

```jsx
// Navigate to /component-guide in the application
```

## CSS Variables

The design system uses CSS variables (custom properties) for consistent theming. These are defined in `src/styles/theme.css` and can be accessed in your CSS:

```css
.my-element {
  color: var(--color-primary-900);
  font-family: var(--font-heading);
  margin-bottom: var(--spacing-4);
}
```

## Accessibility

All components are built with accessibility in mind:

- Proper contrast ratios
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Reduced motion support

## Contribution Guidelines

When adding new components to the design system:

1. Follow the existing patterns and naming conventions
2. Ensure components are responsive across all breakpoints
3. Test for accessibility compliance
4. Add the component to the Component Guide
5. Update this README if necessary

## Acknowledgements

This design system was created based on the PropertyHub design brief, focusing on creating a modern, trustworthy property marketplace experience.