import { defineNuxtConfig } from 'nuxt3'
import launchDarkly from '..'

export default defineNuxtConfig({
  buildModules: [launchDarkly],
  launchDarkly: {
    addPlugin: true,
    apiPath: '/api/launch-darkly',
    logLevel: 'info'
  },
  privateRuntimeConfig: {
    launchDarkly: {
      sdkKey: process.env.LD_SDK_KEY
    }
  },
  publicRuntimeConfig: {
    email: process.env.EMAIL,
    userKey: process.env.USER_KEY,
    firstName: process.env.FIRST_NAME,
    lastName: process.env.LAST_NAME
  }
})
