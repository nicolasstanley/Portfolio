const { createBucketClient } = require('@cosmicjs/sdk');
require('dotenv').config({ path: '.env.local' });

const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG,
  readKey: process.env.COSMIC_READ_KEY,
  writeKey: process.env.COSMIC_WRITE_KEY,
});

async function createProfileObject() {
  try {
    console.log('➕ Creating profile object using "skills" type...');
    
    const profileData = {
      title: 'Nicolas Ménard - Profile',
      slug: 'nicolas-menard-profile',
      type: 'skills',
      content: 'Personal profile and contact information for Nicolas Ménard',
      metadata: {
        // Use existing skill fields creatively
        skill_name: 'Personal Profile',
        skill_category: { key: 'profile', value: 'Profile Information' },
        proficiency_level: { key: 'expert', value: 'Expert' },
        years_experience: 8,
        description: 'Personal profile and contact information',
        
        // Add all the contact fields we need
        full_name: 'Nicolas Ménard',
        professional_title: 'UX Designer & Researcher',
        bio: 'Experienced UX Designer and Researcher passionate about creating user-centered digital experiences.',
        email: 'nicolas@example.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        linkedin_url: 'https://linkedin.com/in/nicolasmenard',
        dribbble_url: 'https://dribbble.com/nicolasmenard',
        behance_url: 'https://behance.net/nicolasmenard',
        portfolio_website: 'https://nicolasmenard.design',
        available_for_work: true,
        profile_image: null,
        resume_cv: null
      }
    };
    
    const response = await cosmic.objects.insertOne(profileData);
    
    console.log('✅ Successfully created profile object!');
    console.log(`   ID: ${response.object.id}`);
    console.log(`   Title: ${response.object.title}`);
    console.log(`   Slug: ${response.object.slug}`);
    
    console.log('\n📝 Now update lib/cosmic.ts to fetch this profile object:');
    console.log(`   Change getAboutMe() to look for slug: "${response.object.slug}"`);
    
    return response.object;
    
  } catch (error) {
    console.error('❌ Error creating profile object:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    return null;
  }
}

async function updateCosmicFile(profileSlug) {
  console.log('\n🔄 Updating lib/cosmic.ts to use the new profile object...');
  
  const newGetAboutMeFunction = `
// Fetch about me information
export async function getAboutMe(): Promise<AboutMe | null> {
  try {
    const response = await cosmic.objects
      .findOne({ slug: '${profileSlug}' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    // Transform the skills object to AboutMe format
    const skillsObj = response.object;
    const aboutMe: AboutMe = {
      id: skillsObj.id,
      slug: skillsObj.slug,
      title: skillsObj.title,
      content: skillsObj.content,
      type: 'about-me', // Transform type
      created_at: skillsObj.created_at,
      modified_at: skillsObj.modified_at,
      metadata: skillsObj.metadata
    };
    
    return aboutMe;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch about me information');
  }
}`;

  console.log('📋 Replace the getAboutMe function in lib/cosmic.ts with:');
  console.log(newGetAboutMeFunction);
}

async function main() {
  console.log('🚀 Creating profile object and updating cosmic.ts...\n');
  const profile = await createProfileObject();
  if (profile) {
    await updateCosmicFile(profile.slug);
  }
  console.log('\n✨ Process completed!');
}

main();