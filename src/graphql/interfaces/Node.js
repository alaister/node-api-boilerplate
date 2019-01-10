import { fromGlobalId, nodeDefinitions } from 'graphql-relay'
import Profile from '../../models/Profile'
import Session from '../../models/Session'
import User from '../../models/User'

export function appTypeToGraphQLType(appType) {
  const UserType = require('../types/User').default
  const ProfileType = require('../types/Profile').default
  const SessionType = require('../types/Session').default

  if (appType instanceof User) return UserType
  else if (appType instanceof Profile) return ProfileType
  else if (appType instanceof Session) return SessionType
  else return null
}

const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId, { accountService, socialService }) => {
    const { type, id } = fromGlobalId(globalId)
    switch (type) {
      case 'User':
        return accountService.getUserById(id)
      case 'Profile':
        return socialService.getProfileById(id)
      default:
        return null
    }
  },
  appTypeToGraphQLType
)

export { nodeInterface as NodeInterface, nodeField }
