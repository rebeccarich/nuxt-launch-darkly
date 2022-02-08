import { defineNuxtConfig } from 'nuxt3'
import launchDarkly from '..'

export default defineNuxtConfig({
  buildModules: [launchDarkly],
  privateRuntimeConfig: {
    launchDarkly: {
      addPlugin: true,
      sdkKey: process.env.LD_SDK_KEY
    }
  },
  publicRuntimeConfig: {
    email: process.env.EMAIL,
    userKey: process.env.USER_KEY,
    flagKey: process.env.FLAG_KEY
  }
})
