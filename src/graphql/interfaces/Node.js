import { fromGlobalId, nodeDefinitions } from 'graphql-relay'
import Session from '../../models/Session'
import User from '../../models/User'

export function appTypeToGraphQLType(appType) {
  const UserType = require('../types/User').default
  const SessionType = require('../types/Session').default

  if (appType instanceof User) return UserType
  else if (appType instanceof Session) return SessionType
  else return null
}

const { nodeInterface, nodeField } = nodeDefinitions(globalId => {
  const { type, id } = fromGlobalId(globalId)
  switch (type) {
    case 'User':
      return User.findOne({ id })
    default:
      return null
  }
}, appTypeToGraphQLType)

export { nodeInterface as NodeInterface, nodeField }
