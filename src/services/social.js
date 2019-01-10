import dataloadersFactory from '../dataloaders'

export default function socialServiceFactory({
  // currentUser = null,
  dataloaders = dataloadersFactory(),
}) {
  return {
    getProfileById(id) {
      return dataloaders.profileLoader.load(id)
    },

    getProfileByUserId(userId) {
      return dataloaders.profileByUserIdLoader.load(userId)
    },
  }
}
