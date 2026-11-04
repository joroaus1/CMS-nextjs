import type { CollectionConfig } from 'payload'
import { anyone, staffOnly } from '../access'
import { US_STATES } from '../data/usStates'
import { slugField } from '../fields/slug'

/** Cities the app covers. Powers the "City, State" search bar. */
export const Locations: CollectionConfig = {
  slug: 'locations',
  labels: { singular: 'City', plural: 'Cities' },
  defaultSort: 'displayName',
  admin: {
    group: 'Directory',
    useAsTitle: 'displayName',
    defaultColumns: ['displayName', 'state', 'isFeatured'],
    listSearchableFields: ['city', 'displayName'],
    description: 'Cities where you list businesses. Add a city once, then pick it on each business.',
  },
  access: { read: anyone, create: staffOnly, update: staffOnly, delete: staffOnly },
  indexes: [{ fields: ['city', 'state'], unique: true }],
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data?.city && data?.state) data.displayName = `${String(data.city).trim()}, ${data.state}`
        return data
      },
    ],
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'city', type: 'text', required: true, index: true, admin: { width: '50%' } },
        { name: 'state', type: 'select', options: US_STATES, required: true, index: true, admin: { width: '50%' } },
      ],
    },
    {
      name: 'displayName',
      type: 'text',
      index: true,
      admin: { readOnly: true, description: 'Created automatically, e.g. "Miami, FL".' },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'City photo',
      filterOptions: { mimeType: { contains: 'image' } },
    },
    slugField(['city', 'state']),
    {
      name: 'isFeatured',
      type: 'checkbox',
      label: 'Feature on home screen',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
  ],
}
