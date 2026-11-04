import type { Access, FieldAccess, PayloadRequest } from 'payload'

/** Dashboard staff = anyone logged in to the admin panel (Admins collection). */
export const isStaffUser = (req: PayloadRequest): boolean => req.user?.collection === 'admins'

export const isAdminUser = (req: PayloadRequest): boolean =>
  req.user?.collection === 'admins' && (req.user as { role?: string }).role === 'admin'

export const anyone: Access = () => true
export const staffOnly: Access = ({ req }) => isStaffUser(req)
export const adminOnly: Access = ({ req }) => isAdminUser(req)
export const adminOnlyField: FieldAccess = ({ req }) => isAdminUser(req)

/** Public sees only published documents; staff see drafts too. */
export const publishedOrStaff: Access = ({ req }) => {
  if (isStaffUser(req)) return true
  return { _status: { equals: 'published' } }
}

/** App users can manage only their own account; staff can manage all. */
export const selfOrStaff: Access = ({ req }) => {
  if (isStaffUser(req)) return true
  if (req.user?.collection === 'app-users') return { id: { equals: req.user.id } }
  return false
}
