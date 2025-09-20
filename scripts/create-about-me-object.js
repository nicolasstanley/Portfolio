const { createBucketClient } = require('@cosmicjs/sdk');
require('dotenv').config({ path: '.env.local' });

const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG,
  readKey: process.env.COSMIC_READ_KEY,
  writeKey: process.env.COSMIC_WRITE_KEY,
});

async function createAboutMeObject() {
  try {
    console.log('🔍 Checking if about-me object already exists...');
    
    try {
      const existingResponse = await cosmic.objects.find({ type: 'about-me' }).props(['id', 'title']);
      if (existingResponse.objects.length > 0) {
        console.log('✅ About-me object already exists:', existingResponse.objects[0].title);
        return;
      }
    } catch (error) {
      // Object doesn't exist, continue to create it
    }
    
    console.log('➕ Creating about-me object with contact metafields...');
    
    const aboutMeData = {
      title: 'Nicolas Ménard - About Me',
      slug: 'nicolas-menard-about-me',
      type: 'about-me',
      metadata: {
        // Basic Information
        full_name: 'Nicolas Ménard',
        professional_title: 'UX Designer & Researcher',
        bio: 'Experienced UX Designer and Researcher passionate about creating user-centered digital experiences.',
        years_experience: 8,
        
        // Contact Information (required by Contact.tsx)
        email: '', // User should fill this
        phone: '', // User should fill this
        location: '', // User should fill this
        
        // Social Media Links (required by Contact.tsx via SocialLinks)
        linkedin_url: '', // User should fill this
        dribbble_url: '', // User should fill this
        behance_url: '', // User should fill this
        portfolio_website: '', // User should fill this
        
        // Work Availability
        available_for_work: true,
        
        // Images (null by default, user should upload)
        profile_image: null,
        resume_cv: null
      }
    };
    
    const response = await cosmic.objects.insertOne(aboutMeData);
    
    console.log('✅ Successfully created about-me object!');
    console.log(`   ID: ${response.object.id}`);
    console.log(`   Title: ${response.object.title}`);
    console.log(`   Slug: ${response.object.slug}`);
    
    console.log('\n📝 Please update these fields in your Cosmic CMS dashboard:');
    console.log('   • email: Your contact email address');
    console.log('   • phone: Your phone number');
    console.log('   • location: Your location (e.g., "San Francisco, CA")');
    console.log('   • linkedin_url: Your LinkedIn profile URL');
    console.log('   • dribbble_url: Your Dribbble profile URL');
    console.log('   • behance_url: Your Behance profile URL');
    console.log('   • portfolio_website: Your portfolio website URL');
    console.log('   • profile_image: Upload your profile image');
    console.log('   • resume_cv: Upload your resume/CV file');
    
    console.log('\n🎯 The Contact component will now display properly with this data!');
    
  } catch (error) {
    console.error('❌ Error creating about-me object:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

async function main() {
  console.log('🚀 Creating about-me object with contact metafields...\n');
  await createAboutMeObject();
  console.log('\n✨ Process completed!');
}

main();