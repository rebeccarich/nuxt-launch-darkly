import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { defineNuxtModule, addPlugin, addServerMiddleware } from '@nuxt/kit'
import defu from 'defu'

export interface ModuleOptions {
  addPlugin: Boolean
  apiPath: string
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
    apiPath: '/api/launch-darkly'
  },
  setup(options, nuxt) {
    // if sdkKey is not defined, let's get outta here
    if (nuxt.options.privateRuntimeConfig.launchDarkly.sdkKey === undefined) {
      throw new Error(
        'Launch Darkly SDK key is not defined. Please add it to privateRuntimeConfig in your nuxt.config file'
      )
    }

    // Add user defined config to publicRuntimeConfig
    nuxt.options.publicRuntimeConfig.launchDarkly = defu(
      {
        ...nuxt.options.launchDarkly,
        ...nuxt.options.publicRuntimeConfig.launchDarkly
      },
      {
        addPlugin: options.addPlugin,
        apiPath: options.apiPath
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
      path: nuxt.options.publicRuntimeConfig.launchDarkly.apiPath,
      handler: resolve(runtimeDir, 'api', 'launch-darkly')
    })

    // add plugin
    if (nuxt.options.publicRuntimeConfig.launchDarkly.addPlugin) {
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
