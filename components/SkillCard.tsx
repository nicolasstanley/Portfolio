import { Skill } from '@/types'

interface SkillCardProps {
  skill: Skill
}

export default function SkillCard({ skill }: SkillCardProps) {
  const { metadata } = skill

  const getProficiencyColor = (level: string | undefined) => {
    switch (level) {
      case 'Expert':
        return 'bg-green-500'
      case 'Advanced':
        return 'bg-blue-500'
      case 'Intermediate':
        return 'bg-yellow-500'
      case 'Beginner':
        return 'bg-gray-500'
      default:
        return 'bg-gray-400'
    }
  }

  const getProficiencyWidth = (level: string | undefined) => {
    switch (level) {
      case 'Expert':
        return 'w-full'
      case 'Advanced':
        return 'w-4/5'
      case 'Intermediate':
        return 'w-3/5'
      case 'Beginner':
        return 'w-2/5'
      default:
        return 'w-1/2'
    }
  }

  return (
    <div className="card hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-start justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-900">
          {metadata?.skill_name || skill.title}
        </h4>
        
        {metadata?.proficiency_level && (
          <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded">
            {metadata.proficiency_level.value}
          </span>
        )}
      </div>
      
      {/* Proficiency bar */}
      {metadata?.proficiency_level && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${getProficiencyColor(metadata.proficiency_level.value)} ${getProficiencyWidth(metadata.proficiency_level.value)}`}
            ></div>
          </div>
        </div>
      )}
      
      {metadata?.description && (
        <p className="text-gray-600 text-sm mb-3">
          {metadata.description}
        </p>
      )}
      
      {metadata?.years_experience && (
        <div className="flex items-center text-sm text-gray-500">
          <span className="font-medium">{metadata.years_experience}</span>
          <span className="ml-1">
            {metadata.years_experience === 1 ? 'year' : 'years'} experience
          </span>
        </div>
      )}
    </div>
  )
}