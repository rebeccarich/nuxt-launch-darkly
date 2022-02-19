import { LDUser } from 'launchdarkly-node-server-sdk'
import { defineNuxtPlugin } from '#app'
import { useLaunchDarkly } from './composables/useLaunchDarkly'

const { getAllVariations, getVariationByKey } = useLaunchDarkly()

const DEPRECATION_WARNING =
  'Nuxt Launch Darkly: $launchDarkly plugin is deprecated and will be removed in version 1.0'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      launchDarkly: {
        getAllVariations: async (user: LDUser) => {
          console.warn(DEPRECATION_WARNING)
          const res = await getAllVariations(user)
          return res
        },
        getVariationByKey: async (
          user: LDUser,
          flagKey: string,
          defaultValue: boolean = false
        ) => {
          console.warn(DEPRECATION_WARNING)
          const res = await getVariationByKey(user, flagKey, defaultValue)
          return res
        }
      }
    }
  }
})
