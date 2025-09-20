const { createBucketClient } = require('@cosmicjs/sdk');
require('dotenv').config({ path: '.env.local' });

const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG,
  readKey: process.env.COSMIC_READ_KEY,
  writeKey: process.env.COSMIC_WRITE_KEY,
});

async function addContactMetafields() {
  try {
    console.log('🔍 Fetching about-me object...');
    
    // Find the about-me object
    const response = await cosmic.objects.find({ type: 'about-me' }).props(['id', 'title', 'slug', 'metadata']);
    
    if (response.objects.length === 0) {
      console.log('❌ No about-me object found. Please create one first.');
      return;
    }
    
    const aboutMe = response.objects[0];
    console.log(`✅ Found about-me object: ${aboutMe.title} (ID: ${aboutMe.id})`);
    
    // Current metadata
    const currentMetadata = aboutMe.metadata || {};
    console.log('\n📋 Current metadata fields:', Object.keys(currentMetadata));
    
    // Define the metafields we need for the Contact component
    const requiredContactFields = {
      email: currentMetadata.email || '',
      phone: currentMetadata.phone || '',
      location: currentMetadata.location || '',
      full_name: currentMetadata.full_name || '',
      linkedin_url: currentMetadata.linkedin_url || '',
      dribbble_url: currentMetadata.dribbble_url || '',
      behance_url: currentMetadata.behance_url || '',
      portfolio_website: currentMetadata.portfolio_website || '',
      available_for_work: currentMetadata.available_for_work !== undefined ? currentMetadata.available_for_work : true,
      profile_image: currentMetadata.profile_image || null
    };
    
    // Check which fields are missing
    const missingFields = Object.keys(requiredContactFields).filter(field => 
      currentMetadata[field] === undefined || currentMetadata[field] === null
    );
    
    if (missingFields.length === 0) {
      console.log('✅ All contact metafields are already present!');
      console.log('\n📝 Current contact information:');
      console.log(`  • Email: ${currentMetadata.email || 'Not set'}`);
      console.log(`  • Phone: ${currentMetadata.phone || 'Not set'}`);
      console.log(`  • Location: ${currentMetadata.location || 'Not set'}`);
      console.log(`  • Full Name: ${currentMetadata.full_name || 'Not set'}`);
      console.log(`  • LinkedIn: ${currentMetadata.linkedin_url || 'Not set'}`);
      console.log(`  • Dribbble: ${currentMetadata.dribbble_url || 'Not set'}`);
      console.log(`  • Behance: ${currentMetadata.behance_url || 'Not set'}`);
      console.log(`  • Portfolio Website: ${currentMetadata.portfolio_website || 'Not set'}`);
      console.log(`  • Available for Work: ${currentMetadata.available_for_work !== undefined ? currentMetadata.available_for_work : 'Not set'}`);
      console.log(`  • Profile Image: ${currentMetadata.profile_image ? 'Set' : 'Not set'}`);
      return;
    }
    
    console.log(`\n➕ Missing fields: ${missingFields.join(', ')}`);
    console.log('\n🔄 Adding missing metafields...');
    
    // Update the object with missing fields (empty values for user to fill)
    const updatedMetadata = {
      ...currentMetadata,
      ...Object.fromEntries(
        missingFields.map(field => [field, requiredContactFields[field]])
      )
    };
    
    await cosmic.objects.updateOne(aboutMe.id, {
      metadata: updatedMetadata
    });
    
    console.log('✅ Successfully added missing contact metafields!');
    console.log('\n📝 Please update these fields in your Cosmic CMS dashboard:');
    missingFields.forEach(field => {
      console.log(`  • ${field}: ${getFieldDescription(field)}`);
    });
    
  } catch (error) {
    console.error('❌ Error adding contact metafields:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

function getFieldDescription(field) {
  const descriptions = {
    email: 'Your contact email address',
    phone: 'Your phone number',
    location: 'Your location (e.g., "San Francisco, CA")',
    full_name: 'Your full name',
    linkedin_url: 'Your LinkedIn profile URL',
    dribbble_url: 'Your Dribbble profile URL',
    behance_url: 'Your Behance profile URL', 
    portfolio_website: 'Your portfolio website URL',
    available_for_work: 'Boolean - are you available for work?',
    profile_image: 'Upload your profile image'
  };
  return descriptions[field] || 'Please set this field';
}

async function main() {
  console.log('🚀 Adding Contact metafields to about-me object...\n');
  await addContactMetafields();
  console.log('\n✨ Process completed!');
}

main();