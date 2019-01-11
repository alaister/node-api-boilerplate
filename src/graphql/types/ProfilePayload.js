import { GraphQLObjectType } from 'graphql'
import Profile from './Profile'
import UserErrors from './UserErrors'

const ProfilePayload = new GraphQLObjectType({
  name: 'ProfilePayload',
  fields: {
    profile: { type: Profile },
    userErrors: { type: UserErrors },
  },
})

export default ProfilePayload
