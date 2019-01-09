import Dataloader from 'dataloader'

export default function dataloadersFactory({ Account, Profile }) {
  return {
    accountLoader: new Dataloader(Account.batchGetAccounts),
    profileLoader: new Dataloader(Profile.batchGetProfiles),
  }
}
