import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'
import { GraphQLDateTime } from 'graphql-iso-date'
import { globalIdField } from 'graphql-relay'
import { NodeInterface } from '../interfaces/Node'

const Profile = new GraphQLObjectType({
  name: 'Profile',
  fields: {
    id: globalIdField('Profile'),
    givenName: { type: GraphQLNonNull(GraphQLString) },
    familyName: { type: GraphQLNonNull(GraphQLString) },
    createdAt: { type: GraphQLNonNull(GraphQLDateTime) },
    updatedAt: { type: GraphQLNonNull(GraphQLDateTime) },
  },
  interfaces: [NodeInterface],
})

export default Profile
