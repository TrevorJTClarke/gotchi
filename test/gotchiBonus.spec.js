const GotchiBonus = artifacts.require('GotchiBonus')

contract('GotchiBonus', (accounts) => {
  let Bonus

  beforeEach(async () => {
    Bonus = await GotchiBonus.new()
  })

  describe('Contract Fees & Rewards', () => {
    it('should inherit events', async () => {
      assert.isNotNull(Bonus.GotchiStarted)
      assert.isNotNull(Bonus.GotchiImmortalized)
    })

    it('should inherit data structures', async () => {
      assert.isNotNull(Bonus.gotchiIdOwner)
      assert.isNotNull(Bonus.gotchiIdUuid)
    })

    // TODO:
    // it('should have cure functionality', async () => {
    //   assert.isNotNull(Bonus.gotchiIdOwner)
    // })
    //
    // it('should have immortality reward', async () => {
    //   assert.isNotNull(Bonus.gotchiIdOwner)
    // })
  })

})
