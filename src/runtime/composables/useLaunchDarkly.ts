import { LDEvaluationDetail, LDUser } from 'launchdarkly-node-server-sdk'
import { useRuntimeConfig, useFetch, AsyncData } from '#app'

export interface LDVariation {
  variation: boolean
}

export const useLaunchDarkly = () => {
  /**
   * Fetches all the variations for the provided user
   * @param user LDUser
   * @param includeKeys Specify which variant keys you want returned. If undefined, all keys will be returned.
   * @param key A unique key to ensure that data fetching can be properly de-duplicated across requests.
   * Use if getAllVariations is used more than once per component
   * @returns
   */
  const getAllVariations = (
    user: LDUser,
    includeKeys?: string[],
    key?: string
  ) => {
    const { launchDarkly } = useRuntimeConfig()
    const res = useFetch<Map<string, boolean>>(launchDarkly.apiPath, {
      params: user,
      pick: includeKeys,
      ...(key && { key })
    })
    return res
  }

  /**
   * Fetches a single variation for the provided user
   * @param user LDUser
   * @param flagKey string
   * @param defaultValue boolean
   * @param key A unique key to ensure that data fetching can be properly de-duplicated across requests.
   * Use if getVariationByKey is used more than once per component
   */
  const getVariationByKey = (
    user: LDUser,
    flagKey: string,
    defaultValue: boolean = false,
    key?: string
  ) => {
    const { launchDarkly } = useRuntimeConfig()
    const res = useFetch<LDVariation>(`${launchDarkly.apiPath}/${flagKey}`, {
      params: { ...user, defaultValue: defaultValue.toString() },
      ...(key && { key })
    })
    return res
  }

  /**
   * Fetches a single variation for the provided user with detail
   * @param user LDUser
   * @param flagKey string
   * @param defaultValue boolean
   * @param key A unique key to ensure that data fetching can be properly de-duplicated across requests.
   * Use if getVariationByKey is used more than once per component
   */
  const getVariationDetail = (
    user: LDUser,
    flagKey: string,
    defaultValue: boolean = false,
    key?: string
  ) => {
    const { launchDarkly } = useRuntimeConfig()
    const res = useFetch<LDEvaluationDetail>(
      `${launchDarkly.apiPath}/${flagKey}/detail`,
      {
        params: { ...user, defaultValue: defaultValue.toString() },
        ...(key && { key })
      }
    )
    return res
  }

  return {
    getAllVariations,
    getVariationByKey,
    getVariationDetail
  }
}
