import type { CollectionConfig } from 'payload'
import { anyone, isStaffUser } from '../access'

/**
 * The Media Library: every photo and video you upload lives here
 * (stored in Cloudflare R2 in production). Drag & drop several files at once.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Photo / Video', plural: 'Media Library' },
  folders: true,
  admin: {
    group: 'Media Library',
    defaultColumns: ['filename', 'alt', 'mimeType', 'filesize', 'updatedAt'],
    description:
      'Drag and drop photos or videos here. Tip: use "Bulk upload" to add many at once, and create folders per business.',
  },
  access: {
    read: anyone,
    // Staff can upload anything; signed-in app users can upload (profile photos)
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => isStaffUser(req),
    delete: ({ req }) => isStaffUser(req),
  },
  upload: {
    mimeTypes: ['image/*', 'video/mp4', 'video/webm', 'video/quicktime'],
    focalPoint: true,
    crop: true,
    adminThumbnail: 'thumbnail',
    // Optimised versions created automatically for fast loading in the app
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre', formatOptions: { format: 'webp', options: { quality: 80 } } },
      { name: 'card', width: 768, height: 512, position: 'centre', formatOptions: { format: 'webp', options: { quality: 82 } } },
      { name: 'hero', width: 1600, height: 900, position: 'centre', formatOptions: { format: 'webp', options: { quality: 85 } } },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Short description',
      admin: { description: 'Describe the photo in a few words (helps blind users & Google). E.g. "Tacos on a wooden table".' },
    },
    { name: 'caption', type: 'text' },
  ],
}
