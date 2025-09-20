const { createBucketClient } = require('@cosmicjs/sdk');
require('dotenv').config({ path: '.env.local' });

const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG,
  readKey: process.env.COSMIC_READ_KEY,
  writeKey: process.env.COSMIC_WRITE_KEY,
});

async function updateEFProjectImage() {
  try {
    console.log('🔄 Updating EF Global Navigation project image...');
    
    const projectId = '68af5efdd92f72ae7ac4c811';
    const newImageUrl = 'https://res.cloudinary.com/dk6j5aucm/image/upload/v1757276263/EF_Thumbnail_z0wwvd.png';
    
    // Get current project
    const response = await cosmic.objects.findOne({ id: projectId }).props(['id', 'title', 'metadata']);
    const project = response.object;
    
    console.log(`📋 Current project: ${project.title}`);
    console.log(`📋 Current featured image: ${project.metadata?.featured_image || 'None'}`);
    console.log('📋 Current metadata keys:', Object.keys(project.metadata || {}));
    
    // Create clean metadata object, filtering out problematic fields
    const cleanMetadata = {};
    for (const [key, value] of Object.entries(project.metadata)) {
      if (key === 'featured_image') {
        cleanMetadata[key] = newImageUrl;
      } else if (value !== null && value !== undefined && value !== '') {
        cleanMetadata[key] = value;
      }
    }
    
    // Update with cleaned metadata
    await cosmic.objects.updateOne(projectId, {
      metadata: cleanMetadata
    });
    
    console.log('✅ Successfully updated EF project image!');
    console.log(`🖼️  New image: ${newImageUrl}`);
    
  } catch (error) {
    console.error('❌ Error updating project image:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

updateEFProjectImage();