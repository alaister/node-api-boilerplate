import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'
import { GraphQLDateTime } from 'graphql-iso-date'
import {
  connectionArgs,
  connectionFromArray,
  globalIdField,
} from 'graphql-relay'
import { NodeInterface } from '../interfaces/Node'
import Profile from './Profile'
import SessionConnection from './SessionConnection'

const Account = new GraphQLObjectType({
  name: 'Account',
  fields: {
    id: globalIdField('User'),
    email: { type: GraphQLNonNull(GraphQLString) },
    createdAt: { type: GraphQLNonNull(GraphQLDateTime) },
    updatedAt: { type: GraphQLNonNull(GraphQLDateTime) },
    profile: {
      type: GraphQLNonNull(Profile),
      resolve(account) {
        return account.findProfile()
      },
    },
    sessions: {
      type: SessionConnection,
      args: connectionArgs,
      async resolve(account, args) {
        const sessions = await account.findSessions()
        return connectionFromArray(sessions, args)
      },
    },
  },
  interfaces: [NodeInterface],
})

export default Account
