const { createBucketClient } = require('@cosmicjs/sdk');
require('dotenv').config({ path: '.env.local' });

const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG,
  readKey: process.env.COSMIC_READ_KEY,
  writeKey: process.env.COSMIC_WRITE_KEY,
});

async function addProfileToExperience() {
  try {
    console.log('🔍 Finding the most recent experience to use as profile source...');
    
    // Get the most recent experience (Stanley Robotics)
    const experienceId = '68adcfe05e714fb58d45928c'; // UX Designer at Stanley Robotics
    
    console.log('📋 Fetching existing experience object...');
    const response = await cosmic.objects.findOne({ id: experienceId }).props(['id', 'title', 'slug', 'metadata']);
    const experience = response.object;
    
    console.log(`✅ Found: ${experience.title}`);
    console.log('Current metadata fields:', Object.keys(experience.metadata));
    
    console.log('\n➕ Adding contact and profile fields to this experience...');
    
    // Add all the contact fields needed by Contact.tsx
    const updatedMetadata = {
      ...experience.metadata,
      // Profile information
      full_name: 'Nicolas Ménard',
      professional_title: experience.metadata.job_title || 'UX Designer & Researcher',
      bio: 'Experienced UX Designer and Researcher passionate about creating user-centered digital experiences.',
      years_experience: 8,
      
      // Contact information
      email: 'nicolas@example.com', // User should update
      phone: '+1 (555) 123-4567', // User should update
      // Use existing location from job
      // location already exists from job
      
      // Social links
      linkedin_url: 'https://linkedin.com/in/nicolasmenard', // User should update
      dribbble_url: 'https://dribbble.com/nicolasmenard', // User should update
      behance_url: 'https://behance.net/nicolasmenard', // User should update
      portfolio_website: 'https://nicolasmenard.design', // User should update
      
      // Work availability
      available_for_work: true,
      
      // Images (to be uploaded by user)
      profile_image: null,
      resume_cv: null
    };
    
    await cosmic.objects.updateOne(experienceId, {
      metadata: updatedMetadata
    });
    
    console.log('✅ Successfully added profile and contact fields!');
    console.log('\n📝 Now update lib/cosmic.ts getAboutMe() function to use this experience:');
    
    const newFunction = `
// Fetch about me information from the profile experience
export async function getAboutMe(): Promise<AboutMe | null> {
  try {
    const response = await cosmic.objects
      .findOne({ id: '${experienceId}' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    const experienceObj = response.object;
    
    // Transform experience object to AboutMe format
    const aboutMe: AboutMe = {
      id: experienceObj.id,
      slug: experienceObj.slug,
      title: \`\${experienceObj.metadata.full_name} - Profile\`,
      content: experienceObj.metadata.bio,
      type: 'about-me',
      created_at: experienceObj.created_at,
      modified_at: experienceObj.modified_at,
      metadata: experienceObj.metadata
    };
    
    return aboutMe;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch about me information');
  }
}`;

    console.log(newFunction);
    
    console.log('\n📋 Fields added with placeholder data (update in Cosmic CMS):');
    console.log('   • email: nicolas@example.com');
    console.log('   • phone: +1 (555) 123-4567');
    console.log('   • linkedin_url: https://linkedin.com/in/nicolasmenard');
    console.log('   • dribbble_url: https://dribbble.com/nicolasmenard');
    console.log('   • behance_url: https://behance.net/nicolasmenard');
    console.log('   • portfolio_website: https://nicolasmenard.design');
    console.log('   • profile_image: null (upload in CMS)');
    console.log('   • resume_cv: null (upload in CMS)');
    
  } catch (error) {
    console.error('❌ Error adding profile fields:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

async function main() {
  console.log('🚀 Adding profile and contact fields to existing experience...\n');
  await addProfileToExperience();
  console.log('\n✨ Process completed!');
}

main();