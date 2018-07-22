import User from '../models/User'
import { AuthenticationError } from '../utils/errors'

export default function makeUserActions(currentUser) {
  return {
    async currentUser() {
      if (!currentUser) {
        throw new AuthenticationError()
      }

      return await User.findById(currentUser.id)
    },
  }
}
