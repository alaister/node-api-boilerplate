import Dataloader from 'dataloader'

export default function makeDataloaders(actions) {
  return {
    userLoader: new Dataloader(actions.user.batchGetUsers),
  }
}
