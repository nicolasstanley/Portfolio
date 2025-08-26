import { Skill } from '@/types'
import SkillCard from '@/components/SkillCard'

interface SkillsProps {
  skills: Skill[]
}

export default function Skills({ skills }: SkillsProps) {
  if (!skills || skills.length === 0) {
    return null
  }

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    const category = skill.metadata?.skill_category?.value || 'Other'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  // Define category order for consistent display
  const categoryOrder = [
    'Design Tools',
    'Research Methods',
    'Prototyping',
    'Technical',
    'Soft Skills'
  ]

  return (
    <section id="skills" className="section bg-gray-50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Skills & Expertise
          </h2>
          <div className="w-20 h-1 bg-primary-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A comprehensive overview of my technical skills, design tools, and methodologies.
          </p>
        </div>
        
        <div className="space-y-12">
          {categoryOrder
            .filter(categoryKey => {
              const categorySkills = skillsByCategory[categoryKey]
              return categorySkills && categorySkills.length > 0
            })
            .map((categoryKey) => {
              const categorySkills = skillsByCategory[categoryKey]
              
              if (!categorySkills || categorySkills.length === 0) {
                return null
              }
              
              return (
                <div key={categoryKey}>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
                    {categoryKey}
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categorySkills.map(skill => (
                      <SkillCard key={skill.id} skill={skill} />
                    ))}
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </section>
  )
}