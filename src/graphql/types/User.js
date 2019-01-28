import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'
import { GraphQLDateTime } from 'graphql-iso-date'
import { connectionArgs, globalIdField } from 'graphql-relay'
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
        return socialService.getProfileByidUser(user.id)
      },
    },
    sessions: {
      type: SessionConnection,
      args: connectionArgs,
      resolve(user, args, { accountService }) {
        return accountService.getPaginatedSessionsByidUser(args, user.id)
      },
    },
  },
  interfaces: [NodeInterface],
})

export default User
