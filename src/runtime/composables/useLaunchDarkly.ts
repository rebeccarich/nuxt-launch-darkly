import { LDUser } from 'launchdarkly-node-server-sdk'
import { useRuntimeConfig } from '#app'

export interface LDVariation {
  variation: boolean
}

export const useLaunchDarkly = () => {
  /**
   * Fetches all the variations for the provided user
   * @param user LDUser
   * @returns Promise<Map<string, boolean>>
   */
  const getAllVariations = async (user: LDUser) => {
    const { launchDarkly } = useRuntimeConfig()
    const res = await useFetch<string, Map<string, boolean>>(
      launchDarkly.apiPath,
      {
        params: user
      }
    )
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
    const { launchDarkly } = useRuntimeConfig()
    const res = await useFetch<string, LDVariation>(
      `${launchDarkly.apiPath}/${flagKey}`,
      {
        params: { ...user, defaultValue: defaultValue.toString() }
      }
    )
    return res
  }

  return {
    getAllVariations,
    getVariationByKey
  }
}
