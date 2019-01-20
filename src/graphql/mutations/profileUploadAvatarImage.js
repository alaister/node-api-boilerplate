import { GraphQLNonNull } from 'graphql'
import { GraphQLUpload } from 'graphql-upload'
import { formatUserValidationErrors } from '../../utils/errors'
import ProfilePayload from '../types/ProfilePayload'

export default {
  type: ProfilePayload,
  args: {
    image: {
      type: GraphQLNonNull(GraphQLUpload),
    },
  },
  async resolve(_root, { image }, { socialService, currentUser }) {
    try {
      // const profile = await socialService.updateProfile(currentUser.id, input)
      const { filename, mimetype, createReadStream } = await image
      console.log('filename', filename, mimetype)

      return { profile: null, userErrors: [] }
    } catch (error) {
      return formatUserValidationErrors(error)
    }
  },
}
