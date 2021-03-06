# @mftc/nuxt-launch-darkly

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/rebeccarich/nuxt-launch-darkly/Tests) ![npm](https://img.shields.io/npm/dt/@mftc/nuxt-launch-darkly) ![version](https://img.shields.io/npm/v/@mftc/nuxt-launch-darkly) ![NPM](https://img.shields.io/npm/l/@mftc/nuxt-launch-darkly)

> A Nuxt module for interacting with the [Launch Darkly SDK](https://docs.launchdarkly.com/sdk/server-side/node-js)

_This module is under heavy development so expect breaking changes._

## Features

- 🌈 [Composable](#-composable) for Composition API support
- ⚡️ Adds [REST endpoints](#-rest-endpoint) for custom integrations
- 💯 Nuxt 3

## Setup

1. Install `@mftc/nuxt-launch-darkly`

```bash
npm install @mftc/nuxt-launch-darkly or # yarn add @mftc/nuxt-launch-darkly
```

2. Add it as a `buildModule` in `nuxt.config.ts` and configure it with your Launch Darkly [server-side SDK key](https://app.launchdarkly.com/settings/projects).
   The `sdkKey` should go in `privateRuntimeConfig` since the Launch Darkly SDK Key needs to be kept private.

```js
export default defineNuxtConfig({
  buildModules: ['@mftc/nuxt-launch-darkly'],
  privateRuntimeConfig: {
    launchDarkly: {
      sdkKey: process.env.LD_SDK_KEY
    }
  },
  // optional
  launchDarkly: {
    apiPath: '/api/launch-darkly', // customisable api path: default '/api/launch-darkly'
    logLevel: 'info' // 'debug' | 'info' | 'warn' | 'error' | 'none': default 'info'
  }
})
```

## Usage

#### 🧩 Composable

```ts
<script setup>
  const USER = {
    key: 'UNIQUE_USER_ID', // required
    email: 'user@domain.com',
    firstName: 'Jane',
    lastName: 'Doe'
  }
  const FLAG_KEY = 'my-feature-flag'

  const { getAllVariations, getVariationByKey, getVariationDetail, identifyUser, track } = useLaunchDarkly()

  // get all variations for the provided user
  const allFlags = getAllVariations(USER)
  // get a specified variation for the provided user
  const singleFlag = getVariationByKey(USER,   FLAG_KEY)
  // get a specified variation for the provided user with detail
  const singleFlagDetail = getVariationDetail(USER,   FLAG_KEY)
  // get multiple variations
  // if you are using any of the functions provided by the
  // composable more than once per component, don't forget to
  // pass a unique key to ensure that data fetching can be
  // properly de-duplicated across requests
  const pickFlags = getAllVariations(USER, [FLAG_KEY, 'second-key', 'third-key'], 'unique-key')

  // manually identify a user.
  // note: this is done automatically for you when calling getAllVariations, getVariationByKey and getVariationDetail
  const identify = () => identifyUser(USER)

  // track custom data
  // myKey is the name of the custom metric you want to track
  const dataToTrack = {
    myKey: {
      arr: [1, 'foo'],
      nested: {
        a: 1,
        b: {
          key: 'bar'
        }
      }
    },
    metricValue: 1
  }
  const trackData = () => track(USER, dataToTrack)

</script>
```

#### 🌀 REST Endpoint

This module exposes the REST endpoints that are used by the composable internally. This could be useful if you wanted to get all the flags on app init and save them to the store for example.

The module exposes two endpoints:

1. `${apiPath}/flags`
1. `${apiPath}/user`

**Query Parameters**:

```ts
key: string // required
email?: string
firstName?: string
lastName?: string
```

```html
?key=xxx-xxx&email=user@domain.com&firstName=Jane&lastName=Doe
```

These query parameters are valid for all requests. `key` is the only required parameter.

The API path will default to `/api/launch-darkly` but you can set a custom path in the `launchDarkly` config in `nuxt.config.ts`. See the [setup section](#setup) for details

#### /flags

##### Get all variants

[LDClient.allFlagsState](https://launchdarkly.github.io/node-server-sdk/interfaces/_launchdarkly_node_server_sdk_.LDClient.html#allFlagsState)

```html
GET /api/launch-darkly/flags?{query-params}
```

##### Get single variant

[LDClient.variation](https://launchdarkly.github.io/node-server-sdk/interfaces/_launchdarkly_node_server_sdk_.LDClient.html#variation)

```html
GET /api/launch-darkly/flags/flag-key?{query-params}
```

##### Get single variant with detail

[LDClient.variationDetail](https://launchdarkly.github.io/node-server-sdk/interfaces/_launchdarkly_node_server_sdk_.LDClient.html#variationDetail)

```html
GET /api/launch-darkly/flags/flag-key/detail?{query-params}
```

#### /user

##### Identify

[LDClient.identify](https://launchdarkly.github.io/node-server-sdk/interfaces/_launchdarkly_node_server_sdk_.LDClient.html#identify)

```html
GET /api/launch-darkly/user/identify?{query-params}
```

##### Track

[LDClient.track](https://launchdarkly.github.io/node-server-sdk/interfaces/_launchdarkly_node_server_sdk_.LDClient.html#track)

```bash
curl -X POST "/api/launch-darkly/user/track?{query-params}" -H "Content-Type: application/json" -d '{"myKey":{"arr":[1,"foo"],"nested":{"a":1,"b":{"key":"bar"}}},"metricValue":1}'
```

## Development

- Create a `.env` file in the [playground](./playground) directory and add these variables:

```bash
LD_SDK_KEY= # with the value of a Launch Darkly server-side SDK Key.
EMAIL= # email address of a user captured by LD (optional)
USER_KEY= # the unique key of a user captured by LD
FIRST_NAME= # first name
LAST_NAME= # last name
```

- Run `npm run prepare:playground` to generate type stubs.
- Use `npm run play` to start [playground](./playground) in development mode.
