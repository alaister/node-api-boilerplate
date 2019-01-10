import User from '../types/User'

export default {
  type: User,
  resolve(_root, _args, { currentUser }) {
    if (!currentUser) return null

    return currentUser
  },
}
