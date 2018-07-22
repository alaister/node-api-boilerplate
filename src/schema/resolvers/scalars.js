import { GraphQLDate, GraphQLTime, GraphQLDateTime } from 'graphql-iso-date'
import GraphQLJSON from 'graphql-type-json'

export default {
  Date: GraphQLDate,
  Time: GraphQLTime,
  DateTime: GraphQLDateTime,
  JSON: GraphQLJSON,
}
