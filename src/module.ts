import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { defineNuxtModule, addPlugin, addServerMiddleware } from '@nuxt/kit'
import defu from 'defu'

export interface ModuleOptions {
  addPlugin: Boolean
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
    addPlugin: false
  },
  setup(options, nuxt) {
    // if sdkKey is not defined, let's get outta here
    if (
      options.sdkKey === undefined &&
      nuxt.options.privateRuntimeConfig.launchDarkly.sdkKey === undefined
    ) {
      throw new Error(
        'launch darkly SDK key is not defined. Please add it to your nuxt.config file'
      )
    }

    // Default runtime config
    // Add user defined config to privateRuntimeConfig
    nuxt.options.privateRuntimeConfig.launchDarkly = defu(
      nuxt.options.privateRuntimeConfig.launchDarkly,
      {
        addPlugin: options.addPlugin,
        sdkKey: options.sdkKey
      }
    )

    // Transpile runtime
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
    nuxt.options.build.transpile.push(runtimeDir)

    // Add composables
    nuxt.hook('autoImports:dirs', (dirs) => {
      dirs.push(resolve(runtimeDir, 'composables'))
    })

    // add API route
    addServerMiddleware({
      path: '/api/launch-darkly',
      handler: resolve(runtimeDir, 'api', 'launch-darkly')
    })

    // add plugin
    if (nuxt.options.privateRuntimeConfig.launchDarkly.addPlugin) {
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
}
