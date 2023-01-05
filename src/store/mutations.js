export default {
  SET_HASPROVIDER(state, bool) {
    state.hasProvider = bool
  },
  SET_RETRY(state, bool) {
    state.retried = bool
  },
  SET_CONNECTED(state, bool) {
    state.connected = bool
  },
  CLEAR_ACCOUNT(state) {
    state.account = null
  },
  USE_ACCOUNT(state, account) {
    state.account = account
  },
  USE_CONTRACT(state, { contract, address }) {
    state.Contract = contract.at(address)
  },
  CLEAR_CONTRACT(state) {
    state.Contract = null
  },
  SET_EGG(state, num) {
    state.eggState = num || 0
  },
  SET_GOTCHI(state, data) {
    state.gotchi = Object.assign({}, state.gotchi, data)
  },
  RESET_GOTCHI(state) {
    state.gotchi = {}
    state.poopData = []
    state.health = {
      energy: 0,
      fun: 0,
      hunger: 0,
      hygiene: 0
    }
  },
  SET_GOTCHIS(state, arr) {
    state.ownedGotchis = arr
  },
  UPDATE_GOTCHIS(state, arr) {
    const updatedArr = []
    arr.forEach(a => {
      let excluded = false
      state.ownedGotchis.forEach(o => {
        if (parseInt(a.token_id, 10) === o.id) {
          updatedArr.push(Object.assign({}, o, { raw: a }))
          excluded = true
        }
      })
      if (!excluded) updatedArr.push({ raw: a })
    })

    // Full replace, since UI needs deep changes
    state.ownedGotchis = updatedArr
  },
  RESET_GOTCHIS(state) {
    state.ownedGotchis = []
  },
  START_GAME(state, data) {
    state.game = Object.assign({}, state.game, data)
  },
  RESET_GAME(state) {
    state.game = {}
  },
  UPDATE_HEALTH(state, { key, value }) {
    const stage = state.gotchi && state.gotchi.stage ? state.gotchi.stage : 1
    const upper = stage * stage * state.expOffset
    let v = value > upper ? upper : value
    if (v < 0) v = 0
    state.health[key] = v
    // Force updates, so watchers can trigger progress events
    state.health = Object.assign({}, state.health)
  },
  UPDATE_KEYVALUE(state, { key, value }) {
    // NOTE: Only used when super lazy/super sure its not important
    state[key] = value

    // Helper for local cache
    if (key === 'poopData') {
      localStorage.setItem(
        'poopData',
        JSON.stringify({
          id: state.gotchi.id,
          poops: value
        })
      )
    }
  }
}
