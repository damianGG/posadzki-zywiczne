/**
 * Google Drive Sync Script for Realizations
 * 
 * This script syncs realization data from a Google Drive folder to the local project.
 * 
 * Folder Structure in Google Drive:
 * - Realizacje/
 *   - project-1/
 *     - info.txt (metadata)
 *     - image1.jpg
 *     - image2.jpg
 *   - project-2/
 *     - info.txt
 *     - image1.jpg
 * 
 * Info.txt format:
 * TITLE: Posadzka epoksydowa - garaż Warszawa
 * DESCRIPTION: Krótki opis realizacji
 * LOCATION: Warszawa Mokotów
 * AREA: 25 m²
 * DATE: 2024-10-15
 * CLIENT: Klient prywatny (optional)
 * TYPE: garaż
 * SURFACE: epoksydowa
 * TAGS: posadzka epoksydowa, garaż, Warszawa
 * FEATURED: true
 * ---
 * ## Detailed content in Markdown
 * 
 * Longer description with markdown formatting...
 * 
 * Setup:
 * 1. Create a Google Cloud project and enable Google Drive API
 * 2. Create service account credentials
 * 3. Download credentials.json and save to project root
 * 4. Share the "Realizacje" folder with the service account email
 * 5. Set GOOGLE_DRIVE_FOLDER_ID in .env
 * 
 * Usage:
 * node scripts/sync-google-drive.js
 */

const fs = require("fs")
const path = require("path")
const { google } = require("googleapis")

// Configuration
const CREDENTIALS_PATH = path.join(process.cwd(), "google-credentials.json")
const DATA_DIR = path.join(process.cwd(), "data", "realizacje")
const PUBLIC_DIR = path.join(process.cwd(), "public", "realizacje")
const SCOPES = ["https://www.googleapis.com/auth/drive.readonly"]

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true })
}

/**
 * Load Google Drive credentials
 */
function loadCredentials() {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    console.error("Error: google-credentials.json not found!")
    console.error("Please follow the setup instructions in the script header.")
    process.exit(1)
  }

  try {
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf8"))
    return credentials
  } catch (error) {
    console.error("Error loading credentials:", error.message)
    process.exit(1)
  }
}

/**
 * Authenticate with Google Drive API
 */
async function authenticate() {
  const credentials = loadCredentials()

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: SCOPES,
  })

  return await auth.getClient()
}

/**
 * Get folder ID from environment or prompt
 */
function getFolderId() {
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID

  if (!folderId) {
    console.error("Error: GOOGLE_DRIVE_FOLDER_ID not set in .env file")
    console.error("Please add: GOOGLE_DRIVE_FOLDER_ID=your_folder_id")
    process.exit(1)
  }

  return folderId
}

/**
 * List all folders in the main Realizacje folder
 */
async function listProjectFolders(drive, folderId) {
  try {
    const response = await drive.files.list({
      q: `'${folderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: "files(id, name)",
      orderBy: "name",
    })

    return response.data.files || []
  } catch (error) {
    console.error("Error listing folders:", error.message)
    return []
  }
}

/**
 * List all files in a project folder
 */
async function listFilesInFolder(drive, folderId) {
  try {
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: "files(id, name, mimeType)",
    })

    return response.data.files || []
  } catch (error) {
    console.error("Error listing files:", error.message)
    return []
  }
}

/**
 * Download a file from Google Drive
 */
async function downloadFile(drive, fileId, destPath) {
  try {
    const dest = fs.createWriteStream(destPath)
    const response = await drive.files.get(
      { fileId, alt: "media" },
      { responseType: "stream" }
    )

    return new Promise((resolve, reject) => {
      response.data
        .on("end", () => {
          console.log(`  ✓ Downloaded: ${path.basename(destPath)}`)
          resolve()
        })
        .on("error", (err) => {
          console.error(`  ✗ Error downloading: ${err.message}`)
          reject(err)
        })
        .pipe(dest)
    })
  } catch (error) {
    console.error(`Error downloading file: ${error.message}`)
    throw error
  }
}

/**
 * Parse info.txt file content
 */
function parseInfoFile(content) {
  const lines = content.split("\n")
  const metadata = {}
  let detailedContent = ""
  let inContent = false

  for (const line of lines) {
    if (line.trim() === "---") {
      inContent = true
      continue
    }

    if (!inContent) {
      const match = line.match(/^([A-Z_]+):\s*(.+)$/)
      if (match) {
        const key = match[1].toLowerCase()
        const value = match[2].trim()
        metadata[key] = value
      }
    } else {
      detailedContent += line + "\n"
    }
  }

  return { metadata, content: detailedContent.trim() }
}

/**
 * Create slug from folder name
 */
function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

/**
 * Process a single project folder
 */
async function processProjectFolder(drive, folder) {
  console.log(`\nProcessing: ${folder.name}`)

  const slug = createSlug(folder.name)
  const projectDir = path.join(PUBLIC_DIR, slug)

  // Create project directory
  if (!fs.existsSync(projectDir)) {
    fs.mkdirSync(projectDir, { recursive: true })
  }

  // Get all files in folder
  const files = await listFilesInFolder(drive, folder.id)

  // Find info.txt
  const infoFile = files.find((f) => f.name.toLowerCase() === "info.txt")
  if (!infoFile) {
    console.log(`  ⚠ No info.txt found, skipping...`)
    return null
  }

  // Download and parse info.txt
  const infoPath = path.join(projectDir, "info.txt")
  await downloadFile(drive, infoFile.id, infoPath)
  const infoContent = fs.readFileSync(infoPath, "utf8")
  const { metadata, content } = parseInfoFile(infoContent)

  // Download images
  const imageFiles = files.filter((f) =>
    /\.(jpg|jpeg|png|webp)$/i.test(f.name)
  )

  const images = []
  for (let i = 0; i < imageFiles.length; i++) {
    const imageFile = imageFiles[i]
    const ext = path.extname(imageFile.name)
    const imageName = `${String(i + 1).padStart(2, "0")}${ext}`
    const imagePath = path.join(projectDir, imageName)

    await downloadFile(drive, imageFile.id, imagePath)

    images.push({
      url: `/realizacje/${slug}/${imageName}`,
      alt: `${metadata.title || folder.name} - zdjęcie ${i + 1}`,
      caption: i === 0 ? metadata.description || "" : "",
    })
  }

  if (images.length === 0) {
    console.log(`  ⚠ No images found, skipping...`)
    return null
  }

  // Parse tags
  const tags = metadata.tags
    ? metadata.tags.split(",").map((t) => t.trim())
    : []

  // Create realization JSON
  const realization = {
    id: slug,
    title: metadata.title || folder.name,
    description: metadata.description || "",
    content: content || metadata.description || "",
    location: metadata.location || "",
    area: metadata.area || "",
    realizationDate: metadata.date || new Date().toISOString().split("T")[0],
    client: metadata.client || undefined,
    projectType: metadata.type || "inne",
    surface: metadata.surface || "epoksydowa",
    images,
    thumbnail: images[0],
    tags,
    featured: metadata.featured === "true",
    status: "published",
    seo: {
      metaTitle: `${metadata.title || folder.name} | Realizacja`,
      metaDescription:
        metadata.description ||
        `Zobacz realizację: ${metadata.title || folder.name}`,
      keywords: tags,
      canonicalUrl: `https://posadzkizywiczne.com/realizacje/${slug}`,
    },
  }

  // Save JSON file
  const jsonPath = path.join(DATA_DIR, `${slug}.json`)
  fs.writeFileSync(jsonPath, JSON.stringify(realization, null, 2), "utf8")
  console.log(`  ✓ Created: ${slug}.json`)

  // Clean up info.txt
  fs.unlinkSync(infoPath)

  return realization
}

/**
 * Main sync function
 */
async function syncFromGoogleDrive() {
  console.log("=== Google Drive Sync Started ===\n")

  try {
    // Authenticate
    console.log("Authenticating with Google Drive...")
    const authClient = await authenticate()
    const drive = google.drive({ version: "v3", auth: authClient })
    console.log("✓ Authenticated successfully\n")

    // Get folder ID
    const folderId = getFolderId()
    console.log(`Using folder ID: ${folderId}\n`)

    // List project folders
    console.log("Fetching project folders...")
    const folders = await listProjectFolders(drive, folderId)
    console.log(`✓ Found ${folders.length} project folders\n`)

    if (folders.length === 0) {
      console.log("No folders found. Make sure:")
      console.log("1. The folder ID is correct")
      console.log("2. The folder is shared with your service account")
      return
    }

    // Process each folder
    const results = []
    for (const folder of folders) {
      const result = await processProjectFolder(drive, folder)
      if (result) {
        results.push(result)
      }
    }

    console.log(`\n=== Sync Complete ===`)
    console.log(`✓ Processed ${results.length} realizations`)
    console.log(`✓ Data saved to: ${DATA_DIR}`)
    console.log(`✓ Images saved to: ${PUBLIC_DIR}`)
  } catch (error) {
    console.error("\n✗ Sync failed:", error.message)
    process.exit(1)
  }
}

// Run the sync
syncFromGoogleDrive()
