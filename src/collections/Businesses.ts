import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'
import { publishedOrStaff, staffOnly } from '../access'
import { slugField } from '../fields/slug'
import { searchBusinesses } from '../endpoints/searchBusinesses'

const DAYS = [
  { label: 'Monday', value: 'mon' },
  { label: 'Tuesday', value: 'tue' },
  { label: 'Wednesday', value: 'wed' },
  { label: 'Thursday', value: 'thu' },
  { label: 'Friday', value: 'fri' },
  { label: 'Saturday', value: 'sat' },
  { label: 'Sunday', value: 'sun' },
]

/** Copy city/state from the chosen City so the app can search fast without extra lookups. */
const syncLocation: CollectionBeforeChangeHook = async ({ data, req }) => {
  const locId = typeof data?.location === 'object' ? data?.location?.id : data?.location
  if (locId) {
    const loc = await req.payload.findByID({ collection: 'locations', id: locId, depth: 0, req })
    if (loc) {
      data.city = loc.city
      data.state = loc.state
    }
  }
  return data
}

export const Businesses: CollectionConfig = {
  slug: 'businesses',
  labels: { singular: 'Business', plural: 'Businesses' },
  admin: {
    group: 'Directory',
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'location', 'isTopBusiness', '_status', 'updatedAt'],
    listSearchableFields: ['name', 'tagline', 'city'],
    description: 'Every business shown in the app. Fill the tabs from left to right, then click "Publish".',
    pagination: { defaultLimit: 25 },
  },
  versions: {
    drafts: { autosave: { interval: 2000 } },
    maxPerDoc: 25,
  },
  access: {
    read: publishedOrStaff,
    create: staffOnly,
    update: staffOnly,
    delete: staffOnly,
    readVersions: staffOnly,
  },
  endpoints: [{ path: '/search', method: 'get', handler: searchBusinesses }],
  hooks: { beforeChange: [syncLocation] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: '1. Basics',
          description: 'Name, category and the text people read.',
          fields: [
            { name: 'name', type: 'text', required: true, index: true, label: 'Business name' },
            {
              type: 'row',
              fields: [
                {
                  name: 'category',
                  type: 'relationship',
                  relationTo: 'categories',
                  required: true,
                  index: true,
                  admin: { width: '50%' },
                },
                {
                  name: 'priceRange',
                  type: 'select',
                  label: 'Price range',
                  options: ['$', '$$', '$$$', '$$$$'],
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'tagline',
              type: 'text',
              maxLength: 90,
              admin: { description: 'One short line under the name, e.g. "Authentic street tacos since 1998".' },
            },
            {
              name: 'shortDescription',
              type: 'textarea',
              maxLength: 280,
              label: 'Short description',
              admin: { description: 'Shown on the business card and in search results (max 280 characters).' },
            },
            {
              name: 'description',
              type: 'richText',
              label: 'Full description',
              admin: { description: 'Shown on the business page. You can use bold, lists and links.' },
            },
            {
              name: 'tags',
              type: 'text',
              hasMany: true,
              admin: { description: 'Keywords that help search, e.g. tacos, vegan, delivery. Press Enter after each.' },
            },
          ],
        },
        {
          label: '2. Photos & Video',
          description: 'The first thing people see. Use bright, horizontal photos.',
          fields: [
            {
              name: 'coverImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'Main photo',
              filterOptions: { mimeType: { contains: 'image' } },
              admin: { description: 'Shown in lists and at the top of the business page.' },
            },
            {
              name: 'gallery',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              label: 'Photo gallery',
              filterOptions: { mimeType: { contains: 'image' } },
              admin: { description: 'Extra photos people can swipe through. You can select many at once.' },
            },
            {
              name: 'video',
              type: 'upload',
              relationTo: 'media',
              label: 'Video (upload)',
              filterOptions: { mimeType: { contains: 'video' } },
              admin: { description: 'MP4 works best. Keep it under 60 seconds for fast loading.' },
            },
            {
              name: 'videoUrl',
              type: 'text',
              label: 'Or video link (YouTube / Vimeo)',
            },
          ],
        },
        {
          label: '3. Location',
          fields: [
            {
              name: 'location',
              type: 'relationship',
              relationTo: 'locations',
              required: true,
              label: 'City',
              admin: { description: 'Pick the city. Not in the list? Click "+" to add it.' },
            },
            { name: 'address', type: 'text', label: 'Street address' },
            {
              type: 'row',
              fields: [
                { name: 'zipCode', type: 'text', label: 'ZIP code', admin: { width: '33%' } },
                { name: 'latitude', type: 'number', admin: { width: '33%', description: 'Optional (for maps)' } },
                { name: 'longitude', type: 'number', admin: { width: '33%', description: 'Optional (for maps)' } },
              ],
            },
            // Filled in automatically from the City (used for fast search)
            { name: 'city', type: 'text', index: true, admin: { hidden: true } },
            { name: 'state', type: 'text', index: true, admin: { hidden: true } },
          ],
        },
        {
          label: '4. Contact & Hours',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'phone', type: 'text', admin: { width: '33%' } },
                { name: 'email', type: 'email', admin: { width: '33%' } },
                { name: 'website', type: 'text', admin: { width: '33%' } },
              ],
            },
            {
              name: 'social',
              type: 'group',
              label: 'Social media',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'instagram', type: 'text', admin: { width: '33%' } },
                    { name: 'facebook', type: 'text', admin: { width: '33%' } },
                    { name: 'tiktok', type: 'text', admin: { width: '33%' } },
                  ],
                },
              ],
            },
            {
              name: 'hours',
              type: 'array',
              label: 'Opening hours',
              labels: { singular: 'Day', plural: 'Days' },
              admin: { initCollapsed: false },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'day', type: 'select', options: DAYS, required: true, admin: { width: '30%' } },
                    { name: 'opens', type: 'text', admin: { width: '25%', placeholder: '9:00 AM' } },
                    { name: 'closes', type: 'text', admin: { width: '25%', placeholder: '6:00 PM' } },
                    { name: 'closed', type: 'checkbox', label: 'Closed', admin: { width: '20%' } },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    // ----- Sidebar -----
    slugField('name'),
    {
      name: 'isTopBusiness',
      type: 'checkbox',
      label: '⭐ Top business',
      defaultValue: false,
      index: true,
      admin: { position: 'sidebar', description: 'Shows in the "Top businesses" section of the app.' },
    },
    {
      name: 'topRank',
      type: 'number',
      label: 'Top position',
      min: 1,
      admin: {
        position: 'sidebar',
        condition: (data) => Boolean(data?.isTopBusiness),
        description: '1 = first in the list.',
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      label: 'Featured (home banner)',
      defaultValue: false,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      type: 'row',
      admin: { position: 'sidebar' },
      fields: [
        { name: 'rating', type: 'number', min: 0, max: 5, admin: { step: 0.1, width: '50%' } },
        { name: 'reviewCount', type: 'number', min: 0, label: 'Reviews', admin: { width: '50%' } },
      ],
    },
  ],
}
