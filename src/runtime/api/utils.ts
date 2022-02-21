import { IncomingMessage } from 'http'

export const hasData = (property) => property !== undefined

export const parseUrlSegments = (req: IncomingMessage) => {
  const parts = req.url.split('?')[0]
  const segments = parts.split('/').filter((p) => p !== '')
  return segments
}
