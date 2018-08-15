import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'
import { refreshToken } from '../utils/auth'

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

    if (/^(Bearer|JWT)$/i.test(scheme)) {
      const token = credentials

      jwt.verify(token, APP_SECRET, function(err, decoded) {
        if (err) {
          if (err.name === 'TokenExpiredError') {
            return refreshToken(token)
              .then(({ decoded, refreshedAccessToken }) => {
                req.refreshedAccessToken = refreshedAccessToken
                req.user = {
                  id: Types.ObjectId(decoded.sub),
                  jwtId: decoded.jti,
                }

                return next()
              })
              .catch(_err => next())
          } else {
            // Token invalid
            return next()
          }
        }

        // Set current user on request
        req.user = { id: Types.ObjectId(decoded.sub), jwtId: decoded.jti }

        return next()
      })
    } else {
      return next()
    }
  }
}
