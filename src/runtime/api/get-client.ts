import LaunchDarkly from 'launchdarkly-node-server-sdk'
import config from '#config'

const isDev = process.env.NODE_ENV === 'development'
const isTesting = process.env.LOAD_TEST_DATA === 'true'
// load test data
// for internal development processes only
const dataSource = isTesting
  ? LaunchDarkly.FileDataSource({
      paths: [
        isDev
          ? `${process.cwd()}/playground/public/flag-data.json`
          : 'public/flag-data.json'
      ]
    })
  : undefined

const LD_SDK_KEY = config.launchDarkly.sdkKey
const LOG_LEVEL = config.launchDarkly.logLevel

export default LaunchDarkly.init(LD_SDK_KEY, {
  logger: LaunchDarkly.basicLogger({
    level: LOG_LEVEL
  }),
  ...(dataSource && {
    updateProcessor: dataSource
  })
})
