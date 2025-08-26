// Script to check existing work experience entries
// Run with: node scripts/check-existing-experience.js

const { createBucketClient } = require('@cosmicjs/sdk');
require('dotenv').config({ path: '.env.local' });

const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG,
  readKey: process.env.COSMIC_READ_KEY,
  writeKey: process.env.COSMIC_WRITE_KEY,
});

async function checkExistingExperience() {
  try {
    console.log('🔍 Fetching existing work experience entries...\n');
    
    const response = await cosmic.objects
      .find({ type: 'work-experience' })
      .props(['id', 'title', 'slug', 'metadata']);
    
    const experiences = response.objects;
    console.log(`📋 Found ${experiences.length} existing entries:\n`);
    
    experiences.forEach((exp, index) => {
      console.log(`${index + 1}. Title: "${exp.title}"`);
      console.log(`   ID: ${exp.id}`);
      console.log(`   Slug: ${exp.slug}`);
      console.log(`   Company: ${exp.metadata?.company || 'No company'}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error fetching work experience:', error);
  }
}

checkExistingExperience();