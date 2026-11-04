import type { Payload } from 'payload'

type Props = { payload: Payload; user?: { name?: string } }

const card = (href: string, emoji: string, title: string, text: string) => ({ href, emoji, title, text })

/** Friendly home panel shown at the top of the dashboard. */
export const BeforeDashboard = async ({ payload, user }: Props) => {
  const [businesses, published, media, users] = await Promise.all([
    payload.count({ collection: 'businesses' }),
    payload.count({ collection: 'businesses', where: { _status: { equals: 'published' } } }),
    payload.count({ collection: 'media' }),
    payload.count({ collection: 'app-users' }),
  ])

  const stats = [
    { label: 'Businesses', value: businesses.totalDocs },
    { label: 'Live in app', value: published.totalDocs },
    { label: 'Photos & videos', value: media.totalDocs },
    { label: 'App users', value: users.totalDocs },
  ]

  const actions = [
    card('/admin/collections/businesses/create', '🏪', 'Add a business', 'Name, photos, city, hours — then Publish.'),
    card('/admin/collections/media', '🖼️', 'Upload photos & videos', 'Drag & drop many files at once.'),
    card('/admin/globals/onboarding', '👋', 'Onboarding screens', 'The intro screens new users swipe through.'),
    card('/admin/globals/welcome-page', '🏠', 'Welcome / Home screen', 'Banner, greeting and featured picks.'),
  ]

  return (
    <div className="dcms-home">
      <div className="dcms-home__hero">
        <h2>Hi{user?.name ? `, ${user.name.split(' ')[0]}` : ''} 👋</h2>
        <p>What would you like to do today?</p>
      </div>
      <div className="dcms-home__stats">
        {stats.map((s) => (
          <div key={s.label} className="dcms-stat">
            <span className="dcms-stat__value">{s.value}</span>
            <span className="dcms-stat__label">{s.label}</span>
          </div>
        ))}
      </div>
      <div className="dcms-home__actions">
        {actions.map((a) => (
          <a key={a.href} href={a.href} className="dcms-action">
            <span className="dcms-action__emoji">{a.emoji}</span>
            <span className="dcms-action__title">{a.title}</span>
            <span className="dcms-action__text">{a.text}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
