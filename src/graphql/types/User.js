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

const User = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: globalIdField('User'),
    email: { type: GraphQLNonNull(GraphQLString) },
    createdAt: { type: GraphQLNonNull(GraphQLDateTime) },
    updatedAt: { type: GraphQLNonNull(GraphQLDateTime) },
    profile: {
      type: GraphQLNonNull(Profile),
      resolve(user, _args, { socialService }) {
        return socialService.getProfileByUserId(user.id)
      },
    },
    sessions: {
      type: SessionConnection,
      args: connectionArgs,
      async resolve(user, args, { accountService }) {
        const sessions = await accountService.getSessionsByUserId(user.id)
        return connectionFromArray(sessions, args)
      },
    },
  },
  interfaces: [NodeInterface],
})

export default User
