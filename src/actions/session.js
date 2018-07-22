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
    async signup(data) {
      try {
        return await User.create(data)
      } catch (err) {
        throw new ValidationError(err)
      }
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

      const accessToken = jwt.sign({ id: user.id }, APP_SECRET, {
        expiresIn: 300,
        jwtid,
      })
      const refreshToken = randtoken.uid(256)

      await Session.create({ userId: user.id, refreshToken, jwtIds: [jwtid] })

      return { user, accessToken, refreshToken }
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
    async refreshToken(refreshToken) {
      const session = await Session.findOne({ refreshToken })

      if (!session) {
        throw new NotFoundError('Refresh token not found or expired')
      }

      const jwtid = randtoken.uid(24)

      const accessToken = jwt.sign({ id: session.userId }, APP_SECRET, {
        expiresIn: 300,
        jwtid,
      })

      session.jwtIds.push(jwtid)

      await session.save()

      return accessToken
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
