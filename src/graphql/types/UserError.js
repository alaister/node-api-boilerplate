import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'

const UserError = new GraphQLObjectType({
  name: 'UserError',
  fields: {
    message: {
      type: GraphQLNonNull(GraphQLString),
    },
    field: {
      type: GraphQLList(GraphQLNonNull(GraphQLString)),
    },
  },
})

export default UserError
