// Script to update work experience entries with Nicolas Ménard's experience
// Run with: node scripts/update-nicolas-experience.js

const { createBucketClient } = require('@cosmicjs/sdk');
require('dotenv').config({ path: '.env.local' });

const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG,
  readKey: process.env.COSMIC_READ_KEY,
  writeKey: process.env.COSMIC_WRITE_KEY,
});

async function updateWorkExperience() {
  try {
    console.log('🔄 Starting work experience updates...\n');

    // 1. Update "Junior UX Designer at DesignCorp" → "UX Lead at EF Education First"
    console.log('1. Updating to UX Lead at EF Education First...');
    await cosmic.objects.updateOne('68ad7d991f09167261d58d71', {
      title: "UX Lead at EF Education First",
      slug: "ux-lead-at-ef-education-first",
      metadata: {
        job_title: "UX Lead",
        company: "EF Education First",
        location: "Zurich, Switzerland",
        employment_type: {
          key: "full_time",
          value: "Full-time"
        },
        start_date: "2023-05-01",
        end_date: "2025-04-30",
        current_position: false,
        job_description: "<p>Leading a UX team of 4 designers to deliver Design System components for multiple EF Education First products worldwide. EF Education First is an international education company offering language training, educational travel, and cultural exchange programs to foster global understanding.</p><ul><li>Designed and improved numerous components to ensure greater design consistency, efficiency, and scalability across product teams</li><li>Created comprehensive internal documentation with clear guidelines and best practices for component usage</li><li>Led high-impact user research across multiple countries, delivering actionable insights to product leaders and executives</li><li>Facilitated collaborative design workshops to reimagine EF.com's global and product navigation for desktop and mobile platforms</li><li>Fostered a culture of innovation by encouraging early experimentation, cross-functional collaboration, and professional growth through training and mentorship</li></ul>",
        key_achievements: "<ul><li>Led UX team of 4 designers across multiple international products</li><li>Delivered comprehensive Design System components ensuring global consistency</li><li>Conducted extensive user research across multiple countries</li><li>Optimized global navigation usability for diverse international audience</li><li>Established mentorship programs fostering team professional growth</li></ul>",
        company_logo: "https://imgix.cosmicjs.com/a49db120-825e-11f0-83d8-7b0502815c4d-photo-1549923746-c502d488b3ea-1756200344446.jpg"
      }
    });
    console.log('✅ EF Education First updated successfully!\n');

    // 2. Update "UX Designer at StartupX" → "Senior UX Designer at BlackWood Seven"
    console.log('2. Updating to Senior UX Designer at BlackWood Seven...');
    await cosmic.objects.updateOne('68ad7d991f09167261d58d6f', {
      title: "Senior UX Designer at BlackWood Seven",
      slug: "senior-ux-designer-at-blackwood-seven",
      metadata: {
        job_title: "Senior UX Designer",
        company: "BlackWood Seven | Kantar",
        location: "Copenhagen, Denmark",
        employment_type: {
          key: "full_time",
          value: "Full-time"
        },
        start_date: "2023-02-01",
        end_date: "2023-05-31",
        current_position: false,
        job_description: "<p>Designed data and predictive modeling tools for AI-driven Unified Marketing Modeling platform. The platform helps brands globally attribute, predict, and optimize business outcomes of marketing and media plans with simple, actionable interfaces.</p><ul><li>Conducted user research to understand marketing professionals' needs and pain points</li><li>Designed intuitive navigation and structure for brand health data and modeling tools</li><li>Created wireframes and prototypes for key tasks like attribution and optimization</li><li>Developed clear, actionable data visualizations including charts and dashboards</li><li>Ensured visual design aligned with branding while enhancing readability</li><li>Tested usability and iterated based on user feedback</li><li>Collaborated closely with product managers, developers, and data scientists</li><li>Designed efficient workflows for media plan analysis and scenario planning</li><li>Ensured accessibility compliance (WCAG standards)</li><li>Created comprehensive onboarding guides and in-app support features</li></ul>",
        key_achievements: "<ul><li>Designed intuitive interface for complex AI-driven marketing analytics platform</li><li>Improved data visualization clarity for marketing professionals globally</li><li>Ensured WCAG accessibility compliance across all interfaces</li><li>Created seamless onboarding experience reducing time-to-value</li><li>Collaborated effectively with data scientists to translate complex algorithms into user-friendly interfaces</li></ul>",
        company_logo: "https://imgix.cosmicjs.com/a4687050-825e-11f0-83d8-7b0502815c4d-photo-1556155092-8707de31f9c4-1756200344219.jpg"
      }
    });
    console.log('✅ BlackWood Seven updated successfully!\n');

    // 3. Update "Senior UX Designer at TechFlow Inc" → "UX Researcher & Designer at Barry Energy"
    console.log('3. Updating to UX Researcher & Designer at Barry Energy...');
    await cosmic.objects.updateOne('68ad7d981f09167261d58d6d', {
      title: "UX Researcher & Designer at Barry Energy",
      slug: "ux-researcher-designer-at-barry-energy",
      metadata: {
        job_title: "UX Researcher & Designer",
        company: "Barry Energy",
        location: "Copenhagen, Denmark",
        employment_type: {
          key: "full_time",
          value: "Full-time"
        },
        start_date: "2020-03-01",
        end_date: "2021-12-31",
        current_position: false,
        job_description: "<p>Conducted B2C user research for mobile app at 100% digital electricity supplier. Barry provides electricity at spot (dynamic) price, allowing customers to optimize consumption based on price or CO2 emissions.</p><ul><li>Led qualitative (generative and evaluative) and quantitative research in different countries, involving business and individual customers</li><li>Reported and communicated insights to multiple company levels and external stakeholders</li><li>Created user-centric deliverables: Experience Maps, User Journeys, Personas, Mind Maps, Task Analysis</li><li>Conducted in-person and remote moderated usability tests in France and Denmark</li><li>Defined user research strategy following product development stage and business goals</li><li>Elaborated personas (4 in total) and conducted cohort analysis to track UI improvements</li><li>Organized and facilitated cross-functional workshops and defined UX OKRs with product team</li><li>Built Barry communities from 0 to 600+ members in both countries for co-creation and user research</li><li>Collaborated closely with CS teams and Marketing to address UX OKRs and business objectives</li><li>Prototyped MVP solutions with quick iterations along user tests</li><li>Automated user feedback and reporting with top management using Zapier and Slack</li></ul>",
        key_achievements: "<ul><li>Built user communities from 0 to 600+ members across France and Denmark</li><li>Defined comprehensive UX OKRs aligned with business objectives</li><li>Conducted bilingual user research across two countries</li><li>Automated feedback reporting systems improving management visibility</li><li>Successfully facilitated co-creation sessions with user communities</li><li>Improved user onboarding and retention through data-driven design decisions</li></ul>",
        company_logo: "https://imgix.cosmicjs.com/a4182d70-825e-11f0-83d8-7b0502815c4d-photo-1560472354-b33ff0c44a43-1756200343829.jpg"
      }
    });
    console.log('✅ Barry Energy updated successfully!\n');

    // 4. Add Electromaps - Lead User Researcher
    console.log('4. Adding Lead User Researcher at Electromaps...');
    await cosmic.objects.insertOne({
      title: "Lead User Researcher at Electromaps",
      slug: "lead-user-researcher-at-electromaps",
      type: "work-experience",
      metadata: {
        job_title: "Lead User Researcher",
        company: "Electromaps",
        location: "Remote",
        employment_type: {
          key: "full_time",
          value: "Full-time"
        },
        start_date: "2022-10-01",
        end_date: "2023-02-28",
        current_position: false,
        job_description: "<p>Led B2C User Research for mobile app connecting electric vehicle drivers to global network of charging stations. Electromaps facilitates payments and provides real-time availability information for EV charging across France, Spain, and Italy.</p><ul><li>Led product team of 3 to conduct qualitative & quantitative user research across 3 countries</li><li>Conceived and conducted user research, interviews, and surveys</li><li>Translated complex user and business needs into concepts, sitemaps, user flows, customer journey maps, wireframes, and prototypes</li><li>Conducted comprehensive, in-depth remote interviews to understand user needs, anxieties, and behaviors</li><li>Performed user testing on Figma prototypes and A/B testing for optimized user flows</li><li>Collaborated with product team to prioritize new features based on research findings</li><li>Presented insights to executive-level and company-wide audiences</li></ul>",
        key_achievements: "<ul><li>Led user research across 3 European countries (France, Spain, Italy)</li><li>Managed team of 3 researchers delivering actionable insights</li><li>Improved EV charging app user experience through data-driven design decisions</li><li>Delivered executive-level insights that shaped product roadmap</li></ul>",
        company_logo: "https://imgix.cosmicjs.com/a4182d70-825e-11f0-83d8-7b0502815c4d-photo-1560472354-b33ff0c44a43-1756200343829.jpg"
      }
    });
    console.log('✅ Electromaps added successfully!\n');

    // 5. Add Stanley Robotics - UX Designer (Longest Role)
    console.log('5. Adding UX Designer at Stanley Robotics...');
    await cosmic.objects.insertOne({
      title: "UX Designer at Stanley Robotics",
      slug: "ux-designer-at-stanley-robotics",
      type: "work-experience",
      metadata: {
        job_title: "UX Designer",
        company: "Stanley Robotics",
        location: "Paris, France",
        employment_type: {
          key: "full_time",
          value: "Full-time"
        },
        start_date: "2015-11-01",
        end_date: "2020-03-31",
        current_position: false,
        job_description: "<p>Designed B2B2C service through variety of touchpoints for innovative robot valet parking solution. Stanley Robotics develops robots able to move any car to provide automated valet parking service in car parks globally.</p><ul><li>Conducted independent research on multiple aspects of products and experiences</li><li>Collected and analyzed user behavior through field visits, ethnography, surveys, benchmarks, and server logs</li><li>Understood and incorporated technology and business requirements into research</li><li>Advocated research findings to diverse audiences through written reports and presentations</li><li>Created analyzed value propositions with user-centered design methods</li><li>Developed interaction concepts and translated them into design briefs and specifications</li><li>Led clients in workshops and design strategy sessions</li><li>Created diagrams to communicate service concepts</li><li>Collaborated with clients to clarify user stories and set UX acceptance criteria</li><li>Delivered standard human-centered design deliverables: personas, user journeys, storyboards, scenarios, taxonomy, information architecture, interaction design guidelines</li></ul>",
        key_achievements: "<ul><li>Designed pioneering B2B2C robotic valet parking service across 4+ years</li><li>Led client workshops and strategic design sessions for multiple stakeholders</li><li>Created comprehensive service design across physical and digital touchpoints</li><li>Applied ethnographic research methods in real parking environments</li><li>Established design processes bridging technology, business, and user needs</li></ul>",
        company_logo: "https://imgix.cosmicjs.com/a4687050-825e-11f0-83d8-7b0502815c4d-photo-1556155092-8707de31f9c4-1756200344219.jpg"
      }
    });
    console.log('✅ Stanley Robotics added successfully!\n');

    console.log('🎉 All work experience entries updated successfully!');
    console.log('\n💡 Next steps:');
    console.log('1. Visit your Cosmic dashboard to review the changes');
    console.log('2. Your portfolio will automatically reflect these updates');
    console.log('3. Check http://localhost:3000 to see the updated experience');

  } catch (error) {
    console.error('❌ Error updating work experience:', error);
    console.error('Full error details:', JSON.stringify(error, null, 2));
  }
}

// Run the update
updateWorkExperience();