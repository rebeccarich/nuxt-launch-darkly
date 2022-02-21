import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { defineNuxtModule, addPlugin, addServerMiddleware } from '@nuxt/kit'
import defu from 'defu'
import { LDLogLevel } from 'launchdarkly-node-server-sdk'

export interface ModuleOptions {
  addPlugin: Boolean
  apiPath: string
  logLevel: LDLogLevel
  sdkKey?: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@mftc/nuxt-launch-darkly',
    configKey: 'launchDarkly',
    compatibility: {
      nuxt: '^3.0.0'
    }
  },
  defaults: {
    addPlugin: false,
    apiPath: '/api/launch-darkly',
    logLevel: 'info'
  },
  setup(options, nuxt) {
    // if sdkKey is not defined, let's get outta here
    if (nuxt.options.privateRuntimeConfig.launchDarkly.sdkKey === undefined) {
      throw new Error(
        'Launch Darkly SDK key is not defined. Please add it to privateRuntimeConfig in your nuxt.config file'
      )
    }

    // create copy without sdkKey if present
    const { sdkKey, ...noSecretPrivateConfig } =
      nuxt.options.privateRuntimeConfig.launchDarkly

    // Add user defined config to publicRuntimeConfig
    nuxt.options.publicRuntimeConfig.launchDarkly = defu(
      {
        ...noSecretPrivateConfig,
        ...nuxt.options.publicRuntimeConfig.launchDarkly,
        ...nuxt.options.launchDarkly
      },
      {
        addPlugin: options.addPlugin,
        apiPath: options.apiPath,
        logLevel: options.logLevel
      }
    )

    // Transpile runtime
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
    nuxt.options.build.transpile.push(runtimeDir)

    // Add composables
    nuxt.hook('autoImports:dirs', (dirs) => {
      dirs.push(resolve(runtimeDir, 'composables'))
    })

    // add API routes
    addServerMiddleware({
      path: `${nuxt.options.publicRuntimeConfig.launchDarkly.apiPath}/flags`,
      handler: resolve(runtimeDir, 'api', 'api-flags')
    })

    addServerMiddleware({
      path: `${nuxt.options.publicRuntimeConfig.launchDarkly.apiPath}/user`,
      handler: resolve(runtimeDir, 'api', 'api-user')
    })

    // TODO: deprecate plugin
    if (nuxt.options.publicRuntimeConfig.launchDarkly.addPlugin) {
      console.warn(
        'Nuxt Launch Darkly: $launchDarkly plugin is deprecated and will be removed in version 1.0'
      )
      addPlugin(resolve(runtimeDir, 'launch-darkly.plugin'))
    }
  }
})

declare module '@nuxt/schema' {
  interface ConfigSchema {
    privateRuntimeConfig?: {
      launchDarkly?: ModuleOptions
    }
  }

  interface NuxtConfig {
    launchDarkly?: ModuleOptions
  }
  interface NuxtOptions {
    launchDarkly?: ModuleOptions
  }
}
