const GotchiData = artifacts.require('GotchiData')

contract('GotchiData', async (accounts) => {
  let Data

  beforeEach(async () => {
    Data = await GotchiData.new()
  })

  // Test all Data structures exist
  describe('Contract Data Structures', () => {
    it('gotchis array exists', async () => {
      assert.isNotNull(Data.gotchis)
    })

    it('gotchiHealth array exists', async () => {
      assert.isNotNull(Data.gotchiHealth)
    })

    it('gotchiIdOwner mapping exists', async () => {
      assert.isNotNull(Data.gotchiIdOwner)
    })

    it('gotchiIdUuid mapping exists', async () => {
      assert.isNotNull(Data.gotchiIdUuid)
    })
  })
})
