# Design Patterns

## Modular Contracts
Gotchi was built to be highly maintainable and easily understood. The following are contracts created with focussed execution:

* `Gotchi.sol` - The main contract, responsible for overall flow & CRUD methods. Maintains full knowledge of the other contracts.
* `GotchiBonus.sol` - A contract for game economics, allowing fees to be accrued when a gotchi dies, then be rewarded when a gotchi reaches maximum stage.
* `GotchiData.sol` - A contract with required data for a full Gotchi instance.
* `GotchiEvents.sol` - A contract with the list of events.
* `GotchiUtils.sol` - A library with pure functions that are easily re-usable.

## Object-Oriented Data
Gotchi utilizes two main data structures to make the game successful:

1. **Tama** - Main critical gotchi data
```
  struct Tama {
    address keeper;
    uint id;
    uint256 lastSleep;
    uint256 lastUpdate;
    uint256 startDate;
    uint32 totalFood;
    uint32 totalGames;
    uint8 curedAmt;
    uint8 stage;
  }
```

2. **Health** Secondary less critical data
```
  struct Health {
    uint32 energy;
    uint32 fun;
    uint32 hunger;
    uint32 hygiene;
    uint32 poops;
    bool sleeping;
  }
```

## Data Brevity
Gotchi keeps data as simple as possible, it doesn't interact with any outside data sources/contracts. The data structures are minimal, only 3 mappings & 2 structs.

## Fee Approach
To keep things interesting, Gotchi has a simple fee structure outside of the normal transaction fees for Ethereum. These are:

1. **Cure Fee**: A pre-defined fee, executed if user wishes to re-vive their gotchi instance. The fee is minimal (`0.001 Ether`) and is adjustable by the owner, allowing the price to fluctuate with network and keeping gameplay cheap but not worthless.
2. **Immortality Bonus**: The fees for cure go into a pool of money. The intent is to create a reward pool, which could potentially reimburse players of all their gameplay fees if they achieve the highest level.

## Value Management
Gotchi keeps Ether value logic as simple as possible. Here are the only ways value is used:
* The main contract accepts donations
* Only allow owner to withdraw all funds
* Only allow owner to adjust cure fee
* Only allow gotchi instance owner to pay cure fee
* Only allow gotchi instance owner to receive immortality bonus

## Contract Owner
Gotchi utilizes `Ownable` contract from [Open-Zeppelin Ownable](https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/ownership/Ownable.sol), and in many places uses the modifier `onlyOwner`.

## Circuit Breaker
Gotchi utilizes `Pausable` contract from [Open-Zeppelin Ownable](https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/lifecycle/Pausable.sol), and in any places that interact with non-owner uses the modifier `whenNotPaused`. This allows all data to still be READ-ONLY.
