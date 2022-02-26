import { IncomingMessage } from 'http'
import { useQuery, useMethod, useBody } from 'h3'
import { LDError, LDUserActions } from '../types'
import getLDClient from './get-client'
import { hasData, parseUrlSegments } from './utils'
import getUser from './get-user'
import { identifyUser, track } from './actions'

/**
 * Figure out what action should be performed based on the parameters passed
 * @param identify
 * @returns
 */
function getAction(action: string) {
  const map = [
    { action: identifyUser, value: action === LDUserActions.Identify }
  ]
  return map.find((m) => m.value === true).action
}

export default async (req: IncomingMessage): Promise<LDError | string> => {
  const { key, email, firstName, lastName } = useQuery(req)
  if (!hasData(key)) {
    return 'Launch Darkly: user key is not defined'
  }

  const method = useMethod(req)
  const [actionKey] = parseUrlSegments(req)
  const client = await getLDClient()
  const user = getUser(key, email, firstName, lastName)

  if (method === 'POST' && actionKey === LDUserActions.Track) {
    const data = await useBody(req)
    const keys = Object.keys(data)
    const metricKey = keys.find((v) => v === 'metricValue')
    const metricValue = data[metricKey]
    const trackingKey = keys.find((v) => v !== 'metricValue')
    const trackingData = data[trackingKey]
    return await track(client, user, trackingKey, trackingData, metricValue)
  }

  const action = getAction(actionKey)
  return await action(client, user)
}
