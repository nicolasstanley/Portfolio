const { createBucketClient } = require('@cosmicjs/sdk');
require('dotenv').config({ path: '.env.local' });

const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG,
  readKey: process.env.COSMIC_READ_KEY,
  writeKey: process.env.COSMIC_WRITE_KEY,
});

async function updateNavigation() {
  try {
    console.log('Fetching current objects...');
    const response = await cosmic.objects.find({}).props(['id', 'title', 'type', 'slug', 'metadata']);
    
    console.log('\nAvailable objects:');
    response.objects.forEach(obj => {
      console.log(`- ${obj.type}: ${obj.title} (id: ${obj.id})`);
    });

    // Look for navigation or site settings object
    const navObject = response.objects.find(obj => 
      obj.type === 'navigation' || 
      obj.type === 'site-settings' || 
      obj.title.toLowerCase().includes('navigation')
    );

    if (navObject) {
      console.log('\nFound navigation object:', navObject.title);
      console.log('Metadata:', JSON.stringify(navObject.metadata, null, 2));
      
      // Check if we need to update navigation items
      if (navObject.metadata && navObject.metadata.navigation_items) {
        const updatedItems = navObject.metadata.navigation_items.map(item => {
          if (item.label === 'Projects') {
            return { ...item, label: 'Work' };
          }
          return item;
        });
        
        console.log('\nUpdating navigation items...');
        await cosmic.objects.updateOne(navObject.id, {
          metadata: {
            ...navObject.metadata,
            navigation_items: updatedItems
          }
        });
        
        console.log('✅ Navigation updated successfully!');
      }
    } else {
      console.log('\n⚠️  No navigation object found. Creating a basic one...');
      
      // Create a new navigation object
      const navData = {
        title: 'Site Navigation',
        type: 'navigation',
        slug: 'site-navigation',
        metadata: {
          navigation_items: [
            { label: 'Work', href: '#projects', id: 'work' },
            { label: 'Experience', href: '#experience', id: 'experience' },
            { label: 'Skills', href: '#skills', id: 'skills' },
            { label: 'Contact', href: '#contact', id: 'contact' }
          ]
        }
      };
      
      await cosmic.objects.insertOne(navData);
      console.log('✅ Navigation object created successfully!');
    }
    
  } catch (error) {
    console.error('❌ Error updating navigation:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Also update any project-related content
async function updateProjectContent() {
  try {
    console.log('\n📝 Checking for project-related content to update...');
    const response = await cosmic.objects.find({}).props(['id', 'title', 'type', 'content']);
    
    const contentObjects = response.objects.filter(obj => 
      obj.content && obj.content.toLowerCase().includes('project')
    );
    
    for (const obj of contentObjects) {
      console.log(`Found content in ${obj.type}: ${obj.title}`);
      const updatedContent = obj.content.replace(/\bProjects\b/g, 'Work');
      
      if (updatedContent !== obj.content) {
        console.log(`Updating content for: ${obj.title}`);
        await cosmic.objects.updateOne(obj.id, {
          content: updatedContent
        });
        console.log('✅ Content updated!');
      }
    }
    
  } catch (error) {
    console.error('❌ Error updating project content:', error.message);
  }
}

async function main() {
  console.log('🚀 Starting Cosmic CMS update...\n');
  await updateNavigation();
  await updateProjectContent();
  console.log('\n✨ Update completed!');
}

main();