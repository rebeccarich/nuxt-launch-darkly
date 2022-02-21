import {
  LDClient,
  LDEvaluationDetail,
  LDUser
} from 'launchdarkly-node-server-sdk'
import { LDVariation } from '../types'

/**
 * fetch the values of all the variations for the provided user
 * @param client
 * @param user
 * @returns
 */
export async function allFlagsState(
  client: LDClient,
  user: LDUser
): Promise<Map<string, boolean>> {
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
export async function variation(
  client: LDClient,
  user: LDUser,
  flagKey: string,
  defaultValue: string
): Promise<LDVariation> {
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
export async function variationDetail(
  client: LDClient,
  user: LDUser,
  flagKey: string,
  defaultValue: string
): Promise<{ variation: LDEvaluationDetail }> {
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

/**
 * identify user
 * @param client
 * @param user
 * @returns
 */
export function identifyUser(client: LDClient, user: LDUser): string {
  try {
    client.identify(user)
    return 'success'
  } catch (e) {
    return e
  }
}
