const { createBucketClient } = require('@cosmicjs/sdk');
require('dotenv').config({ path: '.env.local' });

const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG,
  readKey: process.env.COSMIC_READ_KEY,
  writeKey: process.env.COSMIC_WRITE_KEY,
});

async function checkObjects() {
  try {
    console.log('🔍 Fetching all objects from Cosmic CMS...');
    const response = await cosmic.objects.find({}).props(['id', 'title', 'type', 'slug', 'metadata']);
    
    console.log(`\n📊 Found ${response.objects.length} objects:`);
    
    if (response.objects.length === 0) {
      console.log('❌ No objects found in the bucket.');
      return;
    }
    
    // Group by type
    const objectsByType = {};
    response.objects.forEach(obj => {
      if (!objectsByType[obj.type]) {
        objectsByType[obj.type] = [];
      }
      objectsByType[obj.type].push(obj);
    });
    
    Object.keys(objectsByType).forEach(type => {
      console.log(`\n📁 ${type}:`);
      objectsByType[type].forEach(obj => {
        console.log(`  • ${obj.title} (slug: ${obj.slug}, id: ${obj.id})`);
        if (obj.metadata && Object.keys(obj.metadata).length > 0) {
          console.log(`    Metadata fields: ${Object.keys(obj.metadata).join(', ')}`);
        }
      });
    });
    
  } catch (error) {
    console.error('❌ Error fetching objects:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

async function main() {
  console.log('🚀 Checking Cosmic CMS objects...\n');
  await checkObjects();
  console.log('\n✨ Check completed!');
}

main();