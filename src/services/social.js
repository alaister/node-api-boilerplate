import dataloadersFactory from '../dataloaders'
import Profile from '../models/Profile'
import {
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
} from '../utils/errors'

export default function socialServiceFactory({
  currentUser = null,
  dataloaders = dataloadersFactory(),
}) {
  return {
    getProfileById(id) {
      return dataloaders.profileLoader.load(id)
    },

    getProfileByUserId(userId) {
      return dataloaders.profileByUserIdLoader.load(userId)
    },

    async updateProfile(userId, data) {
      if (!currentUser) throw new AuthenticationError()

      if (currentUser.id !== userId)
        throw new AuthorizationError('You can only update your own profile')

      const profile = await Profile.query()
        .where({ userId })
        .first()

      if (!profile) throw new NotFoundError()

      return profile
        .$query()
        .patch(data)
        .returning('*')
    },
  }
}
