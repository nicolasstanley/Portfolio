import { getAboutMe, getWorkExperience, getSkills, getProjects } from '@/lib/cosmic'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Projects from '@/components/Projects'
import Experience from '@/components/Experience'
import Skills from '@/components/Skills'
import Contact from '@/components/Contact'
import Navigation from '@/components/Navigation'

export default async function HomePage() {
  // Fetch all data in parallel
  const [aboutMe, workExperience, skills, projects] = await Promise.all([
    getAboutMe(),
    getWorkExperience(),
    getSkills(),
    getProjects()
  ])

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {aboutMe && (
        <>
          <Hero aboutMe={aboutMe} />
          <About aboutMe={aboutMe} />
        </>
      )}
      
      {projects.length > 0 && (
        <Projects projects={projects} />
      )}
      
      {workExperience.length > 0 && (
        <Experience experiences={workExperience} />
      )}
      
      {skills.length > 0 && (
        <Skills skills={skills} />
      )}
      
      {aboutMe && (
        <Contact aboutMe={aboutMe} />
      )}
    </div>
  )
}