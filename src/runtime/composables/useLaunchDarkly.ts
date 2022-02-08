import { LDUser } from 'launchdarkly-node-server-sdk'

export interface LDVariation {
  variation: boolean
}

export function useLaunchDarkly() {
  /**
   * Fetches all the variations for the provided user
   * @param user LDUser
   * @returns Promise<object>
   */
  const getAllVariations = async (user: LDUser) => {
    const res = await $fetch<object>('/api/launch-darkly', {
      params: user
    })
    return res
  }

  /**
   * Fetches a single variation for the provided user
   * @param user LDUser
   * @param flagKey string
   * @returns Promise<LDVariation>
   */
  const getVariationByKey = async (
    user: LDUser,
    flagKey: string,
    defaultValue: boolean = false
  ) => {
    const res = await $fetch<LDVariation>(`/api/launch-darkly/${flagKey}`, {
      params: { ...user, defaultValue: defaultValue.toString() }
    })
    return res
  }

  return {
    getAllVariations,
    getVariationByKey
  }
}
