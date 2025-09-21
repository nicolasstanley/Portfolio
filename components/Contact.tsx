import { AboutMe } from '@/types'
import SocialLinks from '@/components/SocialLinks'

interface ContactProps {
  aboutMe: AboutMe | null
}

export default function Contact({ aboutMe }: ContactProps) {
  const metadata = aboutMe?.metadata

  // If no aboutMe data, show a fallback
  if (!aboutMe || !metadata) {
    return (
      <section id="contact" className="section bg-white">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
              Get In Touch
            </h2>
            <div className="w-20 h-1 bg-primary-600 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600">
              Contact information will be available soon.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="section bg-white">
      <div className="container">
        <div className="mb-16" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4 leading-tight">
            Get In Touch
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl leading-6">
            I'm always interested in discussing new opportunities, design challenges, and collaborative projects.
          </p>
        </div>
          
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="md:order-1" data-aos="fade-up" data-aos-delay="200">
              {metadata?.profile_image && (
                <div className="relative w-full md:w-80">
                  <img
                    src={`${metadata.profile_image.imgix_url}?w=400&auto=format,compress`}
                    alt={metadata?.full_name || 'Contact'}
                    className="w-full h-auto object-contain rounded-lg shadow-lg"
                  />
                </div>
              )}
            </div>
            
            <div className="flex-1 md:order-2" data-aos="fade-up" data-aos-delay="400">
              <div className="space-y-6">
                {metadata?.email && (
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Email</h3>
                      <a 
                        href={`mailto:${metadata.email}`}
                        className="text-primary-600 hover:text-primary-700 transition-colors duration-200"
                      >
                        {metadata.email}
                      </a>
                    </div>
                  </div>
                )}
                
                {metadata?.phone && (
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Phone</h3>
                      <a 
                        href={`tel:${metadata.phone}`}
                        className="text-primary-600 hover:text-primary-700 transition-colors duration-200"
                      >
                        {metadata.phone}
                      </a>
                    </div>
                  </div>
                )}
                
                {metadata?.location && (
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Location</h3>
                      <p className="text-gray-600 leading-6">{metadata.location}</p>
                    </div>
                  </div>
                )}
                
                <div className="pt-6 border-t border-gray-200">
                  <SocialLinks aboutMe={aboutMe} />
                </div>
                
                {metadata?.available_for_work !== undefined && (
                  <div className="pt-6">
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                      metadata.available_for_work 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        metadata.available_for_work ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></div>
                      {metadata.available_for_work 
                        ? 'Available for new opportunities' 
                        : 'Currently not available for work'
                      }
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
      </div>
    </section>
  )
}