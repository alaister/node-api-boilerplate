import { Model } from 'objection'
import { UniqueModel } from '../db/objection'
import BaseModel from './Base'

class Profile extends UniqueModel(['accountId'])(BaseModel) {
  static get tableName() {
    return 'profiles'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['accountId', 'givenName', 'familyName'],
      properties: {
        id: { type: 'string' },
        accountId: { type: 'string' },
        givenName: { type: 'string', minLength: 1, maxLength: 255 },
        familyName: { type: 'string', minLength: 1, maxLength: 255 },
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
          from: 'profiles.accountId',
          to: 'accounts.id',
        },
      },
    }
  }

  static async batchGetProfiles(ids) {
    const profiles = await this.query().whereIn('id', ids)
    return ids.map(id => profiles.find(profile => profile.id === id) || null)
  }
}

export default Profile
