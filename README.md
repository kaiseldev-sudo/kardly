# Kardly - Business Card Generator

A modern, responsive web application for creating beautiful business cards with multiple themes and export options.

## Features

- **Multiple Design Themes**: Choose from 6 different themes tailored for various professions
  - Minimalist (Universal)
  - Creative (Designers)
  - Formal (Lawyers/Executives)
  - Modern (Tech Professionals)
  - Elegant (Real Estate/Luxury)
  - Photographer (Visual Artists)

- **Comprehensive Input Form**: 
  - Personal information (name, title, company)
  - Contact details (phone, email, website, LinkedIn, address)
  - Logo and profile image upload support

- **Live Preview**: Real-time preview of your business card as you type

- **Export Options**:
  - PNG export with high resolution
  - PDF export with standard business card dimensions

- **Save & Share**:
  - Save favorite cards to localStorage
  - Generate shareable links
  - Load previously saved cards

- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: TailwindCSS with custom components
- **Icons**: Lucide React
- **Export**: html2canvas + jsPDF
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd kardly
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## Usage

1. **Fill in your information**: Start by entering your name, title, and company
2. **Choose a theme**: Select from the available themes based on your profession
3. **Add contact details**: Include phone, email, website, LinkedIn, and address
4. **Upload images** (optional): Add your company logo and/or profile photo
5. **Preview**: See your card update in real-time
6. **Export**: Download as PNG or PDF
7. **Save**: Save your card for later use
8. **Share**: Generate a shareable link

## Project Structure

```
src/
├── components/
│   ├── BusinessCard.tsx      # Card preview component
│   ├── CardForm.tsx          # Input form component
│   └── ExportButtons.tsx     # Export functionality
├── data/
│   └── themes.ts             # Theme configurations
├── types/
│   └── index.ts              # TypeScript interfaces
├── App.tsx                   # Main application component
├── main.tsx                  # Application entry point
└── index.css                 # Global styles and TailwindCSS
```

## Customization

### Adding New Themes

To add a new theme, edit `src/data/themes.ts` and add a new theme object:

```typescript
{
  id: 'your-theme',
  name: 'Your Theme',
  description: 'Description of your theme',
  profession: 'Target Profession',
  colors: {
    primary: '#your-color',
    secondary: '#your-color',
    accent: '#your-color',
    background: '#your-color',
    text: '#your-color',
  },
  font: {
    name: 'Font Name',
    heading: 'font-classes',
    body: 'font-classes',
  },
  layout: 'horizontal' | 'vertical',
}
```

### Modifying Card Layouts

The card layouts are defined in `src/components/BusinessCard.tsx`. You can modify the rendering logic for both horizontal and vertical layouts.

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Future Enhancements

- [ ] QR code generation
- [ ] More theme options
- [ ] Custom color picker
- [ ] Social media integration
- [ ] Print optimization
- [ ] Multiple card layouts per theme
- [ ] Template marketplace 