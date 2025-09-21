const { createBucketClient } = require('@cosmicjs/sdk')
require('dotenv').config({ path: '.env.local' })

const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG || process.env.NEXT_PUBLIC_COSMIC_BUCKET_SLUG,
  readKey: process.env.COSMIC_READ_KEY || process.env.NEXT_PUBLIC_COSMIC_READ_KEY,
  writeKey: process.env.COSMIC_WRITE_KEY || process.env.NEXT_PUBLIC_COSMIC_WRITE_KEY,
})

async function checkContactStructure() {
  try {
    console.log('Fetching contact info structure...')
    
    const response = await cosmic.objects
      .findOne({ type: 'contacts', slug: 'contact-info' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    const contactObj = response.object
    console.log('Contact object structure:')
    console.log(JSON.stringify(contactObj, null, 2))
    
  } catch (error) {
    console.error('Error fetching contact:', error)
  }
}

checkContactStructure()