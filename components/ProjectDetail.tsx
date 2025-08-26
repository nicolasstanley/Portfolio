import Link from 'next/link'
import { Project } from '@/types'

interface ProjectDetailProps {
  project: Project
}

export default function ProjectDetail({ project }: ProjectDetailProps) {
  const { metadata } = project

  return (
    <div className="pt-20 pb-16">
      <div className="container">
        {/* Back button */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
          >
            ← Back to Portfolio
          </Link>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {/* Project header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {metadata?.project_name || project.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600 mb-8">
              {metadata?.project_type && (
                <span className="px-3 py-1 bg-primary-100 text-primary-700 font-medium rounded-full">
                  {metadata.project_type.value}
                </span>
              )}
              
              {metadata?.client_company && (
                <span>Client: {metadata.client_company}</span>
              )}
              
              {metadata?.project_duration && (
                <span>Duration: {metadata.project_duration}</span>
              )}
            </div>
            
            {metadata?.featured_image && (
              <img
                src={`${metadata.featured_image.imgix_url}?w=1200&h=600&fit=crop&auto=format,compress`}
                alt={metadata?.project_name || project.title}
                width="600"
                height="300"
                className="w-full h-80 md:h-96 object-cover rounded-lg shadow-lg mb-12"
              />
            )}
          </div>
          
          {/* Project details */}
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div className="md:col-span-2 space-y-8">
              {metadata?.description && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Project Overview</h2>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {metadata.description}
                  </p>
                </div>
              )}
              
              {metadata?.challenge && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">The Challenge</h2>
                  <p className="text-gray-700 leading-relaxed">
                    {metadata.challenge}
                  </p>
                </div>
              )}
              
              {metadata?.solution && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">The Solution</h2>
                  <div 
                    className="prose max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: metadata.solution }}
                  />
                </div>
              )}
            </div>
            
            {/* Sidebar */}
            <div className="space-y-8">
              {metadata?.tools_used && metadata.tools_used.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tools Used</h3>
                  <div className="space-y-2">
                    {metadata.tools_used.map((tool, index) => (
                      <span
                        key={index}
                        className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded mr-2 mb-2"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {(metadata?.live_url || metadata?.case_study_url) && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Links</h3>
                  <div className="space-y-3">
                    {metadata?.live_url && (
                      <a
                        href={metadata.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full btn-primary text-center"
                      >
                        View Live Project →
                      </a>
                    )}
                    
                    {metadata?.case_study_url && (
                      <a
                        href={metadata.case_study_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full btn-secondary text-center"
                      >
                        Read Case Study →
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Project gallery */}
          {metadata?.project_gallery && metadata.project_gallery.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-8">Project Gallery</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {metadata.project_gallery.map((image, index) => (
                  <img
                    key={index}
                    src={`${image.imgix_url}?w=800&h=500&fit=crop&auto=format,compress`}
                    alt={`${metadata?.project_name} gallery image ${index + 1}`}
                    width="400"
                    height="250"
                    className="w-full h-64 object-cover rounded-lg shadow-sm"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}