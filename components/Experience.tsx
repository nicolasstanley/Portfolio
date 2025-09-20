import { WorkExperience } from '@/types'
import ExperienceCard from '@/components/ExperienceCard'

interface ExperienceProps {
  experiences: WorkExperience[]
}

export default function Experience({ experiences }: ExperienceProps) {
  if (!experiences || experiences.length === 0) {
    return null
  }

  return (
    <section id="experience" className="section bg-white" aria-labelledby="experience-heading">
      <div className="container">
        <div className="mb-16">
          <h2 id="experience-heading" className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4 leading-tight">
            Experience
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl">
            My professional journey in UX design, from junior roles to senior positions in leading companies.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8" role="list" aria-label="Work experience timeline">
            {experiences.map((experience, index) => (
              <div key={experience.id} role="listitem">
                <ExperienceCard 
                  experience={experience} 
                  isLast={index === experiences.length - 1}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}