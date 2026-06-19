# AeroCV — Premium Resume & Cover Letter Builder

AeroCV is a high-end, modern resume and cover letter builder designed to help professionals create ATS-optimized, beautiful resumes with real-time live preview, multiple templates, and AI-powered suggestions.

## Features

- **Interactive Resume Builder** — Live-updating WYSIWYG editor with drag-and-drop form inputs
- **Multiple Resume Templates** — Professionally designed, ATS-compliant layouts
- **Cover Letter Generator** — Dedicated cover letter builder with customizable sections
- **ATS Optimization Engine** — Built-in keyword scoring and ATS compatibility check
- **AI Integration** — Gemini API integration for real-time content optimization suggestions
- **Job Application Tracker** — Track application status, salary, and notes for multiple positions
- **Dark Mode Support** — Full light and dark theme toggle
- **Real-time Preview** — See changes instantly as you edit
- **Export to PDF** — Download resume and cover letter as printable PDFs
- **Responsive Design** — Works seamlessly on desktop, tablet, and mobile
- **Pre-populated Data** — Example resume data for immediate use and demonstration

## Built With

- HTML
- Tailwind CSS (CDN)
- Vanilla JavaScript
- Gemini AI API (optional, for content optimization)
- FontAwesome icons

## Project Structure

- `AeroCv.html` — main application interface and layout
- `style.css` — custom animations, glassmorphism effects, and print styling
- `app.js` — application logic, state management, form handling, and preview synchronization

## Usage

1. Open `AeroCv.html` in a modern web browser
2. **Start Building**: Use the Resume Builder tab to create or edit your resume
   - Edit personal information, experience, education, skills, and projects
   - Use the AI optimizer button to refine content for better ATS compatibility
3. **Write Cover Letter**: Switch to the Cover Letter tab to craft your application letter
4. **Choose Template**: Select from multiple resume templates in the Templates section
5. **Track Jobs**: Use the Job Tracker to manage applications and track their status
6. **Export**: Download your resume and cover letter as PDF when ready
7. **(Optional) Connect Gemini**: Link your Gemini API key for real-time content suggestions

## Features in Detail

### Resume Builder
- Add/edit multiple work experience entries
- Include education history
- Showcase projects and portfolio work
- List skills and certifications
- Live preview updates as you type

### Cover Letter Module
- Customizable templates
- Real-time preview
- Save multiple versions
- Export as PDF

### Job Application Tracker
- Track application status (Wishlist, Applied, Interview, Offer)
- Store salary and position details
- Add notes and reminders
- Color-coded status indicators

### ATS Optimization
- Keyword scoring system
- Content suggestions for better ATS compliance
- AI-powered bullet point refinement (with Gemini API)

## Technical Notes

- All data is stored in browser memory (session-based)
- No backend server required
- Fully client-side application
- Responsive design optimized for all screen sizes
- Print-friendly CSS for perfect PDF exports
- Glassmorphism UI effects with Tailwind CSS

## API Integration

### Gemini API (Optional)
To enable AI-powered content optimization:
1. Obtain a Gemini API key from Google
2. Click "Connect Gemini" in the header
3. Enter your API key when prompted
4. Use the "Optimize" buttons throughout the builder

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Any modern browser with ES6+ support

## License

Add your preferred open source license before publishing on GitHub.
