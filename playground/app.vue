<template>
  <div>
    <h1>Usage</h1>
    <section>
      <h4>Single flag</h4>
      {{ singleFlagComposable }}
      <h4>All flags</h4>
      {{ allFlagsComposable }}
    </section>
  </div>
</template>

<script lang="ts" async setup>
const config = useRuntimeConfig()
const USER = {
  key: config.userKey,
  email: config.email
}
const FLAG_KEY = config.flagKey

const { getAllVariations, getVariationByKey } = useLaunchDarkly()

const singleFlagComposable = await getVariationByKey(USER, FLAG_KEY)
const allFlagsComposable = await getAllVariations(USER)
</script>
