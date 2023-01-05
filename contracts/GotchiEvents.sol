pragma solidity ^0.4.24;

/**
 * @title GotchiData
 * @author Trevor Clarke (github.com/trevorjtclarke)
 * @dev This contract contains all the event definitions,
 *      allowing easier event management
 */
contract GotchiEvents {
  event Deposit(address indexed _from, uint value);
  event GotchiStarted(address indexed _gotchiOwner, uint256 indexed _gotchiId, uint _gotchiUuid, address _gotchiContract);
  event GotchiProgress(address indexed _gotchiOwner, uint256 indexed _gotchiId, uint256 _totalGames, uint256 _totalFood);
  event GotchiDied(uint256 indexed _gotchiId);
  event GotchiCured(uint256 indexed _gotchiId);
  event GotchiImmortalized(address indexed _gotchiOwner, uint256 indexed _gotchiId);
}
