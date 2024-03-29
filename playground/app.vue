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
      <h4>All flags pick items</h4>
      <div>
        <p data-test="all-variants-pick-pending">
          Pending: {{ pickFlag.pending }}
        </p>
        <p data-test="all-variants-pick-error">Error: {{ pickFlag.error }}</p>
        <p data-test="all-variants-pick-data">Data: {{ pickFlag.data }}</p>
      </div>
    </section>
    <section>
      <h4>User Identify</h4>
      <button data-test="identify-button" @click="identify">Identify</button>
      <div data-test="identify-result">{{ idResult }}</div>
    </section>
    <section>
      <h4>Track</h4>
      <button data-test="track-button" @click="trackMetric">Track</button>
      <div data-test="track-result">{{ trackResult }}</div>
    </section>
  </div>
</template>

<script lang="ts" setup>
const config = useRuntimeConfig()
const USER = {
  key: config.userKey,
  email: config.email,
  firstName: config.firstName,
  lastName: config.lastName
}
const FLAG_KEY = 'flag-1'

const {
  getAllVariations,
  getVariationByKey,
  getVariationDetail,
  identifyUser,
  track
} = useLaunchDarkly()

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

const singleFlag = getVariationByKey(USER, FLAG_KEY)
const singleFlagDetail = getVariationDetail(USER, FLAG_KEY)
const allFlags = getAllVariations(USER, undefined, 'key1')
const pickFlag = getAllVariations(USER, [FLAG_KEY], 'key2')

const idResult = ref<boolean | string>('')
const trackResult = ref<boolean | string>('')

const identify = () => {
  const { data, error, pending } = identifyUser(USER)
  idResult.value = pending.value
  watch(pending, () => {
    idResult.value = data.value || error.value
  })
}

const trackMetric = () => {
  const { data, error, pending } = track(USER, dataToTrack)
  trackResult.value = pending.value
  watch(pending, () => {
    trackResult.value = data.value || error.value
  })
}
</script>
