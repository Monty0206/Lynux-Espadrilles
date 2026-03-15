import { createWriteStream, existsSync, mkdirSync } from 'fs'
import { pipeline } from 'stream/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.join(__dirname, '..', 'public', 'images')

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true })

const images = [
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2022/07/Ariana-Strips.png", filename: "ariana.png" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/NERINE-VISSER-X-PRODUCT-SHOTS_-12.jpg", filename: "carnero-slipper.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2022/07/NERINE-VISSER-X-PRODUCT-SHOTS_-49.jpg", filename: "florencia-cerrada.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2022/07/FLORENCIA-CERRADA.jpg", filename: "florencia-cerrada-2.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2025/12/Lucia-Leopard-Print.png", filename: "lucia-wedge.png" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/LynettShoe3-800x800.jpg", filename: "renata.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/NERINE-VISSER-X-PRODUCT-SHOTS_-14.jpg", filename: "the-bella.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/The-Lynux-Multi-Color.png", filename: "the-lynux.png" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/The-Lynux-Multi-Color2.png", filename: "the-lynux-2.png" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/NERINE-VISSER-X-PRODUCT-SHOTS_-5.jpg", filename: "the-lynux-3.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/NERINE-VISSER-X-PRODUCT-SHOTS_-6.jpg", filename: "the-lynux-4.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/NERINE-VISSER-X-PRODUCT-SHOTS_-7.jpg", filename: "the-lynux-5.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/NERINE-VISSER-X-LYNUX-X-CONTENT-X-FINALS-11-scaled.jpg", filename: "the-lynux-6.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/NERINE-VISSER-X-LYNUX-2-9-scaled.jpg", filename: "the-lynux-7.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/NERINE-VISSER-X-LYNUX-LIFESTYLE-6-scaled.jpg", filename: "the-lynux-8.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2023/11/the-Mule-Leopard.webp", filename: "the-mule.webp" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2023/11/NERINE-VISSER-X-PRODUCT-SHOTS_-4.jpg", filename: "the-mule-2.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2023/11/NERINE-VISSER-X-LYNUX-X-CONTENT-X-FINALS-2-scaled.jpg", filename: "the-mule-3.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2023/11/NERINE-VISSERR-X-LYNUX-X-CONTENT-X-FINAL-3-scaled.jpg", filename: "the-mule-4.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2023/11/The-Mule-Leopard-Print.webp", filename: "the-mule-5.webp" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/NERINE-VISSER-X-PRODUCT-SHOTS_-36-scaled.jpg", filename: "the-tina.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2022/07/Valeira-Multi-Color.png", filename: "valeria.png" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2022/07/Ximera-800x800.jpg", filename: "ximera-leather.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2022/07/FLORENCIA-CERRADA.jpg", filename: "about-hero.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2013/06/LynettShoe2.jpg", filename: "homepage-banner.jpg" },
  { url: "https://lynuxespadrilles.co.za/wp-content/uploads/2023/04/Lynux-Espadrilles-Logo-Name-removebg-preview-1-e1681983614777.png", filename: "logo.png" }
]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

async function downloadImage({ url, filename }) {
  const dest = path.join(OUT_DIR, filename)
  if (existsSync(dest)) {
    console.log(`⏭  Skipping (exists): ${filename}`)
    return
  }
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LynuxImageFetcher/1.0)',
        'Referer': 'https://lynuxespadrilles.co.za/'
      }
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const writer = createWriteStream(dest)
    await pipeline(res.body, writer)
    console.log(`✓  Downloaded: ${filename}`)
  } catch (err) {
    console.error(`✗  Failed: ${filename} — ${err.message}`)
  }
}

for (const img of images) {
  await downloadImage(img)
  await delay(300)
}

console.log('\nDone.')
