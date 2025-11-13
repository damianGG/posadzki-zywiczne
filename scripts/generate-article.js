const fs = require('fs');
const path = require('path');
const { generateArticleContent, generateImages, generateRandomTopic } = require('../lib/openai');
const { processAndUploadImage } = require('../lib/cloudinary');

/**
 * Get today's date in YYYY-MM-DD format
 * @returns {string}
 */
function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Check if article for today already exists
 * @param {string} postsDir - Path to posts directory
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {boolean}
 */
function articleExistsForToday(postsDir, date) {
  if (!fs.existsSync(postsDir)) {
    return false;
  }

  const files = fs.readdirSync(postsDir);
  return files.some(file => file.startsWith(date));
}

/**
 * Generate slug from text
 * @param {string} text - Text to slugify
 * @returns {string}
 */
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/ą/g, 'a')
    .replace(/ć/g, 'c')
    .replace(/ę/g, 'e')
    .replace(/ł/g, 'l')
    .replace(/ń/g, 'n')
    .replace(/ó/g, 'o')
    .replace(/ś/g, 's')
    .replace(/ź/g, 'z')
    .replace(/ż/g, 'z')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Main function to generate daily article
 */
async function generateDailyArticle() {
  try {
    console.log('=== Starting Daily Article Generation ===\n');

    // Check environment variables
    const requiredEnvVars = ['OPENAI_API_KEY', 'CLOUDINARY_CLOUD', 'CLOUDINARY_PRESET'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.error(`ERROR: Missing required environment variables: ${missingVars.join(', ')}`);
      console.error('Please set these variables before running the script.');
      process.exit(1);
    }

    // Setup paths
    const postsDir = path.join(process.cwd(), 'content', 'posts');
    const todayDate = getTodayDate();

    // Create posts directory if it doesn't exist
    if (!fs.existsSync(postsDir)) {
      fs.mkdirSync(postsDir, { recursive: true });
      console.log(`Created directory: ${postsDir}\n`);
    }

    // Check if article already exists for today
    if (articleExistsForToday(postsDir, todayDate)) {
      console.log(`Article for ${todayDate} already exists. Skipping generation.`);
      process.exit(0);
    }

    // Generate random topic
    const topic = generateRandomTopic();
    console.log(`Topic: ${topic}\n`);

    // Step 1: Generate article content
    console.log('Step 1: Generating article content with OpenAI...');
    const articleData = await generateArticleContent(topic);
    console.log('✓ Article content generated successfully\n');
    console.log(`Title: ${articleData.title}`);
    console.log(`Category: ${articleData.category}`);
    console.log(`Tags: ${articleData.tags.join(', ')}\n`);

    // Step 2: Generate images
    console.log('Step 2: Generating images with OpenAI DALL-E...');
    const numImages = Math.floor(Math.random() * 3) + 1; // 1-3 images
    console.log(`Generating ${numImages} image(s)...`);
    
    const imageUrls = await generateImages(articleData.excerpt, numImages);
    console.log(`✓ Generated ${imageUrls.length} image(s)\n`);

    // Step 3: Upload images to Cloudinary
    console.log('Step 3: Uploading images to Cloudinary...');
    const cloudinaryUrls = [];
    
    for (let i = 0; i < imageUrls.length; i++) {
      const filename = `posadzki-zywiczne/${todayDate}-${slugify(articleData.slug)}-${i + 1}`;
      try {
        const cloudinaryUrl = await processAndUploadImage(imageUrls[i], filename);
        cloudinaryUrls.push(cloudinaryUrl);
      } catch (error) {
        console.error(`Failed to upload image ${i + 1}:`, error.message);
        // Continue with other images
      }
    }
    console.log(`✓ Uploaded ${cloudinaryUrls.length} image(s) to Cloudinary\n`);

    // Step 4: Create JSON structure
    const postData = {
      id: `${todayDate}-${articleData.slug}`,
      slug: articleData.slug,
      title: articleData.title,
      excerpt: articleData.excerpt,
      content: articleData.content,
      author: {
        name: "Damian",
        avatar: "/profilowe.png?height=40&width=40",
        bio: "Specjalista ds. posadzek przemysłowych i garażowych"
      },
      publishedAt: todayDate,
      updatedAt: todayDate,
      category: articleData.category,
      tags: articleData.tags,
      readTime: `${Math.ceil(articleData.content.split(' ').length / 200)} min`,
      image: {
        url: cloudinaryUrls[0] || "/placeholder-image.jpg",
        alt: articleData.title,
        caption: `Ilustracja do artykułu: ${articleData.title}`
      },
      cover: cloudinaryUrls[0] || "/placeholder-image.jpg",
      gallery: cloudinaryUrls.slice(1),
      seo: {
        metaTitle: articleData.title,
        metaDescription: articleData.excerpt,
        keywords: articleData.tags,
        canonicalUrl: `https://posadzkizywiczne.com/blog/${articleData.slug}`
      },
      featured: false,
      status: "published"
    };

    // Step 5: Save to JSON file
    const filename = `${todayDate}-${slugify(articleData.slug)}.json`;
    const filepath = path.join(postsDir, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(postData, null, 2), 'utf8');
    console.log(`✓ Article saved to: ${filepath}\n`);

    // Summary
    console.log('=== Generation Complete ===');
    console.log(`Date: ${todayDate}`);
    console.log(`File: ${filename}`);
    console.log(`Title: ${postData.title}`);
    console.log(`Images: ${cloudinaryUrls.length}`);
    console.log(`Word count: ~${articleData.content.split(' ').length}`);
    console.log('\n✓ Daily article generation successful!');

  } catch (error) {
    console.error('\n=== Generation Failed ===');
    console.error('Error:', error.message);
    console.error('\nStack trace:', error.stack);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  generateDailyArticle();
}

module.exports = { generateDailyArticle };
