import {
  LDEvaluationDetail,
  LDFlagsState,
  LDUser
} from 'launchdarkly-node-server-sdk'
import { useRuntimeConfig, useFetch } from '#app'

export interface LDVariation {
  variation: boolean
}

export const useLaunchDarkly = () => {
  /**
   * Fetches all the variations for the provided user
   * @param user LDUser
   */
  const getAllVariations = (user: LDUser) => {
    const { launchDarkly } = useRuntimeConfig()
    const res = useFetch<LDFlagsState>(launchDarkly.apiPath, {
      params: user
    })
    return res
  }

  /**
   * Fetches a single variation for the provided user
   * @param user LDUser
   * @param flagKey string
   */
  const getVariationByKey = (
    user: LDUser,
    flagKey: string,
    defaultValue: boolean = false
  ) => {
    const { launchDarkly } = useRuntimeConfig()
    const res = useFetch<LDVariation>(`${launchDarkly.apiPath}/${flagKey}`, {
      params: { ...user, defaultValue: defaultValue.toString() }
    })
    return res
  }

  /**
   * Fetches a single variation for the provided user with detail
   * @param user LDUser
   * @param flagKey string
   */
  const getVariationDetail = (
    user: LDUser,
    flagKey: string,
    defaultValue: boolean = false
  ) => {
    const { launchDarkly } = useRuntimeConfig()
    const res = useFetch<LDEvaluationDetail>(
      `${launchDarkly.apiPath}/${flagKey}/detail`,
      {
        params: { ...user, defaultValue: defaultValue.toString() }
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
