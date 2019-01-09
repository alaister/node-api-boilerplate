import { Model } from 'objection'
import { SoftDelete } from '../db/objection'

class Session extends SoftDelete(Model) {
  static get tableName() {
    return 'sessions'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['accountId', 'expires', 'ip'],
      properties: {
        id: { type: 'string' },
        accountId: { type: 'string' },
        country: { type: 'string' },
        ip: {
          type: 'string',
          oneOf: [
            { format: 'ipv4' },
            { format: 'ipv6' },
            { pattern: '^Unknown$' },
          ],
        },
        expires: { type: 'string', format: 'date-time' },
        data: { type: 'object' },
        deleted: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    }
  }

  static get relationMappings() {
    return {
      account: {
        relation: Model.BelongsToOneRelation,
        modelClass: `${__dirname}/Account`,
        join: {
          from: 'sessions.accountId',
          to: 'accounts.id',
        },
      },
    }
  }

  static create(data) {
    return this.query().insert(data)
  }

  static findOne(where) {
    return this.query()
      .whereNotDeleted()
      .where(where)
      .first()
  }

  static delete(id) {
    return this.query()
      .where('id', id)
      .delete()
  }
}

export default Session
