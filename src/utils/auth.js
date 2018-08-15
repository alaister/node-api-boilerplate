import jwt from 'jsonwebtoken'
import randtoken from 'rand-token'
import Session from '../models/Session'
import { NotFoundError, ForbiddenError, AuthenticationError } from './errors'

const { APP_SECRET } = process.env

export async function refreshToken(token) {
  const decoded = await verifyJwt(token)

  const session = await Session.findOne({ jwtIds: decoded.jti })

  if (!session) {
    throw new NotFoundError('Session not found or expired')
  }

  if (!session.userId.equals(decoded.sub)) {
    throw new ForbiddenError()
  }

  const jwtid = randtoken.uid(24)

  const refreshedAccessToken = jwt.sign({ sub: session.userId }, APP_SECRET, {
    expiresIn: 300,
    jwtid,
  })

  // If not SSRing on your frontend uncomment this line
  // session.jwtIds.id(decoded.jti).remove()
  session.jwtIds.push(jwtid)

  await session.save()

  return { refreshedAccessToken, decoded }
}

const verifyJwt = token =>
  new Promise((resolve, reject) =>
    jwt.verify(
      token,
      APP_SECRET,
      { ignoreExpiration: true },
      (err, decoded) => {
        if (err) {
          return reject(new AuthenticationError())
        }

        return resolve(decoded)
      }
    )
  )
