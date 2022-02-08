<template>
  <div>
    <h1>Usage</h1>
    <section>
      <h2>Using plugin</h2>
      <h4>All flags</h4>
      {{ allFlagsPlugin }}
      <h4>Single flag</h4>
      {{ singleFlagPlugin }}
    </section>
    <section>
      <h2>Using composable</h2>
      <h4>All flags</h4>
      {{ allFlagsComposable }}
      <h4>Single flag</h4>
      {{ singleFlagComposable }}
    </section>
  </div>
</template>

<script async setup lang="ts">
const { $config } = useNuxtApp()
const USER = {
  key: $config.userKey,
  email: $config.email
}
const FLAG_KEY = $config.flagKey

// composable
const { getAllVariations, getVariationByKey } = useLaunchDarkly()
const allFlagsComposable = await getAllVariations(USER)
const singleFlagComposable = await getVariationByKey(USER, FLAG_KEY)

// plugin
const { $launchDarkly } = useNuxtApp()
const allFlagsPlugin = await $launchDarkly.getAllVariations(USER)
const singleFlagPlugin = await $launchDarkly.getVariationByKey(USER, FLAG_KEY)
</script>
