import { GraphQLNonNull } from 'graphql'
import { formatUserValidationErrors } from '../../utils/errors'
import ProfileInput from '../types/ProfileInput'
import ProfilePayload from '../types/ProfilePayload'

export default {
  type: ProfilePayload,
  args: {
    profile: {
      type: new GraphQLNonNull(ProfileInput),
    },
  },
  async resolve(_root, { profile: input }, { socialService, currentUser }) {
    try {
      const profile = await socialService.updateProfile(currentUser.id, input)

      return { profile, userErrors: [] }
    } catch (error) {
      console.log(error)
      return formatUserValidationErrors(error)
    }
  },
}
