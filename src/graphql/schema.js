import { GraphQLObjectType, GraphQLSchema } from 'graphql'
import { GraphQLDate, GraphQLDateTime, GraphQLTime } from 'graphql-iso-date'
import GraphQLJSON from 'graphql-type-json'
import { GraphQLUpload } from 'graphql-upload'
import { nodeField } from './interfaces/Node'
import profileUpdate from './mutations/profileUpdate'
import profileUploadAvatarImage from './mutations/profileUploadAvatarImage'
import viewer from './queries/viewer'

const schema = new GraphQLSchema({
  Date: GraphQLDate,
  Time: GraphQLTime,
  DateTime: GraphQLDateTime,
  JSON: GraphQLJSON,
  Upload: GraphQLUpload,
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
      profileUploadAvatarImage,
    },
  }),
})

export default schema
