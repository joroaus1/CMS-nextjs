/**
 * OPTIONAL demo data so you can see how the app looks.
 * Run with:  npm run seed:demo
 * Delete the demo businesses from the dashboard whenever you like.
 */
import { getPayload } from 'payload'
import sharp from 'sharp'
import config from '@payload-config'

const palette = [
  ['#FF6B35', '#F7931E'],
  ['#1E88E5', '#00ACC1'],
  ['#E91E63', '#FF8A80'],
  ['#8E24AA', '#5E35B1'],
  ['#455A64', '#90A4AE'],
  ['#43A047', '#C0CA33'],
]

const makeImage = async (rawTitle: string, emoji: string, i: number) => {
  const title = rawTitle.replace(/&/g, '&amp;').replace(/</g, '&lt;')
  const [a, b] = palette[i % palette.length]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
    <rect width="1600" height="1000" fill="url(#g)"/>
    <circle cx="1300" cy="200" r="260" fill="#fff" opacity=".08"/>
    <circle cx="250" cy="880" r="320" fill="#fff" opacity=".06"/>
    <text x="800" y="520" font-size="260" text-anchor="middle" font-family="sans-serif">${emoji}</text>
    <text x="800" y="760" font-size="84" fill="#fff" text-anchor="middle" font-family="sans-serif" font-weight="700">${title}</text>
  </svg>`
  return sharp(Buffer.from(svg)).jpeg({ quality: 85 }).toBuffer()
}

const run = async () => {
  const payload = await getPayload({ config })

  const cats = await payload.find({ collection: 'categories', limit: 50 })
  const cat = (name: string) => cats.docs.find((c) => c.name === name)!.id

  const cities = [
    { city: 'Miami', state: 'FL', isFeatured: true },
    { city: 'Austin', state: 'TX', isFeatured: true },
    { city: 'Los Angeles', state: 'CA', isFeatured: true },
  ]
  const loc: Record<string, number> = {}
  for (const [i, c] of cities.entries()) {
    const existing = await payload.find({ collection: 'locations', where: { city: { equals: c.city } } })
    if (existing.docs[0]) {
      loc[c.city] = existing.docs[0].id
      continue
    }
    const img = await makeImage(`${c.city}, ${c.state}`, '🏙️', i + 1)
    const media = await payload.create({
      collection: 'media',
      data: { alt: `${c.city} skyline` },
      file: { data: img, mimetype: 'image/jpeg', name: `${c.city.toLowerCase().replace(/ /g, '-')}.jpg`, size: img.length },
    })
    const doc = await payload.create({ collection: 'locations', data: { ...c, coverImage: media.id } as never })
    loc[c.city] = doc.id
  }

  const businesses = [
    { name: "Lupita's Taqueria", category: 'Food', city: 'Miami', emoji: '🌮', tagline: 'Street tacos since 1998', rating: 4.8, top: 1 },
    { name: 'Glow Studio', category: 'Beauty', city: 'Austin', emoji: '💅', tagline: 'Nails, lashes & brows', rating: 4.9, top: 2 },
    { name: 'Sunset Getaways', category: 'Travel', city: 'Los Angeles', emoji: '🌴', tagline: 'Weekend trips made easy', rating: 4.6, top: 3 },
    { name: 'Thread & Co.', category: 'Clothes', city: 'Miami', emoji: '👕', tagline: 'Local designers, fair prices', rating: 4.5 },
    { name: 'Precision Auto Care', category: 'Auto', city: 'Austin', emoji: '🔧', tagline: 'Honest repairs, same-day service', rating: 4.7, top: 4 },
    { name: 'Green Roots Landscaping', category: 'Landscaping', city: 'Los Angeles', emoji: '🌳', tagline: 'Gardens that wow', rating: 4.8 },
  ]

  for (const [i, b] of businesses.entries()) {
    const exists = await payload.find({ collection: 'businesses', where: { name: { equals: b.name } }, draft: true })
    if (exists.docs[0]) continue
    const img = await makeImage(b.name, b.emoji, i)
    const media = await payload.create({
      collection: 'media',
      data: { alt: b.name },
      file: { data: img, mimetype: 'image/jpeg', name: `${b.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.jpg`, size: img.length },
    })
    await payload.create({
      collection: 'businesses',
      draft: false,
      data: {
        name: b.name,
        tagline: b.tagline,
        shortDescription: `${b.name} is one of the most loved ${b.category.toLowerCase()} spots in ${b.city}.`,
        category: cat(b.category),
        location: loc[b.city],
        coverImage: media.id,
        rating: b.rating,
        reviewCount: 40 + i * 17,
        priceRange: '$$',
        isTopBusiness: Boolean(b.top),
        topRank: b.top,
        isFeatured: i < 2,
        phone: '(305) 555-01' + (10 + i),
        hours: [
          { day: 'mon', opens: '9:00 AM', closes: '6:00 PM' },
          { day: 'sat', opens: '10:00 AM', closes: '4:00 PM' },
          { day: 'sun', closed: true },
        ],
        _status: 'published',
      } as never,
    })
  }

  payload.logger.info('Demo data ready')
  process.exit(0)
}

await run()
