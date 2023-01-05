const orderBySleep = (a, b) => {
  if (!a.lastSleep) return -1
  if (!b.lastSleep) return 1
  if (a.lastSleep < b.lastSleep) return -1
  if (a.lastSleep > b.lastSleep) return 1
  return 0
}

export default {
  account: state => state.account,
  address: state => state.address,
  hasProvider: state => state.hasProvider,
  connected: state => state.connected,
  Contract: state => state.Contract,
  expOffset: state => state.expOffset,
  health: state => state.health,
  poopData: state => state.poopData,
  eggState: state => state.eggState,
  gotchi: state => state.gotchi,
  ownedGotchis: state => state.ownedGotchis,
  latestGotchis: state => state.latestGotchis,
  game: state => state.game,
  filteredGotchis: state => {
    // Filter active gotchis to top!
    const arr =
      state.ownedGotchis && state.ownedGotchis.length > 0
        ? state.ownedGotchis.sort(orderBySleep).reverse()
        : []

    return arr
  }
}
