import { IncomingMessage } from 'http'
import { LDEvaluationDetail } from 'launchdarkly-node-server-sdk'
import { useQuery } from 'h3'
import { LDVariation, LDError } from '../types'
import getLDClient from './get-client'
import { hasData, parseUrlSegments } from './utils'
import getUser from './get-user'
import { variation, variationDetail, allFlagsState } from './actions'

/**
 * Figure out what action should be performed based on the parameters passed
 * @param flagKey
 * @param detail
 * @param defaultValue
 * @returns
 */
function getAction(flagKey?: string, detail?: string, defaultValue?: string) {
  const hasFlagKey = !!flagKey
  const hasDetail = !!detail
  const hasDefaultValue = !!defaultValue
  const map = [
    { action: variation, value: hasFlagKey && !hasDetail && hasDefaultValue },
    {
      action: variationDetail,
      value: hasFlagKey && hasDetail && hasDefaultValue
    },
    { action: allFlagsState, value: !flagKey && !hasDetail && !defaultValue }
  ]
  return map.find((m) => m.value === true).action
}

export default async (
  req: IncomingMessage
): Promise<
  | Map<string, boolean>
  | { variation: LDEvaluationDetail }
  | LDVariation
  | LDError
> => {
  const { key, email, firstName, lastName, defaultValue } = useQuery(req)
  if (!hasData(key)) {
    return 'Launch Darkly: user key is not defined'
  }

  const [flagKey, detail] = parseUrlSegments(req)
  const client = await getLDClient()

  const user = getUser(key, email, firstName, lastName)

  const defaultVal = defaultValue ? defaultValue.toString() : undefined

  const action = getAction(flagKey, detail, defaultVal)
  return await action(client, user, flagKey, defaultVal)
}
