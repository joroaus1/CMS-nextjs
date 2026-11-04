import type { CollectionConfig } from 'payload'
import { anyone, staffOnly } from '../access'
import { slugField } from '../fields/slug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Category', plural: 'Categories' },
  defaultSort: 'sortOrder',
  admin: {
    group: 'Directory',
    useAsTitle: 'name',
    defaultColumns: ['icon', 'name', 'sortOrder', 'isActive'],
    description: 'Food, Travel, Beauty… The order here is the order in the app.',
  },
  access: { read: anyone, create: staffOnly, update: staffOnly, delete: staffOnly },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { width: '60%' } },
        {
          name: 'icon',
          type: 'text',
          label: 'Icon (emoji)',
          defaultValue: '⭐',
          admin: { width: '20%', description: 'Paste one emoji, e.g. 🍔' },
        },
        {
          name: 'color',
          type: 'text',
          label: 'Accent color',
          defaultValue: '#FF385C',
          admin: { width: '20%', description: 'Hex color, e.g. #FF385C' },
        },
      ],
    },
    { name: 'description', type: 'textarea', maxLength: 200 },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Cover photo',
      filterOptions: { mimeType: { contains: 'image' } },
    },
    slugField('name'),
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      label: 'Display order',
      admin: { position: 'sidebar', description: 'Lower numbers show first.' },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show in app',
      admin: { position: 'sidebar' },
    },
  ],
}
