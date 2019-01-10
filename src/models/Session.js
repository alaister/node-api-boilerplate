import { Model } from 'objection'
import { SoftDelete } from '../db/objection'

class Session extends SoftDelete(Model) {
  static get tableName() {
    return 'sessions'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['userId', 'expires', 'ip'],
      properties: {
        id: { type: 'string' },
        userId: { type: 'string' },
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
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: `${__dirname}/User`,
        join: {
          from: 'sessions.userId',
          to: 'users.id',
        },
      },
    }
  }
}

export default Session
