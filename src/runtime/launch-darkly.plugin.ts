import { LDUser } from 'launchdarkly-node-server-sdk'
import { useLaunchDarkly } from './composables/useLaunchDarkly'
import { defineNuxtPlugin } from '#app'

const { getAllVariations, getVariationByKey } = useLaunchDarkly()

export default defineNuxtPlugin(() => {
  return {
    provide: {
      launchDarkly: {
        getAllVariations: async (user: LDUser) => {
          const res = await getAllVariations(user)
          return res
        },
        getVariationByKey: async (
          user: LDUser,
          flagKey: string,
          defaultValue: boolean = false
        ) => {
          const res = await getVariationByKey(user, flagKey, defaultValue)
          return res
        }
      }
    }
  }
})
