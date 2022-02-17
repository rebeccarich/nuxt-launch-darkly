<template>
  <div>
    <h1>Usage</h1>
    <section>
      <h4>Single flag</h4>
      <div>
        <p data-test="single-variant-pending">
          Pending: {{ singleFlagComposable.pending }}
        </p>
        <p data-test="single-variant-error">
          Error: {{ singleFlagComposable.error }}
        </p>
        <p data-test="single-variant-data">
          Data: {{ singleFlagComposable.data }}
        </p>
      </div>
      <h4>All flags</h4>
      <div>
        <p data-test="all-variants-pending">
          Pending: {{ allFlagsComposable.pending }}
        </p>
        <p data-test="all-variants-error">
          Error: {{ allFlagsComposable.error }}
        </p>
        <p data-test="all-variants-data">Data: {{ allFlagsComposable.data }}</p>
      </div>
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
