import { redirect } from 'next/navigation'

/** This app is only the dashboard + API. The home page sends you to the dashboard. */
export default function Home() {
  redirect('/admin')
}
