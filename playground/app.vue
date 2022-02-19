<template>
  <div>
    <h1>Usage</h1>
    <section>
      <h4>Single flag</h4>
      <div>
        <p data-test="single-variant-pending">
          Pending: {{ singleFlag.pending }}
        </p>
        <p data-test="single-variant-error">Error: {{ singleFlag.error }}</p>
        <p data-test="single-variant-data">Data: {{ singleFlag.data }}</p>
      </div>
      <h4>Single flag detail</h4>
      <div>
        <p data-test="single-variant-detail-pending">
          Pending: {{ singleFlagDetail.pending }}
        </p>
        <p data-test="single-variant-detail-error">
          Error: {{ singleFlagDetail.error }}
        </p>
        <p data-test="single-variant-detail-data">
          Data: {{ singleFlagDetail.data }}
        </p>
      </div>
      <h4>All flags</h4>
      <div>
        <p data-test="all-variants-pending">Pending: {{ allFlags.pending }}</p>
        <p data-test="all-variants-error">Error: {{ allFlags.error }}</p>
        <p data-test="all-variants-data">Data: {{ allFlags.data }}</p>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
const config = useRuntimeConfig()
const USER = {
  key: config.userKey,
  email: config.email
}
const FLAG_KEY = config.flagKey

const { getAllVariations, getVariationByKey, getVariationDetail } =
  useLaunchDarkly()

const singleFlag = getVariationByKey(USER, FLAG_KEY)
const singleFlagDetail = getVariationDetail(USER, FLAG_KEY)
const allFlags = getAllVariations(USER)
</script>
