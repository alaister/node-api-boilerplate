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
    const session = await Session.query()
      .where({ id: key })
      .whereNotDeleted()
      .first()

    if (!session) return null

    return { ...session.data, id: session.id }
  }

  async set(key, sess) {
    const session = await Session.query()
      .where({ id: key })
      .first()

    if (!session)
      await Session.query().insert({
        id: key,
        data: sess,
        expires: new Date(sess._expire).toISOString(),
        userId: sess.passport.user.id,
        ip: this.ip,
        country: this.country,
      })
    else
      await await Session.query()
        .where({ id: key })
        .patch({ data: sess, deleted: false })
  }

  async destroy(key) {
    await Session.query()
      .where('id', key)
      .delete()
  }
}

export default CustomSessionStore
