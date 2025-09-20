const { createBucketClient } = require('@cosmicjs/sdk');
require('dotenv').config({ path: '.env.local' });

const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG,
  readKey: process.env.COSMIC_READ_KEY,
  writeKey: process.env.COSMIC_WRITE_KEY,
});

async function createAboutMeProfile() {
  try {
    console.log('🔍 Checking existing object types...');
    const response = await cosmic.objects.find({}).props(['id', 'title', 'type']);
    const existingTypes = [...new Set(response.objects.map(obj => obj.type))];
    console.log('Available types:', existingTypes.join(', '));
    
    // Try to create using 'profiles' type (common in CMS) or fallback to a generic type
    const objectType = existingTypes.includes('profiles') ? 'profiles' : 'about';
    
    console.log(`➕ Creating about-me object as type: ${objectType}...`);
    
    const aboutMeData = {
      title: 'Nicolas Ménard - About Me',
      slug: 'nicolas-menard-about-me',
      type: objectType,
      content: 'Experienced UX Designer and Researcher passionate about creating user-centered digital experiences.',
      metadata: {
        // Basic Information
        full_name: 'Nicolas Ménard',
        professional_title: 'UX Designer & Researcher',
        bio: 'Experienced UX Designer and Researcher passionate about creating user-centered digital experiences.',
        years_experience: 8,
        
        // Contact Information (required by Contact.tsx)
        email: 'nicolas@example.com', // Placeholder - user should update
        phone: '+1 (555) 123-4567', // Placeholder - user should update  
        location: 'San Francisco, CA', // Placeholder - user should update
        
        // Social Media Links (required by Contact.tsx via SocialLinks)
        linkedin_url: 'https://linkedin.com/in/nicolasmenard', // Placeholder
        dribbble_url: 'https://dribbble.com/nicolasmenard', // Placeholder
        behance_url: 'https://behance.net/nicolasmenard', // Placeholder
        portfolio_website: 'https://nicolasmenard.design', // Placeholder
        
        // Work Availability
        available_for_work: true,
        
        // Images (null by default, user should upload)
        profile_image: null,
        resume_cv: null
      }
    };
    
    const createResponse = await cosmic.objects.insertOne(aboutMeData);
    
    console.log('✅ Successfully created about-me profile!');
    console.log(`   ID: ${createResponse.object.id}`);
    console.log(`   Title: ${createResponse.object.title}`);
    console.log(`   Type: ${createResponse.object.type}`);
    console.log(`   Slug: ${createResponse.object.slug}`);
    
    console.log('\n📝 Placeholder data has been added. Please update these in Cosmic CMS:');
    console.log('   • email: Update with your real email');
    console.log('   • phone: Update with your real phone number');
    console.log('   • location: Update with your real location');
    console.log('   • linkedin_url: Update with your LinkedIn URL');
    console.log('   • dribbble_url: Update with your Dribbble URL');
    console.log('   • behance_url: Update with your Behance URL');
    console.log('   • portfolio_website: Update with your portfolio URL');
    console.log('   • profile_image: Upload your profile image');
    console.log('   • resume_cv: Upload your resume/CV file');
    
    console.log('\n🔄 You may also need to update lib/cosmic.ts to fetch the correct type...');
    
  } catch (error) {
    console.error('❌ Error creating about-me profile:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

async function main() {
  console.log('🚀 Creating about-me profile with contact metafields...\n');
  await createAboutMeProfile();
  console.log('\n✨ Process completed!');
}

main();