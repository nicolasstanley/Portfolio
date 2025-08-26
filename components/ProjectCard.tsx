import Link from 'next/link'
import { Project } from '@/types'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { metadata } = project

  return (
    <div className="card group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      {metadata?.featured_image && (
        <div className="mb-6 overflow-hidden rounded-lg">
          <img
            src={`${metadata.featured_image.imgix_url}?w=600&h=400&fit=crop&auto=format,compress`}
            alt={metadata?.project_name || project.title}
            width="300"
            height="200"
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <div className="flex items-center gap-2 mb-3">
        {metadata?.project_type && (
          <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
            {metadata.project_type.value}
          </span>
        )}
        {metadata?.project_duration && (
          <span className="text-sm text-gray-500">
            {metadata.project_duration}
          </span>
        )}
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors duration-200">
        {metadata?.project_name || project.title}
      </h3>
      
      {metadata?.description && (
        <p className="text-gray-600 mb-4 line-clamp-3">
          {metadata.description}
        </p>
      )}
      
      {metadata?.tools_used && metadata.tools_used.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {metadata.tools_used.slice(0, 3).map((tool, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
            >
              {tool}
            </span>
          ))}
          {metadata.tools_used.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              +{metadata.tools_used.length - 3} more
            </span>
          )}
        </div>
      )}
      
      <Link
        href={`/projects/${project.slug}`}
        className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium group-hover:underline transition-colors duration-200"
      >
        View Case Study →
      </Link>
    </div>
  )
}