import { IncomingMessage } from 'http'
import LaunchDarkly from 'launchdarkly-node-server-sdk'
import { useQuery } from 'h3'
import config from '#config'
import { LDVariation } from '~~/../src/runtime/composables/useLaunchDarkly'

export type LDError =
  | 'Launch Darkly: user key is not defined'
  | 'Launch Darkly: unable to initialise'

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

const LD_CLIENT = LaunchDarkly.init(LD_SDK_KEY, {
  logger: LaunchDarkly.basicLogger({
    level: LOG_LEVEL
  }),
  ...(dataSource && {
    updateProcessor: dataSource
  })
})

const hasData = (property) => property !== undefined

const parseUrlSegments = (req: IncomingMessage) => {
  const parts = req.url.split('?')[0]
  const segments = parts.split('/').filter((p) => p !== '')
  return segments
}

const getFunction = () => {}

export default async (
  req: IncomingMessage
): Promise<
  | Map<string, boolean>
  | { variation: LaunchDarkly.LDEvaluationDetail }
  | LDVariation
  | LDError
> => {
  const { key, email, defaultValue } = useQuery(req)

  if (!hasData(key)) {
    return 'Launch Darkly: user key is not defined'
  }

  const [flagKey, detail] = parseUrlSegments(req)

  let client: LaunchDarkly.LDClient

  try {
    client = await LD_CLIENT.waitForInitialization()
  } catch (e) {
    return 'Launch Darkly: unable to initialise'
  }

  const user = {
    key: key.toString(),
    ...(hasData(email) && {
      email: email.toString()
    })
  }

  // fetch the value of a single variation with detail for the provided user
  if (hasData(flagKey) && hasData(detail) && hasData(defaultValue)) {
    try {
      const variation = await client.variationDetail(
        flagKey.toString(),
        user,
        defaultValue
      )
      return { variation }
    } catch (e) {
      return e
    }
  }

  // fetch the value of a single variation for the provided user
  else if (hasData(flagKey) && hasData(defaultValue)) {
    try {
      const variation = await client.variation(
        flagKey.toString(),
        user,
        defaultValue
      )
      return { variation }
    } catch (e) {
      return e
    }
  }

  // fetch the values of all the variations for the provided user
  else {
    client.identify(user)
    try {
      const flags = await client.allFlagsState(user)
      const flagsObj = flags.toJSON() as any
      delete flagsObj.$flagsState
      delete flagsObj.$valid
      return flagsObj as Map<string, boolean>
    } catch (e) {
      return e
    }
  }
}
