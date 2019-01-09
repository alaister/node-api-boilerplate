import Account from '../types/Account'

export default {
  type: Account,
  resolve(_root, _args, { currentUser }) {
    if (!currentUser) return null

    return currentUser
  },
}
