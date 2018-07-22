import { handleUserErrors } from '../../utils/errors'

export default {
  Query: {
    async currentUser(_parent, _args, { actions }) {
      try {
        return await actions.user.currentUser()
      } catch (err) {
        handleUserErrors(err)
      }
    },
  },
  User: {
    async sessions(user, _args, { actions }) {
      return await actions.session.getSessionsByUserId(user.id)
    },
  },
}
