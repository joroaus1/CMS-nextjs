import type { CollectionConfig } from 'payload'
import { anyone, isAdminUser, selfOrStaff } from '../access'
import { US_STATES } from '../data/usStates'

/**
 * People who use the PWA (sign up / sign in / profile / favorites).
 * They can NOT log in to this dashboard.
 *
 * PWA endpoints (all under /api/app-users):
 *   POST /api/app-users            -> sign up
 *   POST /api/app-users/login      -> sign in  (returns { token, user })
 *   POST /api/app-users/logout     -> sign out
 *   GET  /api/app-users/me         -> current user (profile)
 *   PATCH /api/app-users/:id       -> update profile / favorites
 *   POST /api/app-users/forgot-password, /reset-password
 */
export const AppUsers: CollectionConfig = {
  slug: 'app-users',
  labels: { singular: 'App user', plural: 'App users' },
  auth: {
    tokenExpiration: 60 * 60 * 24 * 30, // stay signed in for 30 days
    maxLoginAttempts: 10,
    lockTime: 10 * 60 * 1000,
    cookies: {
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    },
  },
  admin: {
    group: 'App Users',
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'email', 'city', 'state', 'createdAt'],
    listSearchableFields: ['fullName', 'email'],
    description: 'People who signed up in the app. You normally do not need to edit these.',
  },
  access: {
    // Anyone can create an account from the app
    create: anyone,
    read: selfOrStaff,
    update: selfOrStaff,
    delete: ({ req }) => {
      if (isAdminUser(req)) return true
      if (req.user?.collection === 'app-users') return { id: { equals: req.user.id } }
      return false
    },
    // App users can never enter the dashboard
    admin: () => false,
  },
  fields: [
    { name: 'fullName', type: 'text', label: 'Full name', required: true },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      label: 'Profile photo',
      filterOptions: { mimeType: { contains: 'image' } },
    },
    { name: 'phone', type: 'text' },
    {
      type: 'row',
      fields: [
        { name: 'city', type: 'text', admin: { width: '50%' } },
        { name: 'state', type: 'select', options: US_STATES, admin: { width: '50%' } },
      ],
    },
    {
      name: 'favoriteCategories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: { description: 'Chosen during onboarding — used to personalize the home screen.' },
    },
    {
      name: 'favorites',
      label: 'Saved businesses',
      type: 'relationship',
      relationTo: 'businesses',
      hasMany: true,
    },
    {
      name: 'onboardingCompleted',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
  ],
}
