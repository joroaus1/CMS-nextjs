'use client'
import { useRowLabel } from '@payloadcms/ui'

export const SlideRowLabel = () => {
  const { data, rowNumber } = useRowLabel<{ title?: string }>()
  return <span>{`Screen ${(rowNumber ?? 0) + 1}${data?.title ? ` — ${data.title}` : ''}`}</span>
}
