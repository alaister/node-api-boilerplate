import Dataloader from 'dataloader'

export default function dataloadersFactory(actions) {
  return {
    userLoader: new Dataloader(actions.user.batchGetUsers),
  }
}
