const https = require('https');
const http = require('http');
const { URL } = require('url');

/**
 * Download image from URL
 * @param {string} imageUrl - URL of the image to download
 * @returns {Promise<Buffer>} Image data as buffer
 */
async function downloadImage(imageUrl) {
  return new Promise((resolve, reject) => {
    const url = new URL(imageUrl);
    const protocol = url.protocol === 'https:' ? https : http;

    protocol.get(imageUrl, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${res.statusCode}`));
        return;
      }

      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

/**
 * Upload image to Cloudinary
 * @param {Buffer} imageBuffer - Image data
 * @param {string} filename - Filename for the image
 * @returns {Promise<string>} Cloudinary URL
 */
async function uploadToCloudinary(imageBuffer, filename) {
  const cloudName = process.env.CLOUDINARY_CLOUD;
  const uploadPreset = process.env.CLOUDINARY_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('CLOUDINARY_CLOUD and CLOUDINARY_PRESET environment variables must be set');
  }

  // Create form data manually
  const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
  const base64Image = imageBuffer.toString('base64');
  
  const formDataParts = [];
  
  // Add file field
  formDataParts.push(`--${boundary}\r\n`);
  formDataParts.push(`Content-Disposition: form-data; name="file"\r\n\r\n`);
  formDataParts.push(`data:image/png;base64,${base64Image}\r\n`);
  
  // Add upload_preset field
  formDataParts.push(`--${boundary}\r\n`);
  formDataParts.push(`Content-Disposition: form-data; name="upload_preset"\r\n\r\n`);
  formDataParts.push(`${uploadPreset}\r\n`);
  
  // Add public_id field
  formDataParts.push(`--${boundary}\r\n`);
  formDataParts.push(`Content-Disposition: form-data; name="public_id"\r\n\r\n`);
  formDataParts.push(`${filename}\r\n`);
  
  // Close boundary
  formDataParts.push(`--${boundary}--\r\n`);
  
  const formData = formDataParts.join('');

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.cloudinary.com',
      path: `/v1_1/${cloudName}/image/upload`,
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': Buffer.byteLength(formData)
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
            reject(new Error(`Cloudinary Error: ${response.error.message}`));
            return;
          }

          if (response.secure_url) {
            resolve(response.secure_url);
          } else {
            reject(new Error('No secure_url in Cloudinary response'));
          }
        } catch (error) {
          reject(new Error(`Failed to parse Cloudinary response: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Cloudinary upload request failed: ${error.message}`));
    });

    req.write(formData);
    req.end();
  });
}

/**
 * Process and upload image from OpenAI to Cloudinary
 * @param {string} imageUrl - OpenAI generated image URL
 * @param {string} filename - Filename for Cloudinary
 * @returns {Promise<string>} Cloudinary URL
 */
async function processAndUploadImage(imageUrl, filename) {
  try {
    console.log(`Downloading image from OpenAI...`);
    const imageBuffer = await downloadImage(imageUrl);
    
    console.log(`Uploading to Cloudinary as ${filename}...`);
    const cloudinaryUrl = await uploadToCloudinary(imageBuffer, filename);
    
    console.log(`Successfully uploaded: ${cloudinaryUrl}`);
    return cloudinaryUrl;
  } catch (error) {
    throw new Error(`Failed to process image: ${error.message}`);
  }
}

module.exports = {
  downloadImage,
  uploadToCloudinary,
  processAndUploadImage
};
