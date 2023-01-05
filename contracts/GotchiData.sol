pragma solidity ^0.4.24;

/**
 * @title GotchiData
 * @author Trevor Clarke (github.com/trevorjtclarke)
 * @dev This contract
 */
contract GotchiData {
  /// @dev the data held for individual gotchi
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

  struct Health {
    uint32 energy;
    uint32 fun;
    uint32 hunger;
    uint32 hygiene;
    uint32 poops;
    bool sleeping;
    bool isImmortal;
  }

  /// @dev keep track of active gotchis
  Tama[] public gotchis;
  Health[] public gotchiHealth;
  mapping (uint => address) public gotchiIdOwner;
  mapping (uint => uint) public gotchiIdUuid;
  mapping (address => uint) ownerGotchiCount;
}
