import { IncomingMessage } from 'http'
import { useQuery } from 'h3'
import { LDError } from '../types'
import getLDClient from './get-client'
import { hasData, parseUrlSegments } from './utils'
import getUser from './get-user'
import { identifyUser } from './actions'

/**
 * Figure out what action should be performed based on the parameters passed
 * @param identify
 * @returns
 */
function getAction(identify?: string) {
  const hasIdentify = !!identify
  const map = [{ action: identifyUser, value: hasIdentify }]
  return map.find((m) => m.value === true).action
}

export default async (req: IncomingMessage): Promise<LDError | string> => {
  const { key, email, firstName, lastName } = useQuery(req)
  if (!hasData(key)) {
    return 'Launch Darkly: user key is not defined'
  }

  const [identify] = parseUrlSegments(req)
  const client = await getLDClient()

  const user = getUser(key, email, firstName, lastName)

  const action = getAction(identify)
  return await action(client, user)
}
