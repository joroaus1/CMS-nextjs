import type { PayloadHandler, Where } from 'payload'

/**
 * GET /api/businesses/search
 *   ?q=tacos           free text (name, tagline, tags)
 *   &city=Miami        city name (partial match)
 *   &state=FL          2-letter state
 *   &category=food     category slug
 *   &top=true          only "Top businesses"
 *   &featured=true     only featured
 *   &page=1&limit=20
 *
 * Built for the PWA search bar. Only published businesses are returned.
 */
export const searchBusinesses: PayloadHandler = async (req) => {
  const params = new URL(req.url || '', 'http://localhost').searchParams
  const q = params.get('q')?.trim()
  const city = params.get('city')?.trim()
  const state = params.get('state')?.trim().toUpperCase()
  const category = params.get('category')?.trim()
  const limit = Math.min(Math.max(Number(params.get('limit')) || 20, 1), 100)
  const page = Math.max(Number(params.get('page')) || 1, 1)

  const and: Where[] = [{ _status: { equals: 'published' } }]
  if (q) {
    and.push({
      or: [{ name: { like: q } }, { tagline: { like: q } }, { tags: { contains: q } }, { city: { like: q } }],
    })
  }
  if (city) and.push({ city: { like: city } })
  if (state) and.push({ state: { equals: state } })
  if (category) and.push({ 'category.slug': { equals: category } })
  if (params.get('top') === 'true') and.push({ isTopBusiness: { equals: true } })
  if (params.get('featured') === 'true') and.push({ isFeatured: { equals: true } })

  const result = await req.payload.find({
    collection: 'businesses',
    where: { and },
    sort: params.get('top') === 'true' ? 'topRank' : '-rating',
    depth: 1,
    limit,
    page,
    req,
    overrideAccess: false,
  })

  return Response.json(result, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
  })
}
