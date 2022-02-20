import { IncomingMessage } from 'http'
import LaunchDarkly, {
  LDClient,
  LDUser,
  LDEvaluationDetail
} from 'launchdarkly-node-server-sdk'
import { useQuery } from 'h3'
import { LDVariation } from '../composables/useLaunchDarkly'
import LD_CLIENT from './get-client'
import { hasData, parseUrlSegments } from './utils'

export type LDError =
  | 'Launch Darkly: user key is not defined'
  | 'Launch Darkly: unable to initialise'

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

/**
 * fetch the values of all the variations for the provided user
 * @param client
 * @param user
 * @returns
 */
async function allFlagsState(client: LDClient, user: LDUser) {
  client.identify(user)
  try {
    const flags = await client.allFlagsState(user)
    const flagsObj = flags.toJSON() as any
    delete flagsObj.$flagsState
    delete flagsObj.$valid
    return flagsObj as Map<string, boolean>
  } catch (e) {
    return e
  }
}

/**
 * fetch the value of a single variation for the provided user
 * @param client
 * @param user
 * @param flagKey
 * @param defaultValue
 * @returns
 */
async function variation(
  client: LDClient,
  user: LDUser,
  flagKey: string,
  defaultValue: string
) {
  try {
    const variation = await client.variation(
      flagKey.toString(),
      user,
      defaultValue
    )
    return { variation }
  } catch (e) {
    return e
  }
}

/**
 * fetch the value of a single variation with detail for the provided user
 * @param client
 * @param user
 * @param flagKey
 * @param defaultValue
 * @returns
 */
async function variationDetail(
  client: LDClient,
  user: LDUser,
  flagKey: string,
  defaultValue: string
) {
  try {
    const variation = await client.variationDetail(
      flagKey.toString(),
      user,
      defaultValue
    )
    return { variation }
  } catch (e) {
    return e
  }
}

export default async (
  req: IncomingMessage
): Promise<
  | Map<string, boolean>
  | { variation: LDEvaluationDetail }
  | LDVariation
  | LDError
> => {
  const { key, email, defaultValue } = useQuery(req)

  if (!hasData(key)) {
    return 'Launch Darkly: user key is not defined'
  }

  const [flagKey, detail] = parseUrlSegments(req)

  let client: LaunchDarkly.LDClient

  try {
    client = await LD_CLIENT.waitForInitialization()
  } catch (e) {
    return 'Launch Darkly: unable to initialise'
  }

  const user: LDUser = {
    key: key.toString(),
    ...(hasData(email) && {
      email: email.toString()
    })
  }

  const defaultVal = defaultValue ? defaultValue.toString() : undefined
  const action = getAction(flagKey, detail, defaultVal)
  return await action(client, user, flagKey, defaultVal)
}
