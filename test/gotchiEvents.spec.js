const GotchiEvents = artifacts.require('GotchiEvents')

contract('GotchiEvents', async (accounts) => {
  const Events = await GotchiEvents.new()

  describe('Contract Events', () => {

    // Test all Events exist
    it('should have Deposit event', async () => {
      assert.isNotNull(Events.Deposit)
    })

    it('should have GotchiStarted event', async () => {
      assert.isNotNull(Events.GotchiStarted)
    })

    it('should have GotchiProgress event', async () => {
      assert.isNotNull(Events.GotchiProgress)
    })

    it('should have GotchiDied event', async () => {
      assert.isNotNull(Events.GotchiDied)
    })

    it('should have GotchiCured event', async () => {
      assert.isNotNull(Events.GotchiCured)
    })

    it('should have GotchiImmortalized event', async () => {
      assert.isNotNull(Events.GotchiImmortalized)
    })
  })
})
