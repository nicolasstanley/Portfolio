const { createBucketClient } = require('@cosmicjs/sdk');
require('dotenv').config({ path: '.env.local' });

const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG,
  readKey: process.env.COSMIC_READ_KEY,
  writeKey: process.env.COSMIC_WRITE_KEY,
});

async function checkProjectMetadata() {
  try {
    console.log('🔍 Checking project metadata fields...\n');
    
    const response = await cosmic.objects
      .findOne({ type: 'works', slug: 'redesigning-ef-global-navigation' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    const project = response.object;
    
    console.log(`📊 Project: "${project.title}"\n`);
    console.log('Available metadata fields:');
    
    Object.keys(project.metadata || {}).forEach((key) => {
      const value = project.metadata[key];
      const type = Array.isArray(value) ? 'array' : typeof value;
      const preview = type === 'string' ? value.substring(0, 100) + '...' : 
                     type === 'array' ? `[${value.length} items]` : 
                     String(value);
      
      console.log(`  ${key}: (${type}) ${preview}`);
    });
    
    // Check specifically for solution and solution_image
    console.log('\n🔍 Checking for solution fields:');
    console.log(`  solution: ${project.metadata?.solution ? '✅ Yes' : '❌ No'}`);
    console.log(`  solution_image: ${project.metadata?.solution_image ? '✅ Yes' : '❌ No'}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkProjectMetadata();