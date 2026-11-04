import type { Field, FieldHook } from 'payload'

export const toSlug = (value: string): string =>
  value
    .toString()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

/**
 * A "web address" field that fills itself in from another field (e.g. the name).
 * Editors never need to type it, but they can override it.
 */
export const slugField = (sourceFields: string | string[] = 'name'): Field => {
  const sources = Array.isArray(sourceFields) ? sourceFields : [sourceFields]

  const formatSlug: FieldHook = ({ value, data, originalDoc }) => {
    if (typeof value === 'string' && value.trim().length > 0) return toSlug(value)
    const parts = sources
      .map((key) => data?.[key] ?? originalDoc?.[key])
      .filter((v) => typeof v === 'string' && v.length > 0)
    return parts.length ? toSlug(parts.join(' ')) : value
  }

  return {
    name: 'slug',
    type: 'text',
    index: true,
    unique: true,
    label: 'Web address (slug)',
    admin: {
      position: 'sidebar',
      description: 'Filled in automatically from the name. Used in links, e.g. /business/joes-tacos',
    },
    hooks: { beforeValidate: [formatSlug] },
  }
}
