import User from '../models/User'
import { ValidationError, AuthenticationError } from '../utils/errors'

export default function makeUserActions(currentUser) {
  return {
    async currentUser() {
      if (!currentUser) {
        throw new AuthenticationError()
      }

      return await User.findById(
        currentUser.id,
        'name email createdAt updatedAt'
      )
    },
    async batchGetUsers(userIds) {
      const users = await User.find(
        { _id: { $in: userIds } },
        'name email createdAt updatedAt'
      )

      return userIds.map(id => users.find(user => id.equals(user.id)) || null)
    },
    async createUser(data) {
      try {
        const user = await User.create(data)

        user.password = undefined
        user.__v = undefined

        return user
      } catch (err) {
        throw new ValidationError(err)
      }
    },
  }
}
