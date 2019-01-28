import Dataloader from 'dataloader'
import Profile from '../models/Profile'
import User from '../models/User'

export default function dataloadersFactory() {
  return {
    userLoader: new Dataloader(User.batchGetById),
    profileLoader: new Dataloader(Profile.batchGetById),
    profileByidUserLoader: new Dataloader(Profile.batchGetByidUser),
  }
}
