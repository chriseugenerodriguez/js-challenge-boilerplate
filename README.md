# Kin OCR - Policy Number Validator

A comprehensive Angular application for validating policy numbers from OCR-scanned documents with intelligent error correction and API integration.

## Overview

This application addresses all 4 user stories for the Kin OCR challenge:

1. **CSV Upload & Display** - Upload policy numbers from CSV files (max 2MB)
2. **Checksum Validation** - Validate policy numbers using the fixed checksum algorithm
3. **API Submission** - Submit validated policies to the backend API
4. **Error Correction** - Intelligently correct common OCR scanning errors with digit swapping

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start
# Navigate to http://localhost:4200

# Build for production
npm run build

# Run tests
npm test
```

## Features

### Policy Validation
- Checksum calculation: `(d1+(2*d2)+(3*d3)+...+(9*d9)) mod 11 = 0`
- Validates 9-digit policy numbers with automatic zero-padding
- Error correction for common OCR misreads:
  - `0` ↔ `8` | `1` ↔ `7` | `3` ↔ `9`
  - `5` ↔ `6`, `9` | `6` ↔ `5`, `8`, `9` | `9` ↔ `3`, `5`, `8`

### Result Statuses
- **Valid** - Policy number passes checksum validation
- **Corrected** - Single correction found by swapping one digit
- **Ambiguous (AMB)** - Multiple possible corrections exist
- **Error** - No valid correction found

### UI & UX
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Accessible (WCAG 2.1, keyboard navigation, screen readers)
- ✅ Kin brand color palette compliance
- ✅ Dark mode & high contrast support

## Project Structure

```
src/
├── app/
│   ├── app.component.ts           # Main component logic
│   ├── app.component.html         # UI template
│   ├── app.component.scss         # Component styling
│   ├── policy-validation.service.ts    # Checksum and error correction logic
│   ├── policy-validation.service.spec.ts # Validation tests
│   ├── policy-api.service.ts      # API communication
│   ├── app.config.ts              # Application configuration
│   └── app.routes.ts              # Routing configuration
├── styles.scss                    # Global styles and color palette
├── index.html                     # Application shell
└── main.ts                        # Bootstrap file
```
- ✅ Smooth animations and transitions

### Technical
- Built with Angular 20 using standalone components
- TypeScript 5.8 with strict mode
- SCSS styling with CSS variables
- HTTP client for API integration
- Comprehensive unit tests

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   └── app/                       # Main application component
│   │       ├── app.component.ts
│   │       ├── app.component.html
│   │       ├── app.component.scss
│   │       └── app.component.spec.ts
│   ├── services/                      # Business logic services
│   │   ├── policy-validation.service.ts
│   │   ├── policy-validation.service.spec.ts
│   │   └── policy-api.service.ts
│   ├── app.config.ts                  # Application configuration
│   └── app.routes.ts                  # Routing configuration
├── assets/                            # Static assets
├── styles.scss                        # Global styles and variables
├── index.html                         # Main HTML template
└── main.ts                            # Application bootstrap
```

## Usage

### 1. Upload CSV File
Click the upload area and select a CSV file containing policy numbers separated by commas:

```csv
457508000,664371495,333333333,45750800,555555555
```

File requirements:
- Format: `.csv`
- Max size: 2MB
- Content: Comma-separated policy numbers

### 2. Review Results
The application displays each policy number with its validation status:

| Policy Number | Status |
|---------------|--------|
| 457508000 | Valid |
| 664371495 | Error |
| 333333333 | Corrected |

### 3. Submit to API
Click "Submit to API" to post the validated policies to the backend. The application will display the response ID upon success.

### 4. Reset
Click "Reset" to clear all data and start over.

## API Integration

### Endpoint
```
POST https://jsonplaceholder.typicode.com/posts
```

### Request Payload
```json
{
  "title": "Policy Validation Report",
  "body": "[{\"policyNumber\": 457508000, \"result\": \"valid\"}, ...]",
  "userId": 1
}
```

### Response
```json
{
  "userId": 1,
  "id": 101,
  "title": "Policy Validation Report",
  "body": "[...]"
}
```

## Sample Data

Use `./sample.csv` for testing:
```csv
457508000,664371495,333333333,45750800,555555555,666666666,777777777,861100036,861100036,123456789
```

## Development

### Code Quality
- TypeScript strict mode enabled
- Standalone components and new control flow syntax
- Component-based architecture with organized folder structure
- SCSS mixins for maintainable styling
- Comprehensive test coverage with browser-based execution

### Testing
```bash
# Run tests in browser (watch mode)
npm test

# Run tests once and exit
npm test -- --watch=false

# Run with coverage
npm test -- --code-coverage
```

Tests run in Chrome browser by default with detailed console output showing each test spec.

### Build
```bash
# Production build
ng build

# Development build with watch
npm run watch
```

## Accessibility

The application meets WCAG 2.1 standards:
- Full keyboard navigation support
- Screen reader compatible
- ARIA labels and semantic HTML
- Focus indicators
- High contrast mode support
- Reduced motion preferences respected

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Styling

Uses Kin's standard color palette with CSS variables:
- Primary: `#ffc857` (Yellow)
- Secondary: `#167c80` (Teal)
- Tertiary: `#8e5cd1` (Purple)
- Success: `#2f943b` (Green)
- Warning: `#B11030` (Red)

All styles defined in [src/styles.scss](src/styles.scss).

## Documentation

See [IMPLEMENTATION.md](IMPLEMENTATION.md) for detailed technical documentation.

## Technologies

- **Framework**: Angular 20
- **Language**: TypeScript 5.8
- **Styling**: SCSS
- **Testing**: Jasmine/Karma
- **HTTP**: Angular HttpClient
- **Build Tool**: Angular CLI

## Notes

- Uses modern Angular features (standalone components, new control flow)
- No external UI libraries - built with custom styling
- API responses are mocked using JSONPlaceholder
- Fully self-contained application with no external dependencies for core functionality
