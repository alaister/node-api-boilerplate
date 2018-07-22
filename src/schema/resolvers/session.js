import { handleUserErrors } from '../../utils/errors'

export default {
  Mutation: {
    async login(_parent, { user: input }, { actions }) {
      try {
        const { user, accessToken, refreshToken } = await actions.session.login(
          input
        )

        return {
          userErrors: [],
          user,
          accessToken,
          refreshToken,
        }
      } catch (err) {
        return handleUserErrors(err)
      }
    },
    async logout(_parent, _args, { actions }) {
      try {
        await actions.session.logout()
        // If the session is not found, it means they are already logged out
        return true
      } catch (err) {
        return handleUserErrors(err)
      }
    },
    async refreshToken(_parent, { refreshToken }, { actions }) {
      try {
        const accessToken = await actions.session.refreshToken(refreshToken)

        return { accessToken }
      } catch (err) {
        return handleUserErrors(err)
      }
    },
    async sessionDelete(_parent, { id }, { actions }) {
      try {
        const deletedSession = await actions.session.deleteSession(id)

        return !!deletedSession
      } catch (err) {
        return handleUserErrors(err)
      }
    },
  },
  Session: {
    currentSession(
      session,
      _args,
      {
        user: { jwtId },
      }
    ) {
      return session.jwtIds.includes(jwtId)
    },
  },
}
