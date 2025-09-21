const { createBucketClient } = require('@cosmicjs/sdk')
require('dotenv').config({ path: '.env.local' })

const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG || process.env.NEXT_PUBLIC_COSMIC_BUCKET_SLUG,
  readKey: process.env.COSMIC_READ_KEY || process.env.NEXT_PUBLIC_COSMIC_READ_KEY,
  writeKey: process.env.COSMIC_WRITE_KEY || process.env.NEXT_PUBLIC_COSMIC_WRITE_KEY,
})

async function updateEmailOnly() {
  try {
    console.log('Fetching contact info...')
    
    // Get the contact object
    const response = await cosmic.objects
      .findOne({ type: 'contacts', slug: 'contact-info' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    const contactObj = response.object
    console.log('Current email:', contactObj.metadata.email)
    
    console.log('Updating email to: hi@nicolasmenard.design')
    
    // Try updating with just the metadata fields that need to change
    const updateResponse = await cosmic.objects.updateOne(contactObj.id, {
      metadata: {
        email: 'hi@nicolasmenard.design'
      }
    })
    
    console.log('Email updated successfully!')
    console.log('New email:', updateResponse.object.metadata.email)
    
  } catch (error) {
    console.error('Error updating email:', error)
  }
}

updateEmailOnly()