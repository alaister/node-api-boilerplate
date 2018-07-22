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
  Mutation: {
    async signup(_parent, { user: input }, { actions }) {
      try {
        const user = await actions.user.createUser(input)

        return {
          userErrors: [],
          user,
        }
      } catch (err) {
        return handleUserErrors(err)
      }
    },
  },
  User: {
    async sessions(user, _args, { actions }) {
      return await actions.session.getSessionsByUserId(user.id)
    },
  },
}
