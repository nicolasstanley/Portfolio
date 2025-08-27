# Nicolas Ménard - UX Designer & Researcher Portfolio

This is the portfolio of Nicolas Ménard, a UX Designer & Researcher with 10 years of experience in User Experience. Built with Next.js and powered by Cosmic CMS, this portfolio showcases projects, work experience, skills, and professional information in a clean, modern interface.


## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Cosmic CMS** - Headless CMS for content management
- **React** - UI library
- **ESLint** - Code linting

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Cosmic account with the portfolio content model

### Development Setup

1. Install dependencies:
```bash
bun install
```

2. Set up environment variables:
Create a `.env.local` file in the root directory with your Cosmic credentials:
```env
COSMIC_BUCKET_SLUG=your-bucket-slug
COSMIC_READ_KEY=your-read-key
```

3. Run the development server:
```bash
bun run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment Options

### Deploy to Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Deploy to Netlify
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

### Environment Variables for Deployment
Set these environment variables in your hosting platform:

- `COSMIC_BUCKET_SLUG` - Your Cosmic bucket slug
- `COSMIC_READ_KEY` - Your Cosmic read key

The portfolio is optimized for static generation and will work with any modern hosting platform that supports Next.js applications.
<!-- README_END -->