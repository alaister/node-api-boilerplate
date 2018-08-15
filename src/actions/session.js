import jwt from 'jsonwebtoken'
import randtoken from 'rand-token'

import User from '../models/User'
import Session from '../models/Session'
import {
  ValidationError,
  NotFoundError,
  AuthenticationError,
  ForbiddenError,
} from '../utils/errors'

const { APP_SECRET } = process.env

export default function makeSessionActions(currentUser) {
  return {
    async getSessionsByUserId(userId) {
      return await Session.find({ userId })
    },
    async login({ email, password }) {
      const user = await User.findOne({ email })

      if (!user) {
        throw new ValidationError({
          field: ['email'],
          message: 'Email address not found',
        })
      }

      const match = await user.comparePassword(password)

      if (!match) {
        throw new ValidationError({
          field: ['password'],
          message: 'Password incorrect',
        })
      }

      const jwtid = randtoken.uid(24)

      const accessToken = jwt.sign({ sub: user.id }, APP_SECRET, {
        expiresIn: 300,
        jwtid,
      })

      await Session.create({ userId: user.id, jwtIds: [jwtid] })

      return { user, accessToken }
    },
    async logout() {
      if (!currentUser) {
        throw new AuthenticationError()
      }

      const session = await Session.findOne({
        userId: currentUser.id,
        jwtIds: currentUser.jwtId,
      })

      return await session.remove()
    },
    async deleteSession(id) {
      if (!currentUser) {
        throw new AuthenticationError()
      }

      const session = await Session.findById(id)

      if (!session) {
        throw new NotFoundError('Refresh token not found or expired')
      }

      if (!session.userId.equals(currentUser.id)) {
        throw new ForbiddenError()
      }

      return await session.remove()
    },
  }
}
