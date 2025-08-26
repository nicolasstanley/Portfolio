// app/projects/[slug]/page.tsx
import { getProject, getProjects } from '@/lib/cosmic'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import ProjectDetail from '@/components/ProjectDetail'
import Navigation from '@/components/Navigation'

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const projects = await getProjects()
  
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(slug)
  
  if (!project) {
    return {
      title: 'Project Not Found',
    }
  }
  
  return {
    title: `${project.metadata?.project_name || project.title} - Nicolas Ménard`,
    description: project.metadata?.description || `Portfolio project: ${project.title}`,
    openGraph: {
      title: `${project.metadata?.project_name || project.title} - Nicolas Ménard`,
      description: project.metadata?.description || `Portfolio project: ${project.title}`,
      images: project.metadata?.featured_image ? [
        {
          url: `${project.metadata.featured_image.imgix_url}?w=1200&h=630&fit=crop&auto=format,compress`,
          width: 1200,
          height: 630,
          alt: project.metadata.project_name || project.title,
        }
      ] : [],
    },
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = await getProject(slug)
  
  if (!project) {
    notFound()
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <ProjectDetail project={project} />
    </div>
  )
}