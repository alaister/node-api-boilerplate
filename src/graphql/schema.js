import { GraphQLObjectType, GraphQLSchema } from 'graphql'
import { GraphQLDate, GraphQLDateTime, GraphQLTime } from 'graphql-iso-date'
import GraphQLJSON from 'graphql-type-json'
import { nodeField } from './interfaces/Node'
import profileUpdate from './mutations/profileUpdate'
import viewer from './queries/viewer'

const schema = new GraphQLSchema({
  Date: GraphQLDate,
  Time: GraphQLTime,
  DateTime: GraphQLDateTime,
  JSON: GraphQLJSON,
  query: new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
      node: nodeField,
      viewer,
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'RootMutation',
    fields: {
      profileUpdate,
    },
  }),
})

export default schema
