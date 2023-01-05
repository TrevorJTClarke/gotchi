const GotchiContract = artifacts.require('Gotchi')

contract('Gotchi', (accounts) => {
  let Gotchi

  beforeEach(async () => {
    Gotchi = await GotchiContract.new()
  })

  describe('Contract Initialized', () => {
    it("should have valid owner", async () => {
      const owner = await Gotchi.owner()
      assert.equal(owner, web3.eth.coinbase)
    })

    it('should have 0 initial balance', async () => {
      const amount = await Gotchi.getBalance()
      assert.equal(amount, 0)
    })
  })

  describe('Gotchi Start', () => {
    it('should create new gotchi item', async () => {
      const g = await Gotchi.startNewGotchi(1, accounts[0], { from: accounts[0] })

      // Checks status is success & fired needed event data
      assert.equal(g.receipt.status, '0x1')
      assert.equal(g.logs[0].event, 'GotchiStarted')
    })

    it('should update a gotchi item', async () => {
      const n = await Gotchi.startNewGotchi(1, accounts[0], { from: accounts[0] })
      const g = await Gotchi.updateGotchi(
        1, // _gotchiId
        +new Date(), // _lastSleep
        1, // _totalFood
        1, // _totalGames
        5, // _energy
        5, // _fun
        6, // _hunger
        6, // _hygiene
        3, // _poops
        false, // _sleeping
        { from: accounts[0] }
      )

      // Checks status is success & fired needed event data
      assert.equal(g.receipt.status, '0x1')
      assert.equal(g.logs[0].event, 'GotchiProgress')
    })

    it('should read a single gotchi item core data', async () => {
      const n = await Gotchi.startNewGotchi(1, accounts[0], { from: accounts[0] })
      const g = await Gotchi.getGotchiById(1)

      // Just validates if the owner is same as the msg.sender
      assert.equal(g[0], accounts[0])
      assert.isTrue(web3.isAddress(g[0]))
      // Validates a couple default values
      assert.equal(g[1].toNumber(), 1)
      assert.equal(g[6].toNumber(), 1)
      assert.equal(g[7], true)
    })

    it('should read a single gotchi item health data', async () => {
      const n = await Gotchi.startNewGotchi(1, accounts[0], { from: accounts[0] })
      const g = await Gotchi.getGotchiHealth(1)

      // Validates a couple data values
      assert.equal(g[0].toNumber(), 1)
      assert.equal(g[5], false)
    })
  })

  describe('Gotchi Continued Play', () => {
    it('should read an updated gotchi item core data', async () => {
      const n = await Gotchi.startNewGotchi(1, accounts[0], { from: accounts[0] })
      const u = await Gotchi.updateGotchi(1, +new Date(), 1, 1, 5, 5, 6, 6, 3, false, { from: accounts[0] })
      const g = await Gotchi.getGotchiById(1)

      // Validates a couple updated values
      assert.equal(g[1].toNumber(), 1)
      assert.equal(g[4].toNumber(), 1)
      assert.equal(g[5], true)
    })

    it('should read an updated gotchi item meta data', async () => {
      const n = await Gotchi.startNewGotchi(1, accounts[0], { from: accounts[0] })
      const u = await Gotchi.updateGotchi(1, +new Date(), 1, 1, 5, 5, 6, 6, 3, true, { from: accounts[0] })
      const g = await Gotchi.getGotchiHealth(1)

      // Validates a couple updated values
      assert.equal(g[1].toNumber(), 5)
      assert.equal(g[4].toNumber(), 3)
      assert.equal(g[5], true)
    })

    it('should read all gotchis for owner', async () => {
      const n1 = await Gotchi.startNewGotchi(1, accounts[0], { from: accounts[0] })
      const n2 = await Gotchi.startNewGotchi(2, accounts[0], { from: accounts[0] })
      const g = await Gotchi.getOwnerGotchiIds(accounts[0])

      // Validates two created gotchis
      assert.equal(g[0].toNumber(), 1)
      assert.equal(g[1].toNumber(), 2)
    })

    it('should return a single gotchi id by uuid', async () => {
      const n1 = await Gotchi.startNewGotchi(6, accounts[0], { from: accounts[0] })
      const n2 = await Gotchi.startNewGotchi(7, accounts[0], { from: accounts[0] })
      const g1 = await Gotchi.getGotchiUuid(6)
      const g2 = await Gotchi.getGotchiUuid(7)

      // Validates two created gotchi uuid refs
      assert.equal(g1.toNumber(), 1)
      assert.equal(g2.toNumber(), 2)
    })
  })

  describe('Gotchi Random', () => {
    // For fun, check donations work ;)
    it('should validate donations', async () => {
      web3.eth.sendTransaction({ from: web3.eth.coinbase, to: Gotchi.address, value: 10 })
      assert.equal(web3.eth.getBalance(Gotchi.address), 10)
    })
  })

})
