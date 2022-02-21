import { LDUser } from 'launchdarkly-node-server-sdk'
import { hasData } from './utils'

export default function getUser(
  key: string,
  email?: string,
  firstName?: string,
  lastName?: string
) {
  const user: LDUser = {
    key: key.toString(),
    ...(hasData(email) && {
      email: email.toString()
    }),
    ...(hasData(firstName) && {
      firstName: firstName.toString()
    }),
    ...(hasData(lastName) && {
      lastName: lastName.toString()
    })
  }

  return user
}
