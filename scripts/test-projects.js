const { createBucketClient } = require('@cosmicjs/sdk');
require('dotenv').config({ path: '.env.local' });

const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG,
  readKey: process.env.COSMIC_READ_KEY,
  writeKey: process.env.COSMIC_WRITE_KEY,
});

async function testProjects() {
  try {
    console.log('🔍 Testing project loading from Cosmic CMS...\n');
    
    const response = await cosmic.objects
      .find({ type: 'works' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    const projects = response.objects;
    
    console.log(`📊 Found ${projects.length} projects:\n`);
    
    projects.forEach((project, index) => {
      console.log(`${index + 1}. "${project.title}"`);
      console.log(`   ID: ${project.id}`);
      console.log(`   Slug: ${project.slug}`);
      console.log(`   Project Name: ${project.metadata?.project_name || 'N/A'}`);
      console.log(`   Description: ${project.metadata?.description?.substring(0, 100) || 'N/A'}...`);
      console.log(`   Featured Image: ${project.metadata?.featured_image ? '✅ Yes' : '❌ No'}`);
      console.log('');
    });
    
    if (projects.length === 0) {
      console.log('⚠️  No projects found in Cosmic CMS');
    } else {
      console.log('✅ Projects are loading correctly from Cosmic CMS');
    }
    
  } catch (error) {
    console.error('❌ Error loading projects:', error.message);
  }
}

testProjects();