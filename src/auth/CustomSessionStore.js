import Session from '../models/Session'

class CustomSessionStore {
  constructor(ctx) {
    this.ip =
      ctx.header['cf-connecting-ip'] ||
      ctx.header['x-forwarded-for'] ||
      ctx.request.ip ||
      'Unknown'
    this.country = ctx.header['cf-ipcountry']
  }

  async get(key) {
    const session = await Session.findOne({ id: key })

    if (!session) return null

    return { ...session.data, id: session.id }
  }

  async set(key, sess) {
    const session = await Session.findOne({ id: key })

    if (!session)
      await Session.create({
        id: key,
        data: sess,
        expires: new Date(sess._expire).toISOString(),
        accountId: sess.passport.user.id,
        ip: this.ip,
        country: this.country,
      })
    else await session.$query().patch({ data: sess })
  }

  async destroy(key) {
    await Session.delete(key)
  }
}

export default CustomSessionStore
