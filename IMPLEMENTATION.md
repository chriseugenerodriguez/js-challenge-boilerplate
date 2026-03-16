# Kin OCR Policy Validator

A comprehensive Angular application for validating policy numbers from OCR-scanned documents. The application includes intelligent error correction and API integration.

## Features

### User Story 1: CSV Upload & Display
- Upload CSV files with policy numbers (max 2MB)
- Automatic validation of file type and size
- Display policy numbers in a responsive table

### User Story 2: Checksum Validation
- Validate policy numbers using a fixed checksum algorithm
- Formula: `(d1+(2*d2)+(3*d3)+...+(9*d9)) mod 11 = 0`
- Display validation status alongside each policy number

### User Story 3: API Submission
- Submit validated policies to JSONPlaceholder API
- Display success/failure messages with response IDs
- User-friendly error handling

### User Story 4: Intelligent Error Correction
- Automatically correct common OCR scanning errors:
  - `0` ↔ `8`
  - `1` ↔ `7`
  - `3` ↔ `9`
  - `5` ↔ `6`, `9`
  - `6` ↔ `5`, `8`, `9`
  - `9` ↔ `3`, `5`, `8`

- Result statuses:
  - **Valid**: Policy number passes checksum validation
  - **Corrected**: Single correction found by swapping digits
  - **Ambiguous (AMB)**: Multiple possible corrections exist
  - **Error**: No valid correction found

## Technical Stack

- **Framework**: Angular 20
- **Language**: TypeScript 5.8
- **Styling**: SCSS with Kin brand color palette
- **Accessibility**: WCAG 2.1 compliant
- **Responsive**: Mobile-first design

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Angular CLI (`npm install -g @angular/cli`)

### Installation

```bash
npm install
```

### Development Server

```bash
npm start
```

Navigate to `http://localhost:4200/` in your browser. The application will automatically reload if you change any source files.

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Running Tests

```bash
npm test
```

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

## Usage

1. **Upload CSV File**
   - Click the upload area or select a file
   - File must be `.csv` format
   - Maximum file size: 2MB
   - CSV should contain comma-separated policy numbers

2. **Review Results**
   - View validation status for each policy number
   - Status indicators show valid/corrected/ambiguous/error
   - Color-coded badges for quick identification

3. **Submit to API**
   - Click "Step 3: Submit to API" button
   - Application posts results to JSONPlaceholder API
   - Success/failure message displays with response ID

4. **Reset**
   - Click "Reset" to clear all data and start over

## API Integration

### Endpoint
```
POST https://jsonplaceholder.typicode.com/posts
```

### Payload
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

## Accessibility Features

- Full keyboard navigation support
- ARIA labels and roles for screen readers
- Focus indicators for keyboard navigation
- High contrast mode support
- Reduced motion preferences respected
- Semantic HTML structure
- Proper heading hierarchy

## Styling & Design

The application uses Kin's standard color palette:
- **Primary**: #ffc857 (Yellow)
- **Secondary**: #167c80 (Teal)
- **Tertiary**: #8e5cd1 (Purple)
- **Success**: #2f943b (Green)
- **Warning**: #B11030 (Red)

The design is fully responsive and works on:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (< 768px)

## File Examples

### Sample CSV Format
```csv
457508000,664371495,333333333,45750800,555555555
```

Each policy number should be separated by a comma with no spaces.

## Error Handling

- Invalid file types are rejected with error message
- Files exceeding 2MB are rejected
- Empty CSV files are handled gracefully
- API connection errors display user-friendly messages
- Malformed CSV data triggers appropriate error messages

## Performance

- Optimized bundle size (279.69 kB gzip)
- Lazy-loaded modules where applicable
- Efficient checksum calculation
- Responsive UI with smooth animations

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development

### Code Quality
- TypeScript strict mode enabled
- ESLint configured for code style
- Unit tests for validation logic
- Component-based architecture

### Adding Tests

Run the test suite:
```bash
npm test -- --watch=true
```

## Troubleshooting

### Build Failed
- Clear `node_modules/` and run `npm install`
- Check Node.js version compatibility
- Clear Angular CLI cache: `ng cache clean`

### SCSS Errors
- Ensure `node-sass` or `sass` is installed
- Check SCSS import paths are relative

### API Connection Issues
- Verify internet connection
- Check CORS settings if using different domain
- API endpoint is `https://jsonplaceholder.typicode.com/posts`

## Future Enhancements

- Export results to CSV or PDF
- Batch file uploads
- Policy number history
- Advanced filtering and sorting
- Data persistence (localStorage)
- Dark mode toggle
- Multi-language support

## License

Proprietary - Kin Insurance

## Contact

For questions or support, contact the development team.
