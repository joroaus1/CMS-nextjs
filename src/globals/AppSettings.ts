import type { GlobalConfig } from 'payload'
import { anyone, staffOnly } from '../access'

/** Branding and links used across the whole PWA (name, logo, colors, app icon). */
export const AppSettings: GlobalConfig = {
  slug: 'app-settings',
  label: 'App branding & settings',
  admin: {
    group: 'Settings & Team',
    description: 'App name, logo, colors and legal links used everywhere in the app.',
  },
  access: { read: anyone, update: staffOnly },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'appName', type: 'text', required: true, defaultValue: 'Directory', admin: { width: '60%' } },
        {
          name: 'shortName',
          type: 'text',
          defaultValue: 'Directory',
          maxLength: 12,
          admin: { width: '40%', description: 'Shown under the icon on phones (max 12 letters).' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          filterOptions: { mimeType: { contains: 'image' } },
          admin: { width: '50%' },
        },
        {
          name: 'appIcon',
          type: 'upload',
          relationTo: 'media',
          label: 'App icon (square, 512×512 PNG)',
          filterOptions: { mimeType: { contains: 'image' } },
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'brandColor', type: 'text', defaultValue: '#FF385C', admin: { width: '50%', description: 'Main buttons & highlights' } },
        { name: 'backgroundColor', type: 'text', defaultValue: '#FFFFFF', admin: { width: '50%' } },
      ],
    },
    { name: 'supportEmail', type: 'email' },
    {
      type: 'row',
      fields: [
        { name: 'termsUrl', type: 'text', label: 'Terms of service link', admin: { width: '50%' } },
        { name: 'privacyUrl', type: 'text', label: 'Privacy policy link', admin: { width: '50%' } },
      ],
    },
  ],
}
