const fs = require('fs')
const path = require('path')
const cfg = require('../src/store/config.json')

const Gotchi = artifacts.require('./Gotchi.sol')
const GotchiBonus = artifacts.require('./GotchiBonus.sol')
const GotchiData = artifacts.require('./GotchiData.sol')
const GotchiEvents = artifacts.require('./GotchiEvents.sol')
const GotchiUtils = artifacts.require('./GotchiUtils.sol')

module.exports = async deployer => {
  // Need the library first
  await deployer.deploy(GotchiUtils)
  deployer.link(GotchiUtils, [Gotchi])

  // Deploy main
  const g = await deployer.deploy(Gotchi)
  console.log('Contract address:', g.address)

  // Link dependencies
  deployer.link(Gotchi, [GotchiData, GotchiEvents, GotchiBonus])

  // Deploy the remaining dependencies
  await deployer.deploy(GotchiBonus)
  await deployer.deploy(GotchiData)
  await deployer.deploy(GotchiEvents)

  // update to use deployed address
  cfg.address = g.address
  await fs.writeFileSync(path.join(__dirname, '../src/store/config.json'), JSON.stringify(cfg), 'utf8')
}
