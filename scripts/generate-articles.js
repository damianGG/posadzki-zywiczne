require('dotenv').config();

const https = require('https');
const fs = require('fs');
const path = require('path');
/**
 * Generate article content using OpenAI API
 */


async function generateArticleContent(topic) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }

  const prompt = `Generate a comprehensive blog article in Polish about resin flooring.

Topic: ${topic}

Requirements:
- Write 2000-3000 words in Polish
- Use HTML formatting (h2, h3, p, ul, li, strong, em, a tags)
- Include practical tips and expert advice
- Focus on: epoxy flooring, polyurethane systems, garage floors, surface preparation
- Use professional tone, construction industry style
- Include internal links where appropriate (use placeholder paths like /blog/related-topic)

Respond ONLY with a valid JSON object in this exact format (no markdown, no code blocks):
{
  "title": "Article title in Polish",
  "slug": "url-friendly-slug",
  "excerpt": "Brief 150-200 character description",
  "content": "Full HTML article content",
  "category": "Porady",
  "tags": ["tag1", "tag2", "tag3"]
}`;

  const requestData = JSON.stringify({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are an expert in resin flooring, epoxy systems, and construction. You write detailed, practical articles in Polish for professionals and DIY enthusiasts."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.8,
    max_tokens: 4000
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.openai.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(requestData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);

          if (response.error) {
            reject(new Error(`OpenAI API Error: ${response.error.message}`));
            return;
          }

          const content = response.choices[0].message.content.trim();
          const cleanContent = content.replace(/```json\n?|\n?```/g, '');
          const articleData = JSON.parse(cleanContent);

          resolve(articleData);
        } catch (error) {
          reject(new Error(`Failed to parse OpenAI response: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`OpenAI API request failed: ${error.message}`));
    });

    req.write(requestData);
    req.end();
  });
}

/**
 * Generate slug from text
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
 * Get current date in YYYY-MM-DD format
 */
function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Read topics from topics.txt file
 */
function readTopics() {
  const topicsPath = path.join(process.cwd(), 'topics.txt');

  if (!fs.existsSync(topicsPath)) {
    console.error('ERROR: topics.txt file not found!');
    console.error('Please create topics.txt file with one topic per line.');
    process.exit(1);
  }

  const content = fs.readFileSync(topicsPath, 'utf8');
  const topics = content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0 && !line.startsWith('#'));

  return topics;
}

/**
 * Main function to generate articles
 */
async function generateArticles() {
  try {
    console.log('=== Article Generation Script ===\n');

    // Check environment variables
    if (!process.env.OPENAI_API_KEY) {
      console.error('ERROR: OPENAI_API_KEY environment variable is not set');
      console.error('Please set it before running the script:');
      console.error('export OPENAI_API_KEY="your-api-key"');
      process.exit(1);
    }

    // Setup paths
    const postsDir = path.join(process.cwd(), 'content', 'posts');
    const currentDate = getCurrentDate();

    // Create posts directory if it doesn't exist
    if (!fs.existsSync(postsDir)) {
      fs.mkdirSync(postsDir, { recursive: true });
      console.log(`Created directory: ${postsDir}\n`);
    }

    // Read topics
    const topics = readTopics();
    console.log(`Found ${topics.length} topics to generate:\n`);
    topics.forEach((topic, index) => {
      console.log(`${index + 1}. ${topic}`);
    });
    console.log('\n');

    let successCount = 0;
    let errorCount = 0;

    // Generate articles for each topic
    for (let i = 0; i < topics.length; i++) {
      const topic = topics[i];
      console.log(`\n[${i + 1}/${topics.length}] Processing: "${topic}"`);
      console.log('─'.repeat(60));

      try {
        // Generate article content
        console.log('Generating article with OpenAI...');
        const articleData = await generateArticleContent(topic);
        console.log(`✓ Article generated: "${articleData.title}"`);

        // Create JSON structure
        const postData = {
          id: articleData.slug,
          slug: articleData.slug,
          title: articleData.title,
          excerpt: articleData.excerpt,
          content: articleData.content,
          author: {
            name: "Damian",
            avatar: "/profilowe.png?height=40&width=40",
            bio: "Specjalista ds. posadzek przemysłowych i garażowych"
          },
          publishedAt: currentDate,
          updatedAt: currentDate,
          category: articleData.category,
          tags: articleData.tags,
          readTime: `${Math.ceil(articleData.content.split(' ').length / 200)} min`,
          image: {
            url: "/placeholder-image.jpg",
            alt: articleData.title,
            caption: `Ilustracja do artykułu: ${articleData.title}`
          },
          seo: {
            metaTitle: articleData.title,
            metaDescription: articleData.excerpt,
            keywords: articleData.tags,
            canonicalUrl: `https://posadzkizywiczne.com/blog/${articleData.slug}`
          },
          featured: false,
          status: "published"
        };

        // Save to JSON file
        const filename = `${slugify(articleData.slug)}.json`;
        const filepath = path.join(postsDir, filename);

        // Check if file already exists
        if (fs.existsSync(filepath)) {
          console.log(`⚠ File already exists: ${filename} - Skipping`);
          continue;
        }

        fs.writeFileSync(filepath, JSON.stringify(postData, null, 2), 'utf8');
        console.log(`✓ Saved: ${filename}`);
        successCount++;

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`✗ Error processing topic: ${error.message}`);
        errorCount++;
      }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('GENERATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total topics: ${topics.length}`);
    console.log(`✓ Successfully generated: ${successCount}`);
    console.log(`✗ Failed: ${errorCount}`);
    console.log(`\nArticles saved to: ${postsDir}`);
    console.log('\n✓ Generation complete!');

  } catch (error) {
    console.error('\n=== Generation Failed ===');
    console.error('Error:', error.message);
    console.error('\nStack trace:', error.stack);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  generateArticles();
}

module.exports = { generateArticles };
