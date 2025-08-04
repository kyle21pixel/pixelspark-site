# JD Legal Transcripts Website

A fully functional, responsive website for JD Legal Transcripts - a professional transcription company specializing in legal, medical, interview, and general transcription services.

## 🌟 Features

### Core Functionality
- **Responsive Design**: Mobile-first design that works on all devices
- **Professional UI**: Clean, modern interface with blue and white color scheme with gold accents
- **SEO Optimized**: Semantic HTML structure with proper meta tags
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

### Pages & Sections

#### 1. Homepage (`index.html`)
- Hero section with tagline "Precision in Every Word"
- Services overview with icons
- Why choose us section
- Client testimonials
- Call-to-action sections

#### 2. Services Page (`services.html`)
- **Legal Transcription**: Court proceedings, depositions, arbitrations
- **Medical Transcription**: HIPAA-compliant medical documentation
- **Interview & Zoom Transcription**: Virtual meetings with speaker identification
- **General & Academic**: Research, lectures, podcasts
- Pricing information and turnaround times

#### 3. About Us Page (`about.html`)
- Company history and mission
- Core values and principles
- Leadership team profiles
- Company statistics
- Client testimonials

#### 4. Upload Portal (`upload.html`)
- **Drag-and-drop file upload** with visual feedback
- File validation (type, size, format)
- Real-time cost estimation
- Comprehensive form with project details
- Security and confidentiality agreements

#### 5. Contact Page (`contact.html`)
- Contact form with validation
- Multiple contact methods
- Business hours and location
- Google Maps placeholder
- FAQ preview section

#### 6. FAQ Page (`faq.html`)
- **Expandable/collapsible questions** organized by category
- Search functionality
- Categories: General, Pricing, Technical, Security
- Smooth scrolling navigation

#### 7. Legal Pages
- **Terms of Service** (`terms.html`)
- **Privacy Policy** (`privacy.html`)

### Interactive Features

#### File Upload System
- **Drag-and-drop interface** with visual feedback
- File type validation (audio/video formats)
- Size restrictions (500MB per file, 2GB total)
- Real-time file list with remove options
- Cost estimation based on service type and turnaround

#### Form Validation
- Real-time validation with visual feedback
- Email and phone number validation
- Required field checking
- Error messages and success notifications

#### Mobile Navigation
- Responsive hamburger menu
- Smooth transitions
- Touch-friendly interface

#### Interactive Elements
- Expandable FAQ sections
- Smooth scrolling navigation
- Back-to-top button
- Loading animations
- Notification system

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#1e40af)
- **Secondary**: Light Blue (#3b82f6)
- **Accent**: Gold (#fbbf24)
- **Text**: Gray shades for hierarchy

### Typography
- **Font**: Open Sans (Google Fonts)
- **Weights**: 300, 400, 600, 700
- Responsive font sizes

### Icons
- Font Awesome 6.4.0
- Consistent iconography throughout

## 🛠 Technology Stack

### Frontend
- **HTML5**: Semantic markup
- **CSS**: Tailwind CSS via CDN
- **JavaScript**: Vanilla JS for interactions
- **Fonts**: Google Fonts (Open Sans)
- **Icons**: Font Awesome

### Key Libraries & CDNs
- Tailwind CSS 3.x
- Font Awesome 6.4.0
- Google Fonts

## 📁 Project Structure

```
jd-legal-transcripts/
├── index.html              # Homepage
├── services.html           # Services page
├── about.html             # About us page
├── upload.html            # File upload portal
├── contact.html           # Contact page
├── faq.html               # FAQ page
├── terms.html             # Terms of service
├── privacy.html           # Privacy policy
├── js/
│   ├── main.js            # Core functionality
│   ├── upload.js          # Upload portal logic
│   ├── contact.js         # Contact form logic
│   └── faq.js             # FAQ interactions
└── README.md              # This file
```

## 🚀 Getting Started

1. **Clone or download** the project files
2. **Open `index.html`** in a web browser
3. **Navigate** through the different pages
4. **Test functionality** on different devices

### For Development
1. Use a local web server for best results:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

2. Open `http://localhost:8000` in your browser

## 📱 Browser Compatibility

- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile**: iOS Safari, Android Chrome
- **Responsive**: All screen sizes from 320px to 1920px+

## 🔧 Customization

### Colors
Update the Tailwind config in each HTML file:
```javascript
tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#your-color',
                secondary: '#your-color',
                accent: '#your-color'
            }
        }
    }
}
```

### Content
- Replace placeholder text with actual content
- Update contact information
- Add real testimonials and team photos
- Integrate with actual backend services

### Forms
- Connect forms to your backend API
- Replace simulation code with real submission logic
- Add actual file upload handling

## 🔒 Security Features

- **File Upload Validation**: Type and size checking
- **Form Validation**: Input sanitization and validation
- **HTTPS Ready**: All external resources use HTTPS
- **Privacy Compliant**: GDPR and HIPAA considerations

## 📈 SEO Features

- **Semantic HTML**: Proper heading hierarchy
- **Meta Tags**: Title, description, keywords
- **Open Graph**: Social media sharing ready
- **Structured Data**: Ready for schema markup
- **Google Analytics**: Placeholder integration

## 🎯 Performance Optimization

- **CDN Resources**: Fast loading external assets
- **Optimized Images**: Responsive and compressed
- **Minified CSS/JS**: Production-ready code
- **Lazy Loading**: Efficient resource loading

## 🤝 Accessibility

- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: WCAG compliant colors
- **Focus Management**: Visible focus indicators

## 📞 Support & Contact

For questions about this website template:
- **Email**: info@jdlegaltranscripts.com
- **Phone**: (555) 123-4567

## 📄 License

This website template is created for JD Legal Transcripts. All rights reserved.

---

**Built with ❤️ for professional transcription services**