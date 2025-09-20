// Base Cosmic object interface
export interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type: string;
  created_at: string;
  modified_at: string;
}

// About Me object type
export interface AboutMe extends CosmicObject {
  type: 'about-me';
  metadata: {
    full_name?: string;
    professional_title?: string;
    bio?: string;
    years_experience?: number;
    location?: string;
    email?: string;
    phone?: string;
    linkedin_url?: string;
    dribbble_url?: string;
    behance_url?: string;
    portfolio_website?: string;
    profile_image?: {
      url: string;
      imgix_url: string;
    };
    resume_cv?: {
      url: string;
      imgix_url: string;
    } | null;
    available_for_work?: boolean;
  };
}

// Work Experience object type
export interface WorkExperience extends CosmicObject {
  type: 'work-experience';
  metadata: {
    job_title?: string;
    company?: string;
    location?: string;
    employment_type?: {
      key: string;
      value: string;
    };
    start_date?: string;
    end_date?: string | null;
    current_position?: boolean;
    job_description?: string;
    key_achievements?: string;
    company_logo?: {
      url: string;
      imgix_url: string;
    };
  };
}

// Skills object type
export interface Skill extends CosmicObject {
  type: 'skills';
  metadata: {
    skill_name?: string;
    skill_category?: {
      key: string;
      value: string;
    };
    proficiency_level?: {
      key: string;
      value: string;
    };
    years_experience?: number;
    description?: string;
  };
}

// Projects object type
export interface Project extends CosmicObject {
  type: 'projects';
  metadata: {
    project_name?: string;
    company?: string;
    project_type?: {
      key: string;
      value: string;
    };
    description?: string;
    description_short?: string;
    project_overview?: string;
    challenge?: string;
    challenge_and_research?: string;
    design_process?: string;
    solution?: string;
    implementation_and_results?: string;
    reflection?: string;
    tools_used?: string[];
    project_duration?: string;
    client_company?: string;
    featured_image?: string;
    cloudinary_featured_image?: string;
    featured_video?: {
      url: string;
      imgix_url: string;
    };
    cloudinary_featured_video?: string;
    project_gallery?: Array<{
      url: string;
      imgix_url: string;
    }>;
    cloudinary_gallery_images?: string;
    image_1?: string;
    image_2?: string;
    image_3?: string;
    image_4?: string;
    image_5?: string;
    image_6?: string;
    image_7?: string;
    image_8?: string;
    image_9?: string;
    image_10?: string;
    live_url?: string;
    live_url_text?: string;
    live_url_2?: string;
    live_url_2_text?: string;
    case_study_url?: string;
  };
}

// Type literals for select-dropdown values
export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Freelance' | 'Internship';
export type SkillCategory = 'Design Tools' | 'Research Methods' | 'Prototyping' | 'Soft Skills' | 'Technical';
export type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
export type ProjectType = 'Web Design' | 'Mobile App' | 'User Research' | 'Brand Design' | 'Prototyping';

// API response types
export interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit?: number;
  skip?: number;
}

// Type guards for runtime validation
export function isAboutMe(obj: CosmicObject): obj is AboutMe {
  return obj.type === 'about-me';
}

export function isWorkExperience(obj: CosmicObject): obj is WorkExperience {
  return obj.type === 'work-experience';
}

export function isSkill(obj: CosmicObject): obj is Skill {
  return obj.type === 'skills';
}

export function isProject(obj: CosmicObject): obj is Project {
  return obj.type === 'projects';
}