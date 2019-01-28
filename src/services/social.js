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

    getProfileByidUser(idUser) {
      return dataloaders.profileByidUserLoader.load(idUser)
    },

    async updateProfile(idUser, data) {
      if (!currentUser) throw new AuthenticationError()

      if (currentUser.id !== idUser)
        throw new AuthorizationError('You can only update your own profile')

      const profile = await Profile.query()
        .where({ idUser })
        .first()

      if (!profile) throw new NotFoundError()

      return profile
        .$query()
        .patch(data)
        .returning('*')
    },
  }
}
