import axios from 'axios'
import BN from 'bignumber.js'
// import Web3 from 'web3'

const getHeaderOptions = state => {
  return {
    headers: {
      'x-api-key': state.constants.opensea
    }
  }
}

const formatGotchiById = res => {
  return {
    keeper: res[0],
    id: BN(res[1]).toNumber(),
    lastSleep: BN(res[2]).toNumber(),
    startDate: BN(res[3]).toNumber(),
    totalFood: BN(res[4]).toNumber(),
    totalGames: BN(res[5]).toNumber(),
    stage: BN(res[6]).toNumber(),
    isAlive: res[7]
  }
}

const formatGotchiHealth = res => {
  return {
    energy: BN(res[0]).toNumber(),
    fun: BN(res[1]).toNumber(),
    hunger: BN(res[2]).toNumber(),
    hygiene: BN(res[3]).toNumber(),
    poops: BN(res[4]).toNumber(),
    sleeping: res[5]
  }
}

const formatGotchiLatest = res => {
  return {
    uuid: BN(res._gotchiUuid).toNumber(),
    id: BN(res._gotchiId).toNumber(),
    keeper: res._gotchiOwner,
    contract: res._gotchiContract
  }
}

export default {
  // Connect to either a known web3 provider, or fallback to rinkeby
  // , state, dispatch
  async connect({ commit }) {
    if (window.ethereum) {
      window.web3 = window.Web3(window.ethereum)
      try {
        // Request account access if needed
        const eth = await window.ethereum.enable()
        commit('SET_HASPROVIDER', true)
        commit('USE_ACCOUNT', eth[0])
      } catch (error) {
        // User denied account access...
      }
    } else {
      console.log('Non-Ethereum browser detected.')
    }

    // let web3Provider = false
    // if (typeof window.web3 !== 'undefined') {
    //   web3Provider = window.web3.currentProvider
    //   commit('SET_HASPROVIDER', true)
    // } else if (!state.retried) {
    //   commit('SET_RETRY', true)
    //   setTimeout(() => {
    //     dispatch('connect')
    //   }, 1000)
    // }
    // if (state.retried && !web3Provider && window.web3) {
    //   web3Provider = window.web3.providers.HttpProvider(state.constants.rpcUrl)
    // }
    // if (web3Provider && window.web3) {
    //   window.web3 = window.web3(web3Provider)
    //   commit('SET_CONNECTED', true)
    //   dispatch('setAccountInterval')
    //   dispatch('mountContract')
    // }
  },

  setAccountInterval({ dispatch }) {
    dispatch('checkAccount')
    setInterval(() => {
      dispatch('checkAccount')
    }, 3000)
  },

  checkAccount({ commit, state }) {
    // testing but hacky
    // const acc = window.web3.eth.accounts
    // if (!acc) console.error(acc)
    // if (state.account !== acc[0]) {
    //   commit('USE_ACCOUNT', acc[0])
    // } else if (!acc.length) {
    //   commit('USE_ACCOUNT', null)
    // }
    window.web3.eth.getAccounts((error, accounts) => {
      if (error) console.error(error)
      if (state.account !== accounts[0]) {
        commit('USE_ACCOUNT', accounts[0])
      } else if (!accounts.length) {
        commit('USE_ACCOUNT', null)
      }
    })
  },

  mountContract({ dispatch, commit, state }) {
    if (state.connected) {
      commit('CLEAR_CONTRACT')
      commit('USE_CONTRACT', {
        contract: window.web3.eth.contract(state.abi.abi),
        address: state.constants.contractAddress
      })
      setTimeout(() => {
        dispatch('getMyGotchis')
        dispatch('getLatestGotchis')
      }, 500)
    } else {
      setTimeout(() => {
        dispatch('mountContract')
      }, 500)
    }
  },

  async newGotchi({ state, dispatch }, { contract, idx }) {
    if (!idx || !state.Contract) return
    return new Promise((resolve, reject) => {
      let txnHash
      state.Contract.startNewGotchi(
        idx,
        contract,
        { from: state.account },
        (e, h) => {
          if (e) return reject(e)
          txnHash = h
          // Kick off animation
          dispatch('setEgg', 1)
        }
      )

      state.Contract.GotchiStarted(
        [{ _gotchiOwner: state.account }],
        (e, res) => {
          if (e) reject(e)
          if (res && res.transactionHash === txnHash) {
            resolve(res)
            dispatch('getGotchi', { contract, idx })
            dispatch('setEgg', 2)
          }
        }
      )
    })
  },

  async updateGotchiById({ state, dispatch }, { contract, idx, data }) {
    if (!data.uuid || !state.Contract) return

    return new Promise((resolve, reject) => {
      const health = state.health
      let txnHash
      state.Contract.updateGotchi(
        data.uuid,
        data.lastSleep,
        data.totalFood,
        data.totalGames,
        health.energy,
        health.fun,
        health.hunger,
        health.hygiene,
        data.poops,
        data.sleeping,
        { from: state.account },
        (e, h) => {
          // Finish based on status!
          if (e) reject(e)
          txnHash = h
        }
      )

      state.Contract.GotchiProgress(
        [{ _gotchiOwner: state.account }],
        (e, res) => {
          if (e) return reject(e)
          if (res && res.transactionHash === txnHash) {
            resolve(res)
            dispatch('getGotchi', { contract, idx })
          }
        }
      )
    })
  },

  async getMyGotchis({ state, commit, dispatch }) {
    const ownPromises = []
    if (!state.account) return
    const ownedIds = await new Promise((resolve, reject) => {
      state.Contract.getOwnerGotchiIds(state.account, (e, r) => {
        if (e) return reject(e)
        else resolve(r)
      })
    })

    if (ownedIds && ownedIds.length > 0) {
      ownedIds.forEach(o => {
        ownPromises.push(
          new Promise((res, rej) => {
            state.Contract.getGotchiById(o, (e, r) => {
              if (e) return rej(e)
              else {
                // keep track of the uuid
                let p = r
                p[9] = o
                res(p)
              }
            })
          })
        )
      })

      let allData = await Promise.all(ownPromises)
      allData = allData.map(formatGotchiById)

      // commit all data into store
      commit('SET_GOTCHIS', allData)
    }
    dispatch('getOwnedNfts')
  },

  async getOwnedNfts({ state, commit }, address) {
    const isDev = window.location.host.includes('localhost')
    const id = isDev ? state.constants.testingAccount : address || state.account
    const res = await axios.get(
      `${state.constants.nftApiAll}?owner=${id}&order_direction=desc`,
      getHeaderOptions(state)
    )
    const raw = res.data
    // NOTE: This is excluding pagination for now...
    commit('UPDATE_GOTCHIS', raw.assets.filter(f => f.image_url))
  },

  async getRelatedNfts({ state, commit }, id) {
    return axios
      .get(`${state.constants.nftApiAll}?owner=${id}&order_direction=desc`)
      .then(r => {
        return r.data && r.data.assets
          ? r.data.assets.filter(f => f.image_url).map(r => ({ raw: r }))
          : []
      })
  },

  async getGotchi({ state, commit, dispatch }, { contract, idx }) {
    if (!idx || !state.Contract) return
    const id = parseInt(idx, 10)
    let gId
    let gotchi
    let gotchiHealth

    // Check if we have the raw data already
    // If we have raw data already, assign a valid uuid
    if (state.ownedGotchis && state.ownedGotchis.length > 0) {
      state.ownedGotchis.map(f => {
        if (f.id === id) gId = f.uuid
      })
    }
    if (typeof gId === 'undefined') {
      const tmp = await new Promise((resolve, reject) => {
        state.Contract.getGotchiUuid(id, (e, r) => {
          if (e) return reject(e)
          else resolve(r)
        })
      })
      gId = tmp.toNumber()
    }

    // Get fresh data no matter what
    if (gId) {
      gotchi = await new Promise((resolve, reject) => {
        state.Contract.getGotchiById(gId, (e, r) => {
          if (e) return reject(e)
          else resolve(r)
        })
      })
      gotchiHealth = await new Promise((resolve, reject) => {
        state.Contract.getGotchiHealth(gId, (e, r) => {
          if (e) return reject(e)
          else resolve(r)
        })
      })
    }

    // outside data, get it!
    const res = await axios.get(
      `${state.constants.nftApiSingle}${contract}/${idx}`,
      getHeaderOptions(state)
    )
    const raw = res.data
    const fullGotchi = Object.assign(
      gotchi ? formatGotchiById(gotchi) : {},
      gotchiHealth ? formatGotchiHealth(gotchiHealth) : {},
      {
        raw,
        name: raw.name,
        uuid: gId
      },
      {
        id
      }
    )

    // view egg or not
    const st = fullGotchi.lastSleep ? 3 : 0
    dispatch('setEgg', st)

    // Set the tamagotchi outside data
    commit('SET_GOTCHI', fullGotchi)
    commit('UPDATE_KEYVALUE', {
      key: 'health',
      value: {
        energy: fullGotchi.energy || 0,
        fun: fullGotchi.fun || 0,
        hunger: fullGotchi.hunger || 0,
        hygiene: fullGotchi.hygiene || 0
      }
    })
    dispatch('loadPoopData', fullGotchi.id)
  },

  async getLatestGotchis({ dispatch, state }) {
    const startLogs = state.Contract.allEvents({
      fromBlock: 0,
      toBlock: 'latest'
    })
    await startLogs.get((e, res) => {
      if (e) return
      const assets = res
        .filter(f => f.event === 'GotchiStarted')
        .reverse()
        .map(r => formatGotchiLatest(r.args))
        .slice(0, 5)

      dispatch('getLatestGotchiData', assets)
    })
  },

  async getLatestGotchiData({ commit, state }, assets) {
    const p = []

    assets.forEach(a => {
      p.push(
        axios.get(
          `${state.constants.nftApiSingle}${a.contract}/${a.id}`,
          getHeaderOptions(state)
        )
      )
    })

    const tmp = await Promise.all(p)
    const filtered =
      tmp && tmp.length > 0 ? tmp.map(t => ({ raw: t.data })) : []

    commit('UPDATE_KEYVALUE', {
      key: 'latestGotchis',
      value: filtered
    })
  },

  setEgg({ commit }, num) {
    commit('SET_EGG', num)
  },

  setGotchi({ commit }, data) {
    commit('SET_GOTCHI', data)
  },

  resetGotchi({ commit }) {
    commit('RESET_GOTCHI')
  },

  startGame({ commit }) {
    commit('START_GAME', { active: true })
  },

  resetGame({ commit }) {
    commit('RESET_GAME')
  },

  updateHealth({ commit }, { key, value }) {
    commit('UPDATE_HEALTH', { key, value })
  },

  updateKeyValue({ commit }, { key, value }) {
    commit('UPDATE_KEYVALUE', { key, value })
  },

  loadPoopData({ commit, state }, id) {
    let value = localStorage.getItem('poopData')
    if (value && value.length > 0) {
      const v = JSON.parse(value)
      if (v && v.poops && v.id && v.id === id) value = v.poops
      else value = state.poopData
    } else value = state.poopData
    commit('UPDATE_KEYVALUE', { key: 'poopData', value })
  }
}
