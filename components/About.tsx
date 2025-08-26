import { AboutMe } from '@/types'

interface AboutProps {
  aboutMe: AboutMe
}

export default function About({ aboutMe }: AboutProps) {
  const { metadata } = aboutMe

  return (
    <section id="about" className="section bg-white">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              About Me
            </h2>
            <div className="w-20 h-1 bg-primary-600 mx-auto"></div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              {metadata?.bio && (
                <div 
                  className="prose prose-lg max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: metadata.bio }}
                />
              )}
              
              <div className="grid grid-cols-2 gap-6 mt-8 pt-8 border-t border-gray-200">
                {metadata?.years_experience && (
                  <div>
                    <h3 className="text-2xl font-bold text-primary-600">
                      {metadata.years_experience}+
                    </h3>
                    <p className="text-gray-600">Years Experience</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="animate-slide-up">
              {metadata?.profile_image && (
                <img
                  src={`${metadata.profile_image.imgix_url}?w=800&h=600&fit=crop&auto=format,compress`}
                  alt={metadata?.full_name || 'About me'}
                  width="400"
                  height="300"
                  className="w-full h-80 object-cover rounded-lg shadow-lg"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}