import { Project } from '@/types'
import ProjectCard from '@/components/ProjectCard'

interface ProjectsProps {
  projects: Project[]
}

export default function Projects({ projects }: ProjectsProps) {

  return (
    <section id="work" className="section bg-gray-50" aria-labelledby="work-heading">
      <div className="container">
        <div className="mb-16" data-aos="fade-up">
          <h2 id="work-heading" className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4 leading-tight">
            Work
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl">
            Here are some of my recent design projects that showcase my approach to solving complex user experience challenges.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8" role="list" aria-label="Portfolio projects">
          {projects && projects.length > 0 ? (
            projects.map((project, index) => (
              <div key={project.id} role="listitem" data-aos="fade-up" data-aos-delay="200">
                <ProjectCard project={project} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600">Work projects will appear here soon.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}