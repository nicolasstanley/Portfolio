'use client'

import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { useState, useEffect } from 'react'
import { Project, AboutMe } from '@/types'
import Lightbox from './Lightbox'
import ProjectCard from './ProjectCard'
import Contact from './Contact'
import { getProjects, getAboutMe } from '@/lib/cosmic'

interface ProjectDetailProps {
  project: Project
}

export default function ProjectDetail({ project }: ProjectDetailProps) {
  const { metadata } = project
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [otherProjects, setOtherProjects] = useState<Project[]>([])
  const [aboutMe, setAboutMe] = useState<AboutMe | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsData, aboutMeData] = await Promise.all([
          getProjects(),
          getAboutMe()
        ])
        
        // Filter out the current project and limit to 4 other projects for "More Projects" section
        const filtered = projectsData
          .filter(p => p.id !== project.id)
          .slice(0, 4)
        setOtherProjects(filtered)
        setAboutMe(aboutMeData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [project.id])

  const openLightbox = (images: string[], index: number) => {
    setGalleryImages(images)
    setCurrentImageIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length)
  }

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
  }

  return (
    <article className="pt-20 pb-16">
      <style jsx>{`
        .prose h4 {
          margin-top: 2.2rem !important;
        }
      `}</style>
      <div className="container">
        {/* Back button */}
        <nav className="mb-8" aria-label="Breadcrumb" data-aos="fade-up">
          <Link
            href="/"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md px-2 py-1"
            aria-label="Go back to portfolio home page"
            tabIndex={0}
          >
            ← Back
          </Link>
        </nav>
        
        <div>
          {/* Project header */}
          <div className="mb-12" data-aos="fade-up" data-aos-delay="200">
            <h1 className="font-bold text-gray-900 leading-tight" style={{ fontSize: '2rem', marginTop: '0', marginBottom: '1.6rem' }}>
              {metadata?.project_name || project.title}
            </h1>
            {metadata?.description_short && (
              <div 
                className="prose max-w-3xl text-base text-gray-600 mb-6" 
                style={{ lineHeight: '1.6', whiteSpace: 'pre-wrap' }}
                dangerouslySetInnerHTML={{ __html: metadata.description_short }}
              />
            )}
            
          </div>
        </div>
      </div>
      
      {/* Full width featured image */}
      {(metadata?.featured_image || metadata?.cloudinary_featured_image) && (
        <div style={{ marginTop: '2em', marginBottom: '3em' }} data-aos="fade-up" data-aos-delay="400">
          <img
            src={metadata.featured_image || metadata.cloudinary_featured_image}
            alt={`Featured image for ${metadata?.project_name || project.title} project`}
            width="800"
            height="400"
            className="w-full object-cover"
            style={{ height: '464px' }}
            loading="lazy"
          />
        </div>
      )}
      
      <div className="container">
        {/* Project details */}
        <div className="grid md:grid-cols-3 gap-12 mb-12 items-start" data-aos="fade-up" data-aos-delay="600">
          <div className="md:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: '6rem' }}>
            {metadata?.description && (
              <div 
                className="prose max-w-none text-gray-700"
                style={{ lineHeight: '1.6', whiteSpace: 'pre-wrap' }}
                dangerouslySetInnerHTML={{ __html: metadata.description }}
              />
            )}
            
            {metadata?.project_overview && (
              <div data-aos="fade-up" data-aos-delay="800">
                {(metadata?.project_overview_image || metadata?.project_overview_image_2) && (
                  <div style={{ marginTop: '2em', marginBottom: '3em' }}>
                    {metadata?.project_overview_image && (
                      <button
                        onClick={() => openLightbox([metadata.project_overview_image, metadata?.project_overview_image_2].filter((img): img is string => Boolean(img)), 0)}
                        className="w-full group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg mb-4"
                        aria-label={`View overview image for ${metadata?.project_name || project.title} in lightbox`}
                      >
                        <img
                          src={metadata.project_overview_image}
                          alt={`Overview image for ${metadata?.project_name || project.title}`}
                          width="800"
                          height="400"
                          className="w-full object-cover rounded-lg shadow-sm transition-transform duration-200 group-hover:scale-105 cursor-pointer"
                          loading="lazy"
                        />
                      </button>
                    )}
                    {metadata?.project_overview_image_2 && (
                      <button
                        onClick={() => openLightbox([metadata.project_overview_image, metadata?.project_overview_image_2].filter((img): img is string => Boolean(img)), metadata?.project_overview_image ? 1 : 0)}
                        className="w-full group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg"
                        aria-label={`View overview image 2 for ${metadata?.project_name || project.title} in lightbox`}
                      >
                        <img
                          src={metadata.project_overview_image_2}
                          alt={`Overview image 2 for ${metadata?.project_name || project.title}`}
                          width="800"
                          height="400"
                          className="w-full object-cover rounded-lg shadow-sm transition-transform duration-200 group-hover:scale-105 cursor-pointer"
                          loading="lazy"
                        />
                      </button>
                    )}
                  </div>
                )}
                <div className="prose max-w-none text-gray-700 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-black [&_h2]:mt-12 [&_h2]:mb-9 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-black [&_h3]:mt-8 [&_h3]:mb-6 [&_h4]:mb-5 [&_h5]:mt-4 [&_h5]:mb-4 [&_h6]:mt-4 [&_h6]:mb-3.5 [&_ul]:list-disc [&_ul]:ml-8 [&_ul]:mb-6 [&_li]:mb-1 [&_p]:text-base [&_p]:leading-relaxed [&_p+p]:mt-6 [&_strong]:font-medium" style={{ lineHeight: '1.6' }}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                  >
                    {metadata.project_overview}
                  </ReactMarkdown>
                </div>
              </div>
            )}
            
            {metadata?.challenge_and_research && (
              <div data-aos="fade-up" data-aos-delay="1000">
                {(metadata?.challenge_and_research_image || metadata?.challenge_and_research_image_2 || metadata?.challenge_and_research_image_3) && (
                  <div style={{ marginTop: '2em', marginBottom: '3em' }}>
                    {metadata?.challenge_and_research_image && (
                      <button
                        onClick={() => openLightbox([metadata.challenge_and_research_image, metadata?.challenge_and_research_image_2, metadata?.challenge_and_research_image_3].filter((img): img is string => Boolean(img)), 0)}
                        className="w-full group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg mb-4"
                        aria-label={`View challenge & research image for ${metadata?.project_name || project.title} in lightbox`}
                      >
                        <img
                          src={metadata.challenge_and_research_image}
                          alt={`Challenge & Research image for ${metadata?.project_name || project.title}`}
                          width="800"
                          height="400"
                          className="w-full object-cover rounded-lg shadow-sm transition-transform duration-200 group-hover:scale-105 cursor-pointer"
                          loading="lazy"
                        />
                      </button>
                    )}
                    {metadata?.challenge_and_research_image_2 && (
                      <button
                        onClick={() => { const imgs = [metadata.challenge_and_research_image, metadata?.challenge_and_research_image_2, metadata?.challenge_and_research_image_3].filter((img): img is string => Boolean(img)); openLightbox(imgs, imgs.indexOf(metadata.challenge_and_research_image_2!)) }}
                        className="w-full group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg mb-4"
                        aria-label={`View challenge & research image 2 for ${metadata?.project_name || project.title} in lightbox`}
                      >
                        <img
                          src={metadata.challenge_and_research_image_2}
                          alt={`Challenge & Research image 2 for ${metadata?.project_name || project.title}`}
                          width="800"
                          height="400"
                          className="w-full object-cover rounded-lg shadow-sm transition-transform duration-200 group-hover:scale-105 cursor-pointer"
                          loading="lazy"
                        />
                      </button>
                    )}
                    {metadata?.challenge_and_research_image_3 && (
                      <button
                        onClick={() => { const imgs = [metadata.challenge_and_research_image, metadata?.challenge_and_research_image_2, metadata?.challenge_and_research_image_3].filter((img): img is string => Boolean(img)); openLightbox(imgs, imgs.indexOf(metadata.challenge_and_research_image_3!)) }}
                        className="w-full group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg"
                        aria-label={`View challenge & research image 3 for ${metadata?.project_name || project.title} in lightbox`}
                      >
                        <img
                          src={metadata.challenge_and_research_image_3}
                          alt={`Challenge & Research image 3 for ${metadata?.project_name || project.title}`}
                          width="800"
                          height="400"
                          className="w-full object-cover rounded-lg shadow-sm transition-transform duration-200 group-hover:scale-105 cursor-pointer"
                          loading="lazy"
                        />
                      </button>
                    )}
                  </div>
                )}
                <div className="prose max-w-none text-gray-700 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-black [&_h2]:mt-12 [&_h2]:mb-9 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-black [&_h3]:mt-8 [&_h3]:mb-6 [&_h4]:mb-5 [&_h5]:mt-4 [&_h5]:mb-4 [&_h6]:mt-4 [&_h6]:mb-3.5 [&_ul]:list-disc [&_ul]:ml-8 [&_ul]:mb-6 [&_li]:mb-1 [&_p]:text-base [&_p]:leading-relaxed [&_p+p]:mt-6 [&_strong]:font-medium" style={{ lineHeight: '1.6' }}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                  >
                    {metadata.challenge_and_research}
                  </ReactMarkdown>
                </div>
              </div>
            )}
            
            {metadata?.design_process && (
              <div data-aos="fade-up" data-aos-delay="1200">
                {(metadata?.design_process_image || metadata?.design_process_image_2 || metadata?.design_process_image_3) && (
                  <div style={{ marginTop: '2em', marginBottom: '3em' }}>
                    {metadata?.design_process_image && (
                      <button
                        onClick={() => openLightbox([metadata.design_process_image, metadata?.design_process_image_2, metadata?.design_process_image_3].filter((img): img is string => Boolean(img)), 0)}
                        className="w-full group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg mb-4"
                        aria-label={`View design process image for ${metadata?.project_name || project.title} in lightbox`}
                      >
                        <img
                          src={metadata.design_process_image}
                          alt={`Design Process image for ${metadata?.project_name || project.title}`}
                          width="800"
                          height="400"
                          className="w-full object-cover rounded-lg shadow-sm transition-transform duration-200 group-hover:scale-105 cursor-pointer"
                          loading="lazy"
                        />
                      </button>
                    )}
                    {metadata?.design_process_image_2 && (
                      <button
                        onClick={() => { const imgs = [metadata.design_process_image, metadata?.design_process_image_2, metadata?.design_process_image_3].filter((img): img is string => Boolean(img)); openLightbox(imgs, imgs.indexOf(metadata.design_process_image_2!)) }}
                        className="w-full group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg mb-4"
                        aria-label={`View design process image 2 for ${metadata?.project_name || project.title} in lightbox`}
                      >
                        <img
                          src={metadata.design_process_image_2}
                          alt={`Design Process image 2 for ${metadata?.project_name || project.title}`}
                          width="800"
                          height="400"
                          className="w-full object-cover rounded-lg shadow-sm transition-transform duration-200 group-hover:scale-105 cursor-pointer"
                          loading="lazy"
                        />
                      </button>
                    )}
                    {metadata?.design_process_image_3 && (
                      <button
                        onClick={() => { const imgs = [metadata.design_process_image, metadata?.design_process_image_2, metadata?.design_process_image_3].filter((img): img is string => Boolean(img)); openLightbox(imgs, imgs.indexOf(metadata.design_process_image_3!)) }}
                        className="w-full group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg"
                        aria-label={`View design process image 3 for ${metadata?.project_name || project.title} in lightbox`}
                      >
                        <img
                          src={metadata.design_process_image_3}
                          alt={`Design Process image 3 for ${metadata?.project_name || project.title}`}
                          width="800"
                          height="400"
                          className="w-full object-cover rounded-lg shadow-sm transition-transform duration-200 group-hover:scale-105 cursor-pointer"
                          loading="lazy"
                        />
                      </button>
                    )}
                  </div>
                )}
                <div className="prose max-w-none text-gray-700 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-black [&_h2]:mt-12 [&_h2]:mb-9 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-black [&_h3]:mt-8 [&_h3]:mb-6 [&_h4]:mb-5 [&_h5]:mt-4 [&_h5]:mb-4 [&_h6]:mt-4 [&_h6]:mb-3.5 [&_ul]:list-disc [&_ul]:ml-8 [&_ul]:mb-6 [&_li]:mb-1 [&_p]:text-base [&_p]:leading-relaxed [&_p+p]:mt-6 [&_strong]:font-medium" style={{ lineHeight: '1.6' }}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                  >
                    {metadata.design_process}
                  </ReactMarkdown>
                </div>
              </div>
            )}
            
            {metadata?.solution && (
              <div data-aos="fade-up" data-aos-delay="1400">
                {(metadata?.solution_image || metadata?.solution_image_2 || metadata?.solution_image_3) && (
                  <div style={{ marginTop: '2em', marginBottom: '3em' }}>
                    {metadata?.solution_image && (
                      <button
                        onClick={() => openLightbox([metadata.solution_image, metadata?.solution_image_2, metadata?.solution_image_3].filter((img): img is string => Boolean(img)), 0)}
                        className="w-full group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg mb-4"
                        aria-label={`View solution image for ${metadata?.project_name || project.title} in lightbox`}
                      >
                        <img
                          src={metadata.solution_image}
                          alt={`Solution image for ${metadata?.project_name || project.title}`}
                          width="800"
                          height="400"
                          className="w-full object-cover rounded-lg shadow-sm transition-transform duration-200 group-hover:scale-105 cursor-pointer"
                          loading="lazy"
                        />
                      </button>
                    )}
                    {metadata?.solution_image_2 && (
                      <button
                        onClick={() => { const imgs = [metadata.solution_image, metadata?.solution_image_2, metadata?.solution_image_3].filter((img): img is string => Boolean(img)); openLightbox(imgs, imgs.indexOf(metadata.solution_image_2!)) }}
                        className="w-full group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg mb-4"
                        aria-label={`View solution image 2 for ${metadata?.project_name || project.title} in lightbox`}
                      >
                        <img
                          src={metadata.solution_image_2}
                          alt={`Solution image 2 for ${metadata?.project_name || project.title}`}
                          width="800"
                          height="400"
                          className="w-full object-cover rounded-lg shadow-sm transition-transform duration-200 group-hover:scale-105 cursor-pointer"
                          loading="lazy"
                        />
                      </button>
                    )}
                    {metadata?.solution_image_3 && (
                      <button
                        onClick={() => { const imgs = [metadata.solution_image, metadata?.solution_image_2, metadata?.solution_image_3].filter((img): img is string => Boolean(img)); openLightbox(imgs, imgs.indexOf(metadata.solution_image_3!)) }}
                        className="w-full group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg"
                        aria-label={`View solution image 3 for ${metadata?.project_name || project.title} in lightbox`}
                      >
                        <img
                          src={metadata.solution_image_3}
                          alt={`Solution image 3 for ${metadata?.project_name || project.title}`}
                          width="800"
                          height="400"
                          className="w-full object-cover rounded-lg shadow-sm transition-transform duration-200 group-hover:scale-105 cursor-pointer"
                          loading="lazy"
                        />
                      </button>
                    )}
                  </div>
                )}
                <div className="prose max-w-none text-gray-700 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-black [&_h2]:mt-12 [&_h2]:mb-9 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-black [&_h3]:mt-8 [&_h3]:mb-6 [&_h4]:mb-5 [&_h5]:mt-4 [&_h5]:mb-4 [&_h6]:mt-4 [&_h6]:mb-3.5 [&_ul]:list-disc [&_ul]:ml-8 [&_ul]:mb-6 [&_li]:mb-1 [&_p]:text-base [&_p]:leading-relaxed [&_p+p]:mt-6 [&_strong]:font-medium" style={{ lineHeight: '1.6' }}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                  >
                    {metadata.solution}
                  </ReactMarkdown>
                </div>
              </div>
            )}
            
            {metadata?.implementation_and_results && (
              <div data-aos="fade-up" data-aos-delay="1600">
                {(metadata?.implementation_and_results_image || metadata?.implementation_and_results_image_2) && (
                  <div style={{ marginTop: '2em', marginBottom: '3em' }}>
                    {metadata?.implementation_and_results_image && (
                      <button
                        onClick={() => openLightbox([metadata.implementation_and_results_image, metadata?.implementation_and_results_image_2].filter((img): img is string => Boolean(img)), 0)}
                        className="w-full group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg mb-4"
                        aria-label={`View implementation & results image for ${metadata?.project_name || project.title} in lightbox`}
                      >
                        <img
                          src={metadata.implementation_and_results_image}
                          alt={`Implementation & Results image for ${metadata?.project_name || project.title}`}
                          width="800"
                          height="400"
                          className="w-full object-cover rounded-lg shadow-sm transition-transform duration-200 group-hover:scale-105 cursor-pointer"
                          loading="lazy"
                        />
                      </button>
                    )}
                    {metadata?.implementation_and_results_image_2 && (
                      <button
                        onClick={() => openLightbox([metadata.implementation_and_results_image, metadata?.implementation_and_results_image_2].filter((img): img is string => Boolean(img)), metadata?.implementation_and_results_image ? 1 : 0)}
                        className="w-full group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg"
                        aria-label={`View implementation & results image 2 for ${metadata?.project_name || project.title} in lightbox`}
                      >
                        <img
                          src={metadata.implementation_and_results_image_2}
                          alt={`Implementation & Results image 2 for ${metadata?.project_name || project.title}`}
                          width="800"
                          height="400"
                          className="w-full object-cover rounded-lg shadow-sm transition-transform duration-200 group-hover:scale-105 cursor-pointer"
                          loading="lazy"
                        />
                      </button>
                    )}
                  </div>
                )}
                <div className="prose max-w-none text-gray-700 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-black [&_h2]:mt-12 [&_h2]:mb-9 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-black [&_h3]:mt-8 [&_h3]:mb-6 [&_h4]:mb-5 [&_h5]:mt-4 [&_h5]:mb-4 [&_h6]:mt-4 [&_h6]:mb-3.5 [&_ul]:list-disc [&_ul]:ml-8 [&_ul]:mb-6 [&_li]:mb-1 [&_p]:text-base [&_p]:leading-relaxed [&_p+p]:mt-6 [&_strong]:font-medium" style={{ lineHeight: '1.6' }}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                  >
                    {metadata.implementation_and_results}
                  </ReactMarkdown>
                </div>
              </div>
            )}
            
            {metadata?.reflection && (
              <div data-aos="fade-up" data-aos-delay="1800">
                {(metadata?.reflection_image || metadata?.reflection_image_2) && (
                  <div style={{ marginTop: '2em', marginBottom: '3em' }}>
                    {metadata?.reflection_image && (
                      <button
                        onClick={() => openLightbox([metadata.reflection_image, metadata?.reflection_image_2].filter((img): img is string => Boolean(img)), 0)}
                        className="w-full group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg mb-4"
                        aria-label={`View reflection image for ${metadata?.project_name || project.title} in lightbox`}
                      >
                        <img
                          src={metadata.reflection_image}
                          alt={`Reflection image for ${metadata?.project_name || project.title}`}
                          width="800"
                          height="400"
                          className="w-full object-cover rounded-lg shadow-sm transition-transform duration-200 group-hover:scale-105 cursor-pointer"
                          loading="lazy"
                        />
                      </button>
                    )}
                    {metadata?.reflection_image_2 && (
                      <button
                        onClick={() => openLightbox([metadata.reflection_image, metadata?.reflection_image_2].filter((img): img is string => Boolean(img)), metadata?.reflection_image ? 1 : 0)}
                        className="w-full group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg"
                        aria-label={`View reflection image 2 for ${metadata?.project_name || project.title} in lightbox`}
                      >
                        <img
                          src={metadata.reflection_image_2}
                          alt={`Reflection image 2 for ${metadata?.project_name || project.title}`}
                          width="800"
                          height="400"
                          className="w-full object-cover rounded-lg shadow-sm transition-transform duration-200 group-hover:scale-105 cursor-pointer"
                          loading="lazy"
                        />
                      </button>
                    )}
                  </div>
                )}
                <div className="prose max-w-none text-gray-700 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-black [&_h2]:mt-12 [&_h2]:mb-9 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-black [&_h3]:mt-8 [&_h3]:mb-6 [&_h4]:mb-5 [&_h5]:mt-4 [&_h5]:mb-4 [&_h6]:mt-4 [&_h6]:mb-3.5 [&_ul]:list-disc [&_ul]:ml-8 [&_ul]:mb-6 [&_li]:mb-1 [&_p]:text-base [&_p]:leading-relaxed [&_p+p]:mt-6 [&_strong]:font-medium" style={{ lineHeight: '1.6' }}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                  >
                    {metadata.reflection}
                  </ReactMarkdown>
                </div>
              </div>
            )}
            
            {/* Fallback sections for backwards compatibility */}
            {metadata?.challenge && !metadata?.challenge_and_research && (
              <div data-aos="fade-up" data-aos-delay="2000">
                <p className="text-gray-700 text-base" style={{ lineHeight: '1.6' }}>
                  {metadata.challenge}
                </p>
              </div>
            )}
            
            {metadata?.solution && !metadata?.implementation_and_results && (
              <div data-aos="fade-up" data-aos-delay="2200">
                {metadata?.solution_image && (
                  <div style={{ marginTop: '2em', marginBottom: '3em' }}>
                    <button
                      onClick={() => openLightbox([metadata.solution_image].filter((img): img is string => Boolean(img)), 0)}
                      className="w-full group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg"
                      aria-label={`View solution image for ${metadata?.project_name || project.title} in lightbox`}
                    >
                      <img
                        src={metadata.solution_image}
                        alt={`Solution image for ${metadata?.project_name || project.title}`}
                        width="800"
                        height="400"
                        className="w-full object-cover rounded-lg shadow-sm transition-transform duration-200 group-hover:scale-105 cursor-pointer"
                        loading="lazy"
                      />
                    </button>
                  </div>
                )}
                <div className="prose max-w-none text-gray-700 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-black [&_h2]:mt-12 [&_h2]:mb-9 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-black [&_h3]:mt-8 [&_h3]:mb-6 [&_h4]:mb-5 [&_h5]:mt-4 [&_h5]:mb-4 [&_h6]:mt-4 [&_h6]:mb-3.5 [&_ul]:list-disc [&_ul]:ml-8 [&_ul]:mb-6 [&_li]:mb-1 [&_p]:text-base [&_p]:leading-relaxed [&_p+p]:mt-6 [&_strong]:font-medium" style={{ lineHeight: '1.6' }}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                  >
                    {metadata.solution}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-8">
            {(metadata?.company || metadata?.client_company) && (
              <div>
                <h5 className="font-semibold text-gray-900" style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Company</h5>
                <ul className="space-y-2" role="list">
                  <li className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded mr-2 mb-2 cursor-default">
                    {metadata?.company || metadata?.client_company}
                  </li>
                </ul>
              </div>
            )}
            
            {metadata?.project_duration && (
              <div>
                <h5 className="font-semibold text-gray-900" style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Duration</h5>
                <ul className="space-y-2" role="list">
                  <li className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded mr-2 mb-2 cursor-default">
                    {metadata.project_duration}
                  </li>
                </ul>
              </div>
            )}
            
            {metadata?.project_type && (
              <div>
                <h5 className="font-semibold text-gray-900" style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Project Type</h5>
                <ul className="space-y-2" role="list">
                  {Array.isArray(metadata.project_type) 
                    ? metadata.project_type.map((type, index) => (
                        <li
                          key={index}
                          className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded mr-2 mb-2 cursor-default"
                        >
                          {type}
                        </li>
                      ))
                    : <li className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded mr-2 mb-2 cursor-default">
                        {typeof metadata.project_type === 'object' && metadata.project_type !== null && 'value' in metadata.project_type
                          ? metadata.project_type.value 
                          : String(metadata.project_type)
                        }
                      </li>
                  }
                </ul>
              </div>
            )}
            
            {metadata?.tools_used && metadata.tools_used.length > 0 && (
              <div>
                <h5 className="font-semibold text-gray-900" style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Tools Used</h5>
                <ul className="space-y-2" role="list">
                  {metadata.tools_used.map((tool, index) => (
                    <li
                      key={index}
                      className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded mr-2 mb-2 cursor-default"
                    >
                      {tool}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {(metadata?.live_url || metadata?.live_url_2 || metadata?.case_study_url) && (
              <div>
                <h5 className="font-semibold text-gray-900" style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Links</h5>
                <div className="space-y-3">
                  {metadata?.live_url && (
                    <a
                      href={metadata.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full btn-primary text-center"
                      aria-label={`View live project: ${metadata?.project_name || project.title} (opens in new tab)`}
                    >
                      {metadata.live_url_text || 'View Live Project →'}
                    </a>
                  )}
                  
                  {metadata?.live_url_2 && (
                    <a
                      href={metadata.live_url_2}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full btn-primary text-center"
                      aria-label={`View additional live project link: ${metadata?.project_name || project.title} (opens in new tab)`}
                    >
                      {metadata.live_url_2_text || 'View Live Project 2 →'}
                    </a>
                  )}
                  
                  {metadata?.case_study_url && (
                    <a
                      href={metadata.case_study_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full btn-secondary text-center"
                      aria-label={`Read detailed case study for ${metadata?.project_name || project.title} (opens in new tab)`}
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
        {(() => {
          // Collect all individual image fields (image_1, image_2, etc.)
          const individualImages: string[] = [];
          for (let i = 1; i <= 20; i++) {
            const imageKey = `image_${i}` as keyof typeof metadata;
            const imageUrl = metadata?.[imageKey] as string | undefined;
            if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim()) {
              individualImages.push(imageUrl);
            }
          }
          
          // Collect images that are already shown in content sections above to exclude them from gallery
          const contentSectionImages: string[] = [];
          if (metadata) {
            // Featured image
            if (metadata.featured_image) contentSectionImages.push(metadata.featured_image);
            if (metadata.cloudinary_featured_image) contentSectionImages.push(metadata.cloudinary_featured_image);
            
            // Project overview images
            if (metadata.project_overview_image) contentSectionImages.push(metadata.project_overview_image);
            if (metadata.project_overview_image_2) contentSectionImages.push(metadata.project_overview_image_2);
            
            // Challenge and research images
            if (metadata.challenge_and_research_image) contentSectionImages.push(metadata.challenge_and_research_image);
            if (metadata.challenge_and_research_image_2) contentSectionImages.push(metadata.challenge_and_research_image_2);
            if (metadata.challenge_and_research_image_3) contentSectionImages.push(metadata.challenge_and_research_image_3);
            
            // Design process images
            if (metadata.design_process_image) contentSectionImages.push(metadata.design_process_image);
            if (metadata.design_process_image_2) contentSectionImages.push(metadata.design_process_image_2);
            if (metadata.design_process_image_3) contentSectionImages.push(metadata.design_process_image_3);
            
            // Solution images
            if (metadata.solution_image) contentSectionImages.push(metadata.solution_image);
            if (metadata.solution_image_2) contentSectionImages.push(metadata.solution_image_2);
            if (metadata.solution_image_3) contentSectionImages.push(metadata.solution_image_3);
            
            // Implementation and results images
            if (metadata.implementation_and_results_image) contentSectionImages.push(metadata.implementation_and_results_image);
            if (metadata.implementation_and_results_image_2) contentSectionImages.push(metadata.implementation_and_results_image_2);
            
            // Reflection images
            if (metadata.reflection_image) contentSectionImages.push(metadata.reflection_image);
            if (metadata.reflection_image_2) contentSectionImages.push(metadata.reflection_image_2);
          }
          
          // Filter individual images to exclude those already shown in content sections
          const filteredIndividualImages = individualImages.filter(imageUrl => 
            !contentSectionImages.includes(imageUrl)
          );
          
          // Use only the filtered individual images (numbered images not shown in content sections)
          const allImages = Array.from(new Set(filteredIndividualImages));
          
          const hasCloudinaryGallery = metadata?.cloudinary_gallery_images && JSON.parse(metadata.cloudinary_gallery_images).length > 0;
          const hasOriginalGallery = metadata?.project_gallery && metadata.project_gallery.length > 0;
          const hasIndividualImages = filteredIndividualImages.length > 0;
          const hasAnyImages = allImages.length > 0;
          
          return (hasCloudinaryGallery || hasOriginalGallery || hasIndividualImages) && (
            <div>
              <div className="space-y-24" role="list" aria-label="Project gallery images">
                {hasAnyImages ? (
                  // Use all collected images (individual + _image metafields)
                  allImages.map((imageUrl: string, index: number) => {
                    // Check if this is a video file
                    const isVideo = imageUrl.toLowerCase().match(/\.(mp4|webm|ogg|mov)(\?.*)?$/);
                    
                    return (
                      <div key={index} role="listitem">
                        {isVideo ? (
                          // Render video
                          <div className="w-full">
                            <video
                              src={imageUrl}
                              className="w-full h-auto object-cover rounded-lg shadow-sm"
                              autoPlay
                              loop
                              muted
                              playsInline
                              preload="metadata"
                              aria-label={`${metadata?.project_name || project.title} project video ${index + 1}`}
                            />
                          </div>
                        ) : (
                          // Render image with lightbox
                          <button
                            onClick={() => openLightbox(allImages.filter(url => !url.toLowerCase().match(/\.(mp4|webm|ogg|mov)(\?.*)?$/)), allImages.filter(url => !url.toLowerCase().match(/\.(mp4|webm|ogg|mov)(\?.*)?$/)).indexOf(imageUrl))}
                            className="w-full group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg"
                            aria-label={`View ${metadata?.project_name || project.title} screenshot ${index + 1} in lightbox`}
                          >
                            <img
                              src={imageUrl}
                              alt={`${metadata?.project_name || project.title} project screenshot ${index + 1}`}
                              className="w-full h-auto object-cover rounded-lg shadow-sm transition-transform duration-200 group-hover:scale-105 cursor-pointer"
                              loading="lazy"
                            />
                          </button>
                        )}
                      </div>
                    );
                  })
                ) : metadata?.cloudinary_gallery_images ? (
                  // Use Cloudinary JSON array if available
                  (() => {
                    const cloudinaryImages = JSON.parse(metadata.cloudinary_gallery_images);
                    return cloudinaryImages.map((imageUrl: string, index: number) => (
                      <div key={index} role="listitem">
                        <button
                          onClick={() => openLightbox(cloudinaryImages, index)}
                          className="w-full group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg"
                          aria-label={`View ${metadata?.project_name || project.title} screenshot ${index + 1} in lightbox`}
                        >
                          <img
                            src={imageUrl}
                            alt={`${metadata?.project_name || project.title} project screenshot ${index + 1}`}
                            width="400"
                            height="250"
                            className="w-full h-64 object-cover rounded-lg shadow-sm transition-transform duration-200 group-hover:scale-105 cursor-pointer"
                            loading="lazy"
                          />
                        </button>
                      </div>
                    ));
                  })()
                ) : (
                  // Fallback to original gallery
                  (() => {
                    const originalImages = metadata.project_gallery?.map(img => `${img.imgix_url}?w=800&h=500&fit=crop&auto=format,compress`) || [];
                    return metadata.project_gallery?.map((image, index) => (
                      <div key={index} role="listitem">
                        <button
                          onClick={() => openLightbox(originalImages, index)}
                          className="w-full group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg"
                          aria-label={`View ${metadata?.project_name || project.title} screenshot ${index + 1} in lightbox`}
                        >
                          <img
                            src={`${image.imgix_url}?w=800&h=500&fit=crop&auto=format,compress`}
                            alt={`${metadata?.project_name || project.title} project screenshot ${index + 1}`}
                            width="400"
                            height="250"
                            className="w-full h-64 object-cover rounded-lg shadow-sm transition-transform duration-200 group-hover:scale-105 cursor-pointer"
                            loading="lazy"
                          />
                        </button>
                      </div>
                    ));
                  })()
                )}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Back to Top Button */}
      <div className="container mt-16 mb-8">
        <div className="flex justify-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-black hover:bg-gray-800 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            aria-label="Scroll back to top of page"
          >
            Back to Top ↑
          </button>
        </div>
      </div>

      {/* More Projects Section */}
      {otherProjects.length > 0 && (
        <section className="bg-white py-16 mt-16">
          <div className="container">
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4 leading-tight">
                More Projects
              </h2>
              <p className="text-lg text-gray-600">
                Explore more of my recent design work
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8" role="list" aria-label="More portfolio projects">
              {otherProjects.map((otherProject) => (
                <div key={otherProject.id} role="listitem">
                  <ProjectCard project={otherProject} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Contact aboutMe={aboutMe} />

      {/* Lightbox */}
      <Lightbox
        images={galleryImages}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        onNext={nextImage}
        onPrevious={previousImage}
        projectTitle={metadata?.project_name || project.title}
      />
    </article>
  )
}