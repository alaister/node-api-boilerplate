import { Model, transaction } from 'objection'
import { PasswordModel, UniqueModel } from '../db/objection'
import BaseModel from './Base'

class Account extends PasswordModel(UniqueModel(['email'])(BaseModel)) {
  static get tableName() {
    return 'accounts'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        id: { type: 'string' },
        email: {
          type: 'string',
          format: 'email',
          minLength: 1,
          maxLength: 255,
        },
        password: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    }
  }

  static get relationMappings() {
    return {
      sessions: {
        relation: Model.HasManyRelation,
        modelClass: `${__dirname}/Session`,
        join: {
          from: 'accounts.id',
          to: 'sessions.accountId',
        },
      },
      profile: {
        relation: Model.HasOneRelation,
        modelClass: `${__dirname}/Profile`,
        join: {
          from: 'accounts.id',
          to: 'profiles.accountId',
        },
      },
    }
  }

  static register({ email, password, givenName, familyName }) {
    return transaction(this.knex(), async trx => {
      const account = await this.query(trx).insert({ email, password })
      await account
        .$relatedQuery('profile', trx)
        .insert({ givenName, familyName, accountId: account.id })

      return account
    })
  }

  static async batchGetAccounts(ids) {
    const accounts = await this.query().whereIn('id', ids)
    return ids.map(id => accounts.find(account => account.id === id) || null)
  }

  findProfile() {
    return this.$relatedQuery('profile')
  }

  findSessions() {
    return this.$relatedQuery('sessions').whereNotDeleted()
  }
}

export default Account
