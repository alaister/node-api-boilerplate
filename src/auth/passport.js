import passport from 'koa-passport'
import { Strategy as LocalStrategy } from 'passport-local'
import User from '../models/User'

passport.serializeUser((user, done) => {
  done(null, user.$omit('password').toJSON())
})

passport.deserializeUser((user, done) => {
  done(null, new User().$set(user))
})

passport.use(
  new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.query()
      .where({ email })
      .first()
      .then(user => {
        if (!user)
          return done(null, false, {
            message: JSON.stringify({
              field: ['email'],
              message: 'Email not found',
            }),
          })

        user.verifyPassword(password).then(res => {
          if (!res)
            return done(null, false, {
              message: JSON.stringify({
                field: ['password'],
                message: 'Incorrect password',
              }),
            })

          return done(null, user.$omit('password'))
        })
      })
      .catch(error => done(error))
  })
)

export default passport
