import type { CollectionConfig } from 'payload'
import { adminOnly, adminOnlyField, isAdminUser, isStaffUser } from '../access'

/**
 * People who log in to THIS dashboard (you and your team).
 * - Admin: can do everything, including adding team members.
 * - Editor: can add/edit businesses, photos and app content, but not manage the team.
 */
export const Admins: CollectionConfig = {
  slug: 'admins',
  labels: { singular: 'Team member', plural: 'Team (dashboard logins)' },
  auth: {
    tokenExpiration: 60 * 60 * 12, // 12 hours
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
  },
  admin: {
    group: 'Settings & Team',
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role'],
    description: 'People who can log in to this dashboard.',
  },
  access: {
    read: ({ req }) => isStaffUser(req),
    create: adminOnly,
    update: ({ req }) => (isAdminUser(req) ? true : { id: { equals: req.user?.id } }),
    delete: adminOnly,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'admin',
      options: [
        { label: 'Admin (full access)', value: 'admin' },
        { label: 'Editor (content only)', value: 'editor' },
      ],
      access: { update: adminOnlyField },
      admin: { position: 'sidebar' },
    },
  ],
}
