import { fromGlobalId, nodeDefinitions } from 'graphql-relay'
import Account from '../../models/Account'
import Profile from '../../models/Profile'
import Session from '../../models/Session'

export function appTypeToGraphQLType(appType) {
  const AccountType = require('../types/Account').default
  const ProfileType = require('../types/Profile').default
  const SessionType = require('../types/Session').default

  if (appType instanceof Account) return AccountType
  else if (appType instanceof Profile) return ProfileType
  else if (appType instanceof Session) return SessionType
  else return null
}

const { nodeInterface, nodeField } = nodeDefinitions(globalId => {
  const { type, id } = fromGlobalId(globalId)
  switch (type) {
    case 'Account':
      return Account.findOne({ id })
    case 'Profile':
      return Profile.findOne({ id })
    default:
      return null
  }
}, appTypeToGraphQLType)

export { nodeInterface as NodeInterface, nodeField }
