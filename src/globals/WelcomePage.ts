import type { GlobalConfig } from 'payload'
import { anyone, staffOnly } from '../access'

/** The home screen users land on after signing in. */
export const WelcomePage: GlobalConfig = {
  slug: 'welcome-page',
  label: 'Welcome / Home screen',
  admin: {
    group: 'App Content',
    description: 'What people see right after they sign in.',
  },
  access: { read: anyone, update: staffOnly },
  versions: { drafts: true },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Header',
          fields: [
            {
              name: 'greeting',
              type: 'text',
              defaultValue: 'Welcome back',
              admin: { description: 'The app adds the user\'s first name after this, e.g. "Welcome back, Ana".' },
            },
            { name: 'headline', type: 'text', defaultValue: 'Discover the best local businesses' },
            { name: 'subheadline', type: 'text' },
            {
              name: 'heroMedia',
              type: 'upload',
              relationTo: 'media',
              label: 'Top banner photo or video',
            },
            { name: 'searchPlaceholder', type: 'text', defaultValue: 'Search city or state' },
          ],
        },
        {
          label: 'Sections',
          fields: [
            {
              name: 'featuredCategories',
              type: 'relationship',
              relationTo: 'categories',
              hasMany: true,
              admin: { description: 'Leave empty to show all active categories.' },
            },
            {
              name: 'featuredBusinesses',
              type: 'relationship',
              relationTo: 'businesses',
              hasMany: true,
              label: 'Hand-picked businesses (banner)',
            },
            { name: 'topBusinessesTitle', type: 'text', defaultValue: 'Top businesses' },
            { name: 'popularCitiesTitle', type: 'text', defaultValue: 'Popular cities' },
          ],
        },
      ],
    },
  ],
}
