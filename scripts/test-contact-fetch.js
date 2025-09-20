const { createBucketClient } = require('@cosmicjs/sdk');
require('dotenv').config({ path: '.env.local' });

const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG,
  readKey: process.env.COSMIC_READ_KEY,
  writeKey: process.env.COSMIC_WRITE_KEY,
});

async function testContactFetch() {
  try {
    console.log('🔍 Fetching contact object from Cosmic CMS...');
    
    const response = await cosmic.objects
      .findOne({ type: 'contacts', slug: 'contact-info' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    console.log('✅ Successfully fetched contact object!');
    console.log('ID:', response.object.id);
    console.log('Title:', response.object.title);
    console.log('Slug:', response.object.slug);
    console.log('\n📋 Metadata:');
    console.log(JSON.stringify(response.object.metadata, null, 2));
    
  } catch (error) {
    console.error('❌ Error fetching contact object:', error.message);
    if (error.response) {
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

async function main() {
  console.log('🚀 Testing contact object fetch...\n');
  await testContactFetch();
  console.log('\n✨ Test completed!');
}

main();