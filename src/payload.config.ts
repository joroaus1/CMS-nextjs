import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Admins } from './collections/Admins'
import { AppUsers } from './collections/AppUsers'
import { Businesses } from './collections/Businesses'
import { Categories } from './collections/Categories'
import { Locations } from './collections/Locations'
import { Media } from './collections/Media'
import { AppSettings } from './globals/AppSettings'
import { Onboarding } from './globals/Onboarding'
import { WelcomePage } from './globals/WelcomePage'
import { migrations } from './migrations'
import { seedOnInit } from './seed/onInit'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const serverURL = (process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(/\/$/, '')

/** Your PWA address(es), comma-separated. They are allowed to call this API. */
const frontendURLs = (process.env.FRONTEND_URLS || 'http://localhost:3001')
  .split(',')
  .map((u) => u.trim().replace(/\/$/, ''))
  .filter(Boolean)
const allowedOrigins = Array.from(new Set([serverURL, ...frontendURLs]))

/** Supabase needs SSL. We strip ?sslmode=... from the URL and set SSL here so it always works. */
const rawDbUrl = process.env.DATABASE_URL || ''
const dbUrl = rawDbUrl.replace(/([?&])sslmode=[^&]*&?/, '$1').replace(/[?&]$/, '')
const useSSL = process.env.DATABASE_SSL === 'true' || /supabase\.(co|com)/.test(dbUrl)

/** Cloudflare R2 is turned on automatically when the R2_* variables are filled in. */
const r2Enabled = Boolean(
  process.env.R2_BUCKET && process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY,
)
const r2PublicURL = (process.env.R2_PUBLIC_URL || '').replace(/\/$/, '')

export default buildConfig({
  serverURL,
  admin: {
    user: Admins.slug,
    avatar: 'default',
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: ' · Directory Studio',
      description: 'Content dashboard for the Directory app',
    },
    components: {
      graphics: {
        Logo: '/components/Logo#Logo',
        Icon: '/components/Logo#Icon',
      },
      beforeDashboard: ['/components/BeforeDashboard#BeforeDashboard'],
    },
    dateFormat: 'MMM d, yyyy h:mm a',
  },
  collections: [Businesses, Categories, Locations, Media, AppUsers, Admins],
  globals: [Onboarding, WelcomePage, AppSettings],
  folders: { browseByFolder: true },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  cors: allowedOrigins,
  csrf: allowedOrigins,
  upload: {
    limits: { fileSize: 524_288_000 }, // 500 MB (videos)
  },
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: {
      connectionString: dbUrl,
      max: Number(process.env.DATABASE_POOL_MAX || 10),
      ...(useSSL ? { ssl: { rejectUnauthorized: false } } : {}),
    },
    // Never auto-change the database in dev mode — only through versioned migrations (safe for Supabase)
    push: false,
    // Database tables are created/updated automatically when the server starts
    prodMigrations: migrations,
  }),
  sharp,
  endpoints: [
    {
      path: '/health',
      method: 'get',
      handler: async () => Response.json({ status: 'ok', time: new Date().toISOString() }),
    },
  ],
  plugins: [
    s3Storage({
      enabled: r2Enabled,
      alwaysInsertFields: true,
      collections: {
        media: r2PublicURL
          ? {
              prefix: 'media',
              disablePayloadAccessControl: true,
              generateFileURL: ({ filename, prefix }) =>
                `${r2PublicURL}/${prefix ? `${prefix}/` : ''}${filename}`,
            }
          : { prefix: 'media' },
      },
      bucket: process.env.R2_BUCKET || '',
      config: {
        endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        region: 'auto',
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
        },
      },
    }),
  ],
  onInit: seedOnInit,
})
