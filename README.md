# Nicolas Ménard - UX Designer & Researcher Portfolio

A professional portfolio website for Nicolas Ménard, a Senior UX Designer & Researcher. Built with Next.js and powered by Cosmic CMS, this portfolio showcases projects, work experience, skills, and professional information in a clean, modern interface.

## Features

- 🎨 **Modern Design**: Clean, professional interface with smooth animations
- 📱 **Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- 🚀 **Fast Performance**: Built with Next.js for optimal loading speeds
- 📊 **Dynamic Content**: All content managed through Cosmic CMS
- 🔍 **Project Showcase**: Detailed case studies with galleries and project details
- 💼 **Professional Timeline**: Work experience with company logos and achievements
- 🛠️ **Skills Display**: Categorized skills with proficiency levels
- 📞 **Contact Integration**: Professional contact information and social links

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmicjs.com/projects/new?clone_bucket=68acbfcc04ea77b1e31e55ea&clone_repository=68ad95471f09167261d58e02)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "Create a content model for a UX Designer portfolio with projects, skills, work experience, and about me page."

### Code Generation Prompt

> "Build a Next.js website that uses my existing objects in this bucket"

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

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
