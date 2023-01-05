pragma solidity ^0.4.24;

import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "./GotchiData.sol";
import "./GotchiEvents.sol";

/**
 * @title GotchiBonus
 * @author Trevor Clarke (github.com/trevorjtclarke)
 * @dev This contract is responsible for the incentivisation & economics
 *      of the gotchi game. Based on game progress there are several cases
 *      where a gotchi can die, which will trigger a user to cure their
 *      gotchi if they wish to continue playing. The cure action results in
 *      a fee which becomes a pool of money to win later. If a gotchi
 *      becomes immortal, the fee pool then becomes divided into 50% & transferred
 *      to the gotchi owner. This should enable all (if not more!) transaction
 *      fees to be recouped by the gotchi owner.
 */
contract GotchiBonus is GotchiData, GotchiEvents {
  using SafeMath for uint256;
  using SafeMath for uint8;

  /**
   * @dev contract state, keep track of which gotchis achieved immortality
   */
  address public owner;
  uint256 cureFeePool = 0;
  uint cureFee = 0.001 ether;
  uint8 immortalCap = 1;

  mapping (address => uint) public ownerToImmortalCount;
  uint256[] gotchiImmortals;

  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  /**
   * @dev Helper function, not necessarily required, but helpful
   */
  function getBalance() external constant returns(uint256 balance) {
    return address(this).balance;
  }

  /**
   * @dev Allows the owner to remove all funds from contract. This will ruin
   *      any future fee bonuses for other players. Be nice!
   */
  function withdrawAll() external onlyOwner {
    owner.transfer(address(this).balance);
  }

  /**
   * @dev Allows the owner to set a reasonable fee, helpful when network &
   *      Ether market values shift over time. Be nice!
   */
  function setCureFee(uint _fee) external onlyOwner {
    cureFee = _fee;
  }

  /**
   * @dev Starts the game with a max of 1 immortal gotchi per player, but 
   *      allows the owner to raise that number when appropriate.
   */
  function setImmortalCap(uint8 _cap) external onlyOwner {
    immortalCap = _cap;
  }

  /**
   * @dev Allows users to reset the gameplay, if fee is paid
   *      Fee is directly paid to the contract
   *      Withdraw occurs from a 50% total pool amount
   *      NOTE: Keeping stage, allowing user to catch back up,
   *      just requires extra attention
   */
  function cureGotchi(uint256 _gotchiId) external payable {
    require(msg.value == cureFee);
    uint256 amount = msg.value;
    cureFeePool = cureFeePool.add(amount.div(2));

    // reset gotchi main data
    Tama memory g = gotchis[_gotchiId];
    g.curedAmt = uint8(g.curedAmt.add(1));
    g.totalFood = 0;
    g.totalGames = 0;
    gotchis[_gotchiId] = g;

    // reset gotchi reference data
    Health memory h = gotchiHealth[_gotchiId];
    h.energy = 1;
    h.fun = 2;
    h.hunger = 1;
    h.hygiene = 1;
    h.poops = 0;
    h.sleeping = false;
    gotchiHealth[_gotchiId] = h;

    // Let the user know they can haz #fun again
    emit GotchiCured(_gotchiId);
  }

  /**
   * @dev TODO: Allows users to get a special Ether bonus upon
   *      successfully completing the game.
   */
  function getImmortalBonus(address _gotchiOwner, uint256 _gotchiId) external {
    bool immortalState = gotchiHealth[_gotchiId].isImmortal;
    require(immortalState = false, "Immortality is the highest plane!");
    require(ownerToImmortalCount[_gotchiOwner] < immortalCap, "The air of the immortals is rare.");
    immortalState = true;
    gotchiImmortals.push(_gotchiId);
    ownerToImmortalCount[_gotchiOwner]++;

    require(address(this).balance > 0, "Sorry, we are broke");
    uint256 amount = cureFeePool.div(2);
    require(amount > .1 ether, "Sorry, the pool is currently too small to send");
    cureFeePool = cureFeePool.sub(amount);
    _gotchiOwner.transfer(amount);
    
    // Let user know they rock!!
    emit GotchiImmortalized(_gotchiOwner, _gotchiId);
  }
}
