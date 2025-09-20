import Link from 'next/link'
import { Project } from '@/types'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { metadata } = project
  
  // Use thumbnail metafield, then featured image, or fallback to Unsplash
  const thumbnailUrl = metadata?.thumbnail
  const isVideo = thumbnailUrl && typeof thumbnailUrl === 'string' && thumbnailUrl.toLowerCase().match(/\.(mp4|webm|ogg|mov)(\?.*)?$/)
  
  const backgroundImage = thumbnailUrl || metadata?.featured_image?.imgix_url 
    ? `${thumbnailUrl || metadata.featured_image.imgix_url}?w=800&h=600&fit=crop&auto=format,compress`
    : `https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=600&fit=crop&auto=format,compress&q=80`

  return (
    <Link 
      href={`/work/${project.slug}`} 
      className="block group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-50 rounded-2xl transition-all duration-200"
      aria-label={`View project: ${metadata?.project_name || project.title}`}
      tabIndex={0}
    >
      <article className="relative h-[320px] rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2" role="article">
        {/* Video background or image fallback */}
        {isVideo ? (
          <>
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              aria-label={`Background video for ${metadata?.project_name || project.title} project`}
            >
              <source src={thumbnailUrl} type="video/mp4" />
            </video>
            {/* Video overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/60" aria-hidden="true"></div>
          </>
        ) : (
          <div 
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%), url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            role="img"
            aria-label={`Background image for ${metadata?.project_name || project.title} project`}
          ></div>
        )}
        
        {/* Hover overlay - behind content */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" aria-hidden="true"></div>
        
        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col justify-center p-8 text-white z-20">
          <div className="max-w-[576px]">
            {/* Project type badges */}
            {metadata?.project_type && (
              <div className="mb-4 flex flex-wrap gap-2">
                {Array.isArray(metadata.project_type) 
                  ? metadata.project_type.map((type, index) => (
                      <span key={index} className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full border border-white/30">
                        {type}
                      </span>
                    ))
                  : <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full border border-white/30">
                      {typeof metadata.project_type === 'object' && metadata.project_type !== null && 'value' in metadata.project_type
                        ? metadata.project_type.value 
                        : String(metadata.project_type)
                      }
                    </span>
                }
              </div>
            )}
            
            {/* Title */}
            <h2 className="text-xl font-medium mb-3 text-white leading-tight">
              {metadata?.project_name || project.title}
            </h2>
            
            {/* Description */}
            {metadata?.description_short && (
              <p className="text-base text-white mb-4 line-clamp-1 leading-6">
                {metadata.description_short}
              </p>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}