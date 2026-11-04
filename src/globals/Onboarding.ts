import type { GlobalConfig } from 'payload'
import { anyone, staffOnly } from '../access'

/** The intro screens a new user swipes through the first time they open the app. */
export const Onboarding: GlobalConfig = {
  slug: 'onboarding',
  label: 'Onboarding screens',
  admin: {
    group: 'App Content',
    description: 'The swipeable intro screens shown the first time someone opens the app.',
  },
  access: { read: anyone, update: staffOnly },
  versions: { drafts: true },
  fields: [
    {
      name: 'slides',
      type: 'array',
      label: 'Screens',
      labels: { singular: 'Screen', plural: 'Screens' },
      minRows: 1,
      maxRows: 6,
      admin: {
        description: 'Drag to reorder. 3 screens is the sweet spot.',
        components: { RowLabel: '/components/SlideRowLabel#SlideRowLabel' },
      },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'subtitle', type: 'textarea', maxLength: 160 },
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          label: 'Background photo or video',
          required: true,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'nextButtonText', type: 'text', defaultValue: 'Next', admin: { width: '33%' } },
        { name: 'finishButtonText', type: 'text', defaultValue: 'Get started', admin: { width: '33%' } },
        { name: 'skipButtonText', type: 'text', defaultValue: 'Skip', admin: { width: '33%' } },
      ],
    },
  ],
}
