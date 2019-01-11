import { transaction } from 'objection'
import dataloadersFactory from '../dataloaders'
import Session from '../models/Session'
import User from '../models/User'
import {
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
} from '../utils/errors'
import { addPaginationToQuery } from '../utils/pagination'

export default function accountServiceFactory({
  currentUser = null,
  dataloaders = dataloadersFactory(),
}) {
  return {
    /**
     *  User methods
     */

    registerUser({ email, password, givenName, familyName }) {
      if (currentUser)
        throw new AuthenticationError(
          'You must be logged out to register a new user'
        )
      console.log('wow')
      return transaction(User.knex(), async trx => {
        const user = await User.query(trx).insert({ email, password })
        await user
          .$relatedQuery('profile', trx)
          .insert({ givenName, familyName, userId: user.id })

        return user
      })
    },

    async getUser(where) {
      if (!currentUser) throw new AuthenticationError()

      const user = await User.query()
        .where(where)
        .first()

      if (currentUser.id !== user.id)
        throw new NotFoundError('You can only view your own account')

      return user
    },

    getUserById(id) {
      if (!currentUser) throw new AuthenticationError()

      if (currentUser.id !== id)
        throw new NotFoundError('You can only view your own account')

      return dataloaders.userLoader.load(id)
    },

    deleteUser(id) {
      if (!currentUser) throw new AuthenticationError()

      if (currentUser.id !== id)
        throw new AuthorizationError('You can only delete your own account')

      return User.query()
        .where('id', id)
        .delete()
    },

    /**
     *  Session methods
     */

    createSession(data) {
      return Session.query().insert({ ...data, userId: currentUser.id })
    },

    getSession(where) {
      if (!currentUser) throw new AuthenticationError()

      return Session.query()
        .whereNotDeleted()
        .where({ ...where, userId: currentUser.id })
        .first()
    },

    async getPaginatedSessionsByUserId(paginationArgs, userId) {
      if (!currentUser) throw new AuthenticationError()

      if (currentUser.id !== userId)
        throw new AuthorizationError('You can only view your own sessions')

      const result = await addPaginationToQuery(
        Session.query()
          .whereNotDeleted()
          .where({ userId }),
        paginationArgs
      )

      return result
    },

    async deleteSession(id) {
      if (!currentUser) throw new AuthenticationError()

      const session = await Session.query()
        .where('id', id)
        .first()

      if (!session) throw new NotFoundError()

      if (session.userId !== currentUser.id) throw new NotFoundError()

      return Session.query()
        .where('id', id)
        .first()
        .delete()
    },
  }
}
