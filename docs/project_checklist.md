## Consensys Academy Grading Rubric

#### User Interface Requirements
- [x] Run the app on a dev server locally for testing/grading
- [x] You should be able to visit a URL and interact with the application
- [x] App recognizes current account
- [x] Sign transactions using MetaMask
- [x] Contract state is updated
- [x] Updates reflected in the UI

#### Test Requirements
- [x] Write at least 5 tests for each contract with descriptions (see [below](#truffle-tests))
- [x] Tests are properly structured
- [x] Tests provide adequate coverage for the contracts
- [x] All tests pass

#### Design Pattern Requirements
- [x] Includes [design pattern decisions](./design_pattern_decisions.md)

#### Security Tools / Common Attacks
- [x] Includes [avoiding common attacks](./avoiding_common_attacks.md)

#### Library
- [x] Contracts use a library **Open-Zeppelin**

#### Additional Requirements
- [x] Smart contract code commented using [NatSpec](https://github.com/ethereum/wiki/wiki/Ethereum-Natural-Specification-Format)

#### Stretch Goals
- [x] Deployed to Rinkeby
- [x] Fully playable Game

### Truffle Tests
  `npm test`

```
  Contract: Gotchi
    Contract Initialized
      ✓ should have valid owner (125ms)
      ✓ should have 0 initial balance
    Gotchi Start
      ✓ should create new gotchi item (86ms)
      ✓ should update a gotchi item (123ms)
      ✓ should read a single gotchi item core data (67ms)
      ✓ should read a single gotchi item health data (57ms)
    Gotchi Continued Play
      ✓ should read an updated gotchi item core data (122ms)
      ✓ should read an updated gotchi item meta data (108ms)
      ✓ should read all gotchis for owner (102ms)
      ✓ should return a single gotchi id by uuid (106ms)
    Gotchi Random
      ✓ should validate donations (313ms)

  Contract: GotchiBonus
    Contract Fees & Rewards
      ✓ should inherit events
      ✓ should inherit data structures

  Contract: GotchiData
    Contract Data Structures
      ✓ gotchis array exists
      ✓ gotchiHealth array exists
      ✓ gotchiIdOwner mapping exists
      ✓ gotchiIdUuid mapping exists

  Contract Events
    ✓ should have Deposit event
    ✓ should have GotchiStarted event
    ✓ should have GotchiProgress event
    ✓ should have GotchiDied event
    ✓ should have GotchiCured event
    ✓ should have GotchiImmortalized event


  23 passing (2s)
```
