import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'
import { GraphQLDateTime } from 'graphql-iso-date'
import {
  connectionArgs,
  globalIdField,
  connectionFromArray,
} from 'graphql-relay'
import { NodeInterface } from '../interfaces/Node'
import SessionConnection from './SessionConnection'

const User = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: globalIdField('User'),
    name: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLString) },
    createdAt: { type: GraphQLNonNull(GraphQLDateTime) },
    updatedAt: { type: GraphQLNonNull(GraphQLDateTime) },
    sessions: {
      type: SessionConnection,
      args: connectionArgs,
      async resolve(user, args) {
        const sessions = await user.findSessions()
        return connectionFromArray(sessions, args)
      },
    },
  },
  interfaces: [NodeInterface],
})

export default User
