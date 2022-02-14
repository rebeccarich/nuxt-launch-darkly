# @mftc/nuxt-launch-darkly

> A Nuxt module for interacting with the [Launch Darkly SDK](https://docs.launchdarkly.com/sdk/server-side/node-js)

## Features

- 👌 [Composables](#-composables) for Composition API support
- 🌈 Optionally include a [plugin](#-plugin)
- ⚡️ Adds a [REST endpoint](#-rest-endpoint) for custom integrations
- 💯 Nuxt 3

## Setup

1. Install `@mftc/nuxt-launch-darkly`

```bash
npm install @mftc/nuxt-launch-darkly or # yarn add @mftc/nuxt-launch-darkly
```

2. Add it as a `buildModule` in `nuxt.config.ts` and configure it with your Launch Darkly [server-side SDK key](https://app.launchdarkly.com/settings/projects).
   The config should go in `privateRuntimeConfig` since the Launch Darkly SDK Key needs to be kept private.

```js
export default defineNuxtConfig({
  buildModules: ['@mftc/nuxt-launch-darkly'],
  privateRuntimeConfig: {
    launchDarkly: {
      addPlugin: true, // optional, default false
      sdkKey: process.env.LD_SDK_KEY // required, your LD SDK key
    }
  }
})
```

## Usage

#### 🧩 Composables

```ts
<script setup async>
  const USER = {
    key: 'UNIQUE_USER_ID',
    email: 'user@domain.com' // optional
  }
  const FLAG_KEY = 'my-feature-flag'

  const { getAllVariations, getVariationByKey } = useLaunchDarkly()

  // get all variations for the provided user
  const allFlags = await getAllVariations(USER)
  // get a specified variation for the provided user
  const singleFlag = await getVariationByKey(USER,   FLAG_KEY)
</script>
```

#### 🔌 Plugin

```ts
<script setup async>
  const USER = {
    key: 'UNIQUE_USER_ID',
    email: 'user@domain.com' // optional
  }
  const FLAG_KEY = 'my-feature-flag'

  const { $launchDarkly } = useNuxtApp()

  // get all variations for the provided user
  const allFlags = await $launchDarkly.getAllVariations(USER)
  // get a specified variation for the provided user
  const singleFlag = await $launchDarkly.getVariationByKey(USER, FLAG_KEY)
</script>
```

#### 🌀 REST Endpoint

This module exposes the REST endpoint that is used by the composables and the plugin internally. This could be useful if you wanted to get all the flags on page load and save them to the store for example.

##### Get all variants

```html
GET /api/launch-darkly?key=xxx-xxx&email=user@domain.com
```

##### Get single variant

```html
GET /api/launch-darkly/{variant-key}?key=xxx-xxx&email=user@domain.com
```

**Params**:

```ts
key: string
email?: string // optional
```

## Development

- Create a `.env` file in the [playground](./playground) directory and add these variables:

```bash
LD_SDK_KEY= # with the value of a Launch Darkly server-side SDK Key.
EMAIL= # email address of a user captured by LD (optional)
USER_KEY= # the unique key of a user captured by LD
FLAG_KEY= # name of a feature flag defined in LD project
```

- Run `npm run prepare:playground` to generate type stubs.
- Use `npm run play` to start [playground](./playground) in development mode.
