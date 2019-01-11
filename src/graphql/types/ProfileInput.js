import { GraphQLInputObjectType, GraphQLString } from 'graphql'

const ProfileInput = new GraphQLInputObjectType({
  name: 'ProfileInput',
  fields: {
    givenName: {
      type: GraphQLString,
    },
    familyName: {
      type: GraphQLString,
    },
  },
})

export default ProfileInput
