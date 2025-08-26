import { WorkExperience } from '@/types'

interface ExperienceCardProps {
  experience: WorkExperience
  isLast: boolean
}

export default function ExperienceCard({ experience, isLast }: ExperienceCardProps) {
  const { metadata } = experience

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Present'
    
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      })
    } catch {
      return dateString
    }
  }

  return (
    <div className="relative flex items-start">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-6 top-16 w-0.5 h-full bg-gray-200"></div>
      )}
      
      {/* Timeline dot */}
      <div className="flex-shrink-0 w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mr-8 relative z-10">
        <div className="w-4 h-4 bg-white rounded-full"></div>
      </div>
      
      {/* Content */}
      <div className="flex-1 card">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">
              {metadata?.job_title}
            </h3>
            <h4 className="text-lg font-medium text-primary-600 mb-2">
              {metadata?.company}
            </h4>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              {metadata?.employment_type && (
                <span className="px-2 py-1 bg-gray-100 rounded">
                  {metadata.employment_type.value}
                </span>
              )}
              
              <span>
                {formatDate(metadata?.start_date)} - {formatDate(metadata?.end_date)}
              </span>
              
              {metadata?.location && (
                <span>📍 {metadata.location}</span>
              )}
              
              {metadata?.current_position && (
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                  Current
                </span>
              )}
            </div>
          </div>
          
          {metadata?.company_logo && (
            <img
              src={`${metadata.company_logo.imgix_url}?w=120&h=120&fit=crop&auto=format,compress`}
              alt={`${metadata?.company} logo`}
              width="60"
              height="60"
              className="w-12 h-12 object-contain rounded-lg ml-4"
            />
          )}
        </div>
        
        {metadata?.job_description && (
          <div 
            className="prose max-w-none text-gray-700 mb-4"
            dangerouslySetInnerHTML={{ __html: metadata.job_description }}
          />
        )}
        
        {metadata?.key_achievements && (
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Key Achievements:</h5>
            <div 
              className="prose max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: metadata.key_achievements }}
            />
          </div>
        )}
      </div>
    </div>
  )
}