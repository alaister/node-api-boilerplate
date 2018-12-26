import {
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'
import { GraphQLDateTime } from 'graphql-iso-date'
import { globalIdField } from 'graphql-relay'
import { NodeInterface } from '../interfaces/Node'

const Session = new GraphQLObjectType({
  name: 'Session',
  fields: {
    id: globalIdField('Session'),
    country: { type: GraphQLNonNull(GraphQLString) },
    ip: { type: GraphQLNonNull(GraphQLString) },
    expires: { type: GraphQLNonNull(GraphQLDateTime) },
    currentSession: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve(session, _args, { currentSession }) {
        return session.id === currentSession.id
      },
    },
    createdAt: { type: GraphQLNonNull(GraphQLDateTime) },
    updatedAt: { type: GraphQLNonNull(GraphQLDateTime) },
  },
  interfaces: [NodeInterface],
})

export default Session
