import { Model } from 'objection'
import { CuidModel } from '../db/objection'

class BaseModel extends CuidModel(Model) {
  $beforeInsert(context) {
    const parent = super.$beforeInsert(context)

    return Promise.resolve(parent).then(() => {
      this.createdAt = new Date().toISOString()
      this.updatedAt = new Date().toISOString()
    })
  }

  $beforeUpdate(context) {
    const parent = super.$beforeUpdate(context)

    return Promise.resolve(parent).then(() => {
      this.updatedAt = new Date().toISOString()
    })
  }

  static create(data) {
    return this.query().insert(data)
  }

  static findOne(where) {
    return this.query()
      .where(where)
      .first()
  }

  static delete(id) {
    return this.query()
      .where('id', id)
      .delete()
  }
}

export default BaseModel
