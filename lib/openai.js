const https = require('https');

/**
 * Generate article content using OpenAI API
 * @param {string} topic - The topic for the article
 * @returns {Promise<{title: string, slug: string, excerpt: string, content: string, category: string, tags: string[]}>}
 */
async function generateArticleContent(topic) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }

  const prompt = `Generate a comprehensive blog article about resin flooring in Polish language.

Topic: ${topic}

Requirements:
- Write 2000-4000 words in Polish
- Use HTML formatting (h2, h3, p, ul, li, strong, em, a tags)
- Include practical tips and expert advice
- Focus on: epoxy flooring, polyurethane systems, garage floors, balconies, surface preparation
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
          // Remove markdown code blocks if present
          const cleanContent = content.replace(/```json\n?|\n?```/g, '');
          const articleData = JSON.parse(cleanContent);
          
          resolve(articleData);
        } catch (error) {
          reject(new Error(`Failed to parse OpenAI response: ${error.message}\nResponse: ${data}`));
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
 * Generate realistic images using OpenAI DALL-E API
 * @param {string} description - Description for the image
 * @param {number} count - Number of images to generate (1-3)
 * @returns {Promise<string[]>} Array of image URLs
 */
async function generateImages(description, count = 1) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }

  const imagePrompt = `Generate a realistic high-quality photo related to resin flooring, concrete renovation, surface preparation, garage epoxy systems, or balcony waterproofing. ${description}. Target style: real-world photography, sharp, professional, construction industry aesthetic. Avoid unrealistic shapes.`;

  const requestData = JSON.stringify({
    model: "dall-e-3",
    prompt: imagePrompt,
    n: 1, // DALL-E 3 only supports n=1
    size: "1024x1024",
    quality: "standard",
    style: "natural"
  });

  const imageUrls = [];

  // Generate images one by one for DALL-E 3
  for (let i = 0; i < count; i++) {
    try {
      const url = await new Promise((resolve, reject) => {
        const options = {
          hostname: 'api.openai.com',
          path: '/v1/images/generations',
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
                reject(new Error(`OpenAI Images API Error: ${response.error.message}`));
                return;
              }

              if (response.data && response.data[0] && response.data[0].url) {
                resolve(response.data[0].url);
              } else {
                reject(new Error('No image URL in response'));
              }
            } catch (error) {
              reject(new Error(`Failed to parse OpenAI Images response: ${error.message}`));
            }
          });
        });

        req.on('error', (error) => {
          reject(new Error(`OpenAI Images API request failed: ${error.message}`));
        });

        req.write(requestData);
        req.end();
      });

      imageUrls.push(url);
    } catch (error) {
      console.error(`Failed to generate image ${i + 1}:`, error.message);
      // Continue with other images even if one fails
    }
  }

  return imageUrls;
}

/**
 * Generate a random topic for resin flooring article
 * @returns {string}
 */
function generateRandomTopic() {
  const topics = [
    "Jak wybrać odpowiednią żywicę do garażu - epoksyd czy poliuretan",
    "Przygotowanie podłoża pod posadzkę żywiczną krok po kroku",
    "Posadzka żywiczna na balkonie - czy to dobry pomysł",
    "Jak konserwować posadzkę żywiczną w garażu",
    "Najczęstsze błędy przy aplikacji żywicy epoksydowej",
    "Posadzka żywiczna w kuchni - zalety i wady",
    "Ile kosztuje posadzka żywiczna - szczegółowy cennik",
    "Jak naprawić uszkodzoną posadzkę żywiczną",
    "Posadzka żywiczna vs płytki - co wybrać",
    "Żywica epoksydowa w garażu wielorodzinnym",
    "Jak przygotować beton pod żywicę epoksydową",
    "Posadzka żywiczna a ogrzewanie podłogowe",
    "Czy można zrobić posadzkę żywiczną samodzielnie",
    "Posadzka żywiczna w pomieszczeniach przemysłowych",
    "Jak wybrać kolor posadzki żywicznej do garażu"
  ];

  return topics[Math.floor(Math.random() * topics.length)];
}

module.exports = {
  generateArticleContent,
  generateImages,
  generateRandomTopic
};
