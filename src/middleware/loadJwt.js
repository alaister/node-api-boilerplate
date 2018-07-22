import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'

const { APP_SECRET } = process.env

export default function loadJwt(req, _res, next) {
  const authorizationHeader = req.headers.authorization

  if (!authorizationHeader) {
    return next()
  }

  const parts = authorizationHeader.split(' ')
  if (parts.length === 2) {
    const scheme = parts[0]
    const credentials = parts[1]

    if (/^Bearer$/i.test(scheme)) {
      const token = credentials

      jwt.verify(token, APP_SECRET, function(err, decoded) {
        if (err) {
          // Token invalid
          return next()
        }

        // Set current user on request
        req.user = { id: Types.ObjectId(decoded.id), jwtId: decoded.jti }

        return next()
      })
    } else {
      return next()
    }
  }
}
