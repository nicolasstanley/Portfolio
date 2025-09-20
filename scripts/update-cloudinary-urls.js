const { createBucketClient } = require('@cosmicjs/sdk');
require('dotenv').config({ path: '.env.local' });

const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG,
  readKey: process.env.COSMIC_READ_KEY,
  writeKey: process.env.COSMIC_WRITE_KEY,
});

// URL mapping - replace these with your actual Cloudinary URLs
const urlMappings = {
  // Example:
  // 'https://cdn.cosmicjs.com/old-image.png': 'https://res.cloudinary.com/your-cloud/image/upload/v1234/new-image.jpg',
  
  // EF Project URLs (update these with your Cloudinary URLs)
  'https://cdn.cosmicjs.com/0f9f47e0-8683-11f0-b89d-a3ec0a58ec20-EF_hero.png': 'YOUR_CLOUDINARY_URL_HERE',
  'https://cdn.cosmicjs.com/10821090-837f-11f0-ae77-a10f7aa054c0-6878d419a73e0854ccc382cf_EF_usability_test_findings-p-2000.png': 'YOUR_CLOUDINARY_URL_HERE',
  // Add more mappings as needed
};

async function updateProjectUrls() {
  try {
    console.log('🔍 Fetching all projects...\n');
    
    const response = await cosmic.objects
      .find({ type: 'works' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    const projects = response.objects;
    
    for (const project of projects) {
      console.log(`📝 Updating project: "${project.title}"`);
      
      let updated = false;
      const updatedMetadata = { ...project.metadata };
      
      // Update featured image
      if (updatedMetadata.featured_image?.url && urlMappings[updatedMetadata.featured_image.url]) {
        const newUrl = urlMappings[updatedMetadata.featured_image.url];
        updatedMetadata.featured_image = {
          url: newUrl,
          imgix_url: newUrl // Cloudinary handles optimization
        };
        updated = true;
        console.log(`  ✅ Updated featured image`);
      }
      
      // Update project gallery
      if (updatedMetadata.project_gallery && Array.isArray(updatedMetadata.project_gallery)) {
        updatedMetadata.project_gallery = updatedMetadata.project_gallery.map(image => {
          if (image.url && urlMappings[image.url]) {
            const newUrl = urlMappings[image.url];
            console.log(`  ✅ Updated gallery image`);
            updated = true;
            return {
              url: newUrl,
              imgix_url: newUrl
            };
          }
          return image;
        });
      }
      
      // Update featured video
      if (updatedMetadata.featured_video?.url && urlMappings[updatedMetadata.featured_video.url]) {
        const newUrl = urlMappings[updatedMetadata.featured_video.url];
        updatedMetadata.featured_video = {
          url: newUrl,
          imgix_url: newUrl
        };
        updated = true;
        console.log(`  ✅ Updated featured video`);
      }
      
      // Save changes if any updates were made
      if (updated) {
        await cosmic.objects.updateOne(project.id, {
          title: project.title,
          slug: project.slug,
          metadata: updatedMetadata
        });
        console.log(`  💾 Saved changes for "${project.title}"\n`);
      } else {
        console.log(`  ⏭️  No updates needed for "${project.title}"\n`);
      }
    }
    
    console.log('✅ All projects updated successfully!');
    
  } catch (error) {
    console.error('❌ Error updating projects:', error.message);
  }
}

// Dry run function to preview changes
async function previewChanges() {
  try {
    console.log('👀 PREVIEW MODE - No changes will be made\n');
    
    const response = await cosmic.objects
      .find({ type: 'works' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    const projects = response.objects;
    
    for (const project of projects) {
      console.log(`📋 Project: "${project.title}"`);
      
      // Check featured image
      if (project.metadata.featured_image?.url) {
        const currentUrl = project.metadata.featured_image.url;
        const newUrl = urlMappings[currentUrl];
        if (newUrl) {
          console.log(`  📸 Featured Image:`);
          console.log(`    Old: ${currentUrl}`);
          console.log(`    New: ${newUrl}`);
        }
      }
      
      // Check gallery images
      if (project.metadata.project_gallery) {
        project.metadata.project_gallery.forEach((image, index) => {
          const currentUrl = image.url;
          const newUrl = urlMappings[currentUrl];
          if (newUrl) {
            console.log(`  🖼️  Gallery Image ${index + 1}:`);
            console.log(`    Old: ${currentUrl}`);
            console.log(`    New: ${newUrl}`);
          }
        });
      }
      
      console.log('');
    }
    
  } catch (error) {
    console.error('❌ Error previewing changes:', error.message);
  }
}

// Check command line arguments
const args = process.argv.slice(2);
if (args.includes('--preview')) {
  previewChanges();
} else if (args.includes('--update')) {
  updateProjectUrls();
} else {
  console.log(`
Usage:
  node scripts/update-cloudinary-urls.js --preview    # Preview changes
  node scripts/update-cloudinary-urls.js --update     # Apply changes

⚠️  Make sure to update the urlMappings object with your Cloudinary URLs first!
  `);
}