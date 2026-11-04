import type { Payload } from 'payload'

export const DEFAULT_CATEGORIES = [
  { name: 'Food', icon: '🍔', color: '#FF6B35', sortOrder: 1 },
  { name: 'Travel', icon: '✈️', color: '#1E88E5', sortOrder: 2 },
  { name: 'Beauty', icon: '💄', color: '#E91E63', sortOrder: 3 },
  { name: 'Clothes', icon: '👗', color: '#8E24AA', sortOrder: 4 },
  { name: 'Auto', icon: '🚗', color: '#455A64', sortOrder: 5 },
  { name: 'Landscaping', icon: '🌿', color: '#43A047', sortOrder: 6 },
]

/** Runs when the server starts: creates the 6 starter categories on a brand-new database. */
export const seedOnInit = async (payload: Payload) => {
  try {
    const { totalDocs } = await payload.count({ collection: 'categories' })
    if (totalDocs > 0) return
    for (const c of DEFAULT_CATEGORIES) {
      await payload.create({ collection: 'categories', data: { ...c, isActive: true } })
    }
    payload.logger.info('Seeded default categories')
  } catch (err) {
    payload.logger.error({ err }, 'Category seed skipped')
  }
}
