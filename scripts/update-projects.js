const { createBucketClient } = require('@cosmicjs/sdk')
require('dotenv').config({ path: '.env.local' })

// Initialize Cosmic client
const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG,
  readKey: process.env.COSMIC_READ_KEY,
  writeKey: process.env.COSMIC_WRITE_KEY,
})

console.log('Environment check:')
console.log('- BUCKET_SLUG:', process.env.COSMIC_BUCKET_SLUG ? '✓' : '✗')
console.log('- READ_KEY:', process.env.COSMIC_READ_KEY ? '✓' : '✗') 
console.log('- WRITE_KEY:', process.env.COSMIC_WRITE_KEY ? '✓' : '✗')
console.log('')

async function updateProjects() {
  try {
    console.log('🗑️ Step 1: Deleting existing financial-dashboard project...')
    
    // First, find the project by slug to get its ID
    try {
      const existingProject = await cosmic.objects.findOne({
        type: 'projects',
        slug: 'financial-dashboard-web-app'
      })
      
      if (existingProject.object) {
        await cosmic.objects.deleteOne(existingProject.object.id)
        console.log('✅ Successfully deleted financial-dashboard-web-app project')
      } else {
        console.log('ℹ️ financial-dashboard-web-app project not found (may already be deleted)')
      }
    } catch (error) {
      console.log('ℹ️ Could not find/delete financial-dashboard-web-app project:', error.message)
    }

    console.log('\n🆕 Step 2: Creating new EF Global Navigation project...')
    
    const newProject = await cosmic.objects.insertOne({
      title: 'Redesigning EF\'s Global Navigation',
      type: 'projects',
      slug: 'redesigning-ef-global-navigation',
      metadata: {
        project_name: 'Redesigning EF\'s Global Navigation',
        project_type: {
          key: 'web_design',
          value: 'Web Design'
        },
        description: 'Critical component of EF\'s large-scale website, the header navigation supports multiple products across various countries. The objective was to develop a consistent, scalable, and accessible navigation system to enhance user experience on desktop and mobile devices. This year-long project entailed designing a Figma component within Backpack, EF\'s global design system, creating detailed documentation, and collaborating with cross-functional teams in Europe and the US to ensure smooth integration into production.',
        challenge: 'EF websites with inconsistent header navigation create disjointed user experiences, weaken brand identity, and confuse customers. Discovery research showed critical failures in helping users to discover or find relevant programs through the navigation. Users wasted time on the wrong programs when their needs weren\'t defined, and both the main and product navigation failed to guide them effectively.',
        solution: '<p>Led the end-to-end design process with a comprehensive approach:</p><ul><li><strong>Discovery Research:</strong> Conducted user research with parents and children across five European markets (France, Germany, Italy, Spain, and Sweden) to identify navigation issues</li><li><strong>Cross-functional Collaboration:</strong> Partnered with product teams and executives in Europe and the US to align on requirements and business goals</li><li><strong>Design System Integration:</strong> Built the navigation as a reusable Figma component within EF\'s Backpack design system</li><li><strong>Accessibility Focus:</strong> Ensured keyboard navigation, screen reader compatibility, and clear contrast ratios</li><li><strong>Mobile-first Approach:</strong> Designed with optimal touch target sizes and responsive behavior</li><li><strong>Documentation & Adoption:</strong> Created comprehensive documentation and delivered live demo presentations to facilitate adoption across products</li></ul><p>The new navigation supports three menu levels, works seamlessly across devices, and makes products easier to find for users worldwide. Production teams are actively rebuilding their navigation systems based on the Figma component.</p>',
        tools_used: [
          'Figma',
          'Figjam',
          'Miro'
        ],
        project_duration: '12 months',
        client_company: 'EF Education First',
        featured_image: 'https://imgix.cosmicjs.com/a4a5c770-825e-11f0-83d8-7b0502815c4d-photo-1551288049-bebda4e38f71-1756200344421.jpg',
        project_gallery: [
          'https://imgix.cosmicjs.com/a5b14400-825e-11f0-83d8-7b0502815c4d-photo-1460925895917-afdab827c52f-1756200346548.jpg',
          'https://imgix.cosmicjs.com/a6679bb0-825e-11f0-83d8-7b0502815c4d-photo-1554224155-6726b3ff858f-1756200347743.jpg'
        ],
        live_url: 'https://www.eftours.com/',
        case_study_url: 'https://www.ef.com/wwen/epi/'
      }
    })

    console.log('✅ Successfully created EF Global Navigation project!')
    console.log(`📝 Project ID: ${newProject.object.id}`)
    console.log(`🔗 Project Slug: ${newProject.object.slug}`)
    
    console.log('\n🎉 All project updates completed successfully!')
    
  } catch (error) {
    console.error('❌ Error updating projects:', error)
    process.exit(1)
  }
}

// Run the script
updateProjects()