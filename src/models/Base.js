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
}

export default BaseModel
