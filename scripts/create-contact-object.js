const { createBucketClient } = require('@cosmicjs/sdk');
require('dotenv').config({ path: '.env.local' });

const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG,
  readKey: process.env.COSMIC_READ_KEY,
  writeKey: process.env.COSMIC_WRITE_KEY,
});

async function createContactObject() {
  try {
    console.log('➕ Creating Contact object in Cosmic CMS...');
    
    const contactObject = await cosmic.objects.insertOne({
      title: 'Contact Information',
      type: 'contact',
      slug: 'contact-info',
      content: 'Contact information and personal details for Nicolas Ménard',
      metadata: {
        email: 'nicolas@example.com',
        location: 'San Francisco, CA, USA',
        linkedin_url: 'https://linkedin.com/in/nicolasmenard',
        available_for_work: true,
        // profile_image: null, // Remove - will be uploaded via CMS dashboard
        // resume_cv: null // Remove - will be uploaded via CMS dashboard
      }
    });
    
    console.log('✅ Successfully created Contact object!');
    console.log(`   ID: ${contactObject.object.id}`);
    console.log(`   Title: ${contactObject.object.title}`);
    console.log(`   Slug: ${contactObject.object.slug}`);
    console.log(`   Type: ${contactObject.object.type}`);
    
    console.log('\n📝 Contact object created with placeholder data. Update these in Cosmic CMS:');
    console.log('   • email: Update with real email address');
    console.log('   • location: Update with real location');
    console.log('   • linkedin_url: Update with real LinkedIn URL');
    console.log('   • profile_image: Upload profile image via CMS dashboard');
    console.log('   • resume_cv: Upload resume/CV file via CMS dashboard');
    
    console.log('\n🔄 Now update lib/cosmic.ts getAboutMe() function:');
    console.log(`
// Fetch about me information from contact object
export async function getAboutMe(): Promise<AboutMe | null> {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'contact', slug: 'contact-info' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    const contactObj = response.object;
    
    // Transform contact object to AboutMe format
    const aboutMe: AboutMe = {
      id: contactObj.id,
      slug: contactObj.slug,
      title: contactObj.metadata.full_name + ' - About Me',
      content: 'Experienced UX Designer and Researcher passionate about creating user-centered digital experiences.',
      type: 'about-me',
      created_at: contactObj.created_at,
      modified_at: contactObj.modified_at,
      metadata: {
        full_name: 'Nicolas Ménard', // Hardcoded since removed from CMS
        professional_title: 'UX Designer & Researcher',
        bio: 'Experienced UX Designer and Researcher passionate about creating user-centered digital experiences.',
        years_experience: 8,
        email: contactObj.metadata.email,
        phone: null, // Removed from CMS
        location: contactObj.metadata.location,
        linkedin_url: contactObj.metadata.linkedin_url,
        dribbble_url: null, // Removed from CMS
        behance_url: null, // Removed from CMS  
        portfolio_website: null, // Removed from CMS
        available_for_work: contactObj.metadata.available_for_work,
        profile_image: contactObj.metadata.profile_image,
        resume_cv: contactObj.metadata.resume_cv
      }
    };
    
    return aboutMe;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch about me information');
  }
}`);
    
    return contactObject.object;
    
  } catch (error) {
    console.error('❌ Error creating Contact object:', error.message);
    
    if (error.message.includes('Not enough info provided') || error.message.includes('valid \'type\'')) {
      console.log('\n💡 The "contact" object type needs to be created in your Cosmic CMS dashboard first:');
      console.log('   1. Go to https://app.cosmicjs.com/');
      console.log('   2. Navigate to your bucket settings');
      console.log('   3. Create a new Object Type called "contact"');
      console.log('   4. Add the required metafields (see table below)');
      console.log('   5. Then run this script again');
      
      console.log('\n📋 Required metafields for "contact" object type:');
      console.log('   • email (Text, Required)');
      console.log('   • location (Text, Optional)');
      console.log('   • linkedin_url (Text, Optional)');
      console.log('   • available_for_work (Switch/Boolean, Optional)');
      console.log('   • profile_image (Media, Optional)');
      console.log('   • resume_cv (File, Optional)');
    }
    
    if (error.response) {
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
    
    return null;
  }
}

async function main() {
  console.log('🚀 Creating Contact object in Cosmic CMS...\n');
  const contact = await createContactObject();
  if (contact) {
    console.log('\n✨ Contact object created successfully!');
    console.log('🎯 Your Contact component will now use real CMS data!');
  }
  console.log('\n✨ Process completed!');
}

main();