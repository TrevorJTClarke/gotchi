import config from './config.json'
import abi from '../../build/contracts/Gotchi.json'

const constants = {
  opensea: '9bb279c9b9444bf0a94ead7a3768409a',
  testingAccount: '0xd797d5784f43de300ec0d6bc34fc86023c5d71ce',
  contractAddress: config.address,
  nftApiAll: 'https://api.opensea.io/api/v1/assets/',
  nftApiSingle: 'https://api.opensea.io/api/v1/asset/',
  rpcUrl: `https://rinkeby.infura.io`
}

export default {
  retried: false,
  hasProvider: false,
  account: null,
  connected: false,
  Contract: null,
  abi,
  constants,
  game: {},
  poopData: [],
  ownedGotchis: [],
  latestGotchis: [],
  gotchi: {},
  health: {
    energy: 0,
    fun: 0,
    hunger: 0,
    hygiene: 0
  },
  eggState: 3,
  // TODO: Increase difficulty here, once playtest is done
  expOffset: 3
}
