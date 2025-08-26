import { AboutMe } from '@/types'
import SocialLinks from '@/components/SocialLinks'

interface HeroProps {
  aboutMe: AboutMe
}

export default function Hero({ aboutMe }: HeroProps) {
  const { metadata } = aboutMe

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 pt-16">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 animate-fade-in">
            {metadata?.profile_image && (
              <img
                src={`${metadata.profile_image.imgix_url}?w=300&h=300&fit=crop&auto=format,compress`}
                alt={metadata?.full_name || 'Profile'}
                width="150"
                height="150"
                className="w-32 h-32 md:w-40 md:h-40 rounded-full mx-auto mb-8 shadow-lg object-cover"
              />
            )}
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4">
              {metadata?.full_name || 'Welcome'}
            </h1>
            
            {metadata?.professional_title && (
              <h2 className="text-xl md:text-2xl lg:text-3xl text-gray-600 mb-8 font-light">
                {metadata.professional_title}
              </h2>
            )}
            
            {metadata?.location && (
              <p className="text-lg text-gray-500 mb-8">
                📍 {metadata.location}
              </p>
            )}
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <button
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary px-8 py-3 text-lg"
              >
                View My Work
              </button>
              
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-secondary px-8 py-3 text-lg"
              >
                Get In Touch
              </button>
            </div>
          </div>
          
          <SocialLinks aboutMe={aboutMe} />
        </div>
      </div>
    </section>
  )
}