pragma solidity ^0.4.24;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "zeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "./GotchiBonus.sol";
import "./GotchiUtils.sol";

/**
 * @title GotchiUtils
 * @author Trevor Clarke (github.com/trevorjtclarke)
 * @dev Ownership is me, and can be transferred to
 *      another owner upon successful usage within network
 *      and for the right reasons.
 *      NOTE: Data structure & Events are split into separate contracts
 */
contract Gotchi is GotchiBonus, Ownable, Pausable {
  using SafeMath for uint256;

  address public owner;

  /// @dev constructor, assigns ownership
  constructor() public {
    owner = msg.sender;
    /// @dev no one can own the dead gotchi
    gotchis.push(Tama(owner, 0, now, now, now, 0, 0, 0, 0));
    gotchiHealth.push(Health(0, 0, 0, 0, 0, false, false));
  }

  //////////////////////////////////////////
  /// Modifiers
  //////////////////////////////////////////

  /// @dev Throws if called by any account other than the owner.
  modifier validGotchiOwner(uint _gotchiId) {
    require(msg.sender == gotchiIdOwner[_gotchiId], 'Owner is invalid');
    _;
  }

  //////////////////////////////////////////
  /// Functions
  //////////////////////////////////////////

  // Fallback function accepts Ether from generous donators
  function () public payable {
    emit Deposit(msg.sender, msg.value);
  }

  /// @dev function to start a gotchi
  ///   - Check that it doesn't exist
  ///   - Check all starting info is valid
  ///   - Can I check that user is owner of NFT? dynamic delegate call?
  function startNewGotchi(uint256 _gotchiId, address _gotchiContract)
    whenNotPaused
    public {
      require(_gotchiId != 0, 'ID must be specified');

      // Assign starting gotchi data
      uint id = gotchis.push(Tama(msg.sender, _gotchiId, now, now, now, 0, 0, 0, 1)) - 1;
      gotchiHealth.push(Health(1, 2, 1, 1, 0, false, false));

      /// @dev keep track of gotchis...
      gotchiIdOwner[id] = msg.sender;
      gotchiIdUuid[_gotchiId] = id;
      ownerGotchiCount[msg.sender] = ownerGotchiCount[msg.sender].add(1);

      /// @dev tell the world we started a gotchi!
      emit GotchiStarted(msg.sender, _gotchiId, id, _gotchiContract);
    }

  /// @dev function to start a gotchi
  ///   - goal is to use less fees however allowing updates like this is def hackable, but this is not a high value game...
  function updateGotchi(
      uint _gotchiId,
      uint256 _lastSleep,
      uint32 _totalFood,
      uint32 _totalGames,
      uint32 _energy,
      uint32 _fun,
      uint32 _hunger,
      uint32 _hygiene,
      uint32 _poops,
      bool _sleeping
    )
    whenNotPaused
    validGotchiOwner(_gotchiId) public {
      require(_gotchiId != 0, 'ID must be specified');

      // Get original & update
      Tama memory g = gotchis[_gotchiId];
      Health memory h = gotchiHealth[_gotchiId];

      // TODO: Finalize simpler logic
      /* /// @dev Validate the gotchi is alive
      bool _isAlive = GotchiUtils.isGotchiAlive(
        _lastSleep,
        g.lastUpdate,
        _energy,
        _fun,
        _hunger,
        _hygiene,
        _poops
      );
      if (_isAlive == false) {
        emit GotchiDied(_gotchiId);
        return;
      } */

      /// @dev Get gotchi stage by health factors
      uint8 _stage = GotchiUtils.getCurrentStage(
        g.stage,
        h.energy,
        h.fun,
        h.hunger,
        h.hygiene
      );

      /// @dev update gotchi by id
      g.lastUpdate = now;
      g.lastSleep = _lastSleep | now;
      g.totalFood = _totalFood;
      g.totalGames = _totalGames;
      g.stage = _stage;
      h.energy = _energy;
      h.fun = _fun;
      h.hunger = _hunger;
      h.hygiene = _hygiene;
      h.poops = _poops;
      h.sleeping = _sleeping;

      // Update values based on data passed in  
      gotchis[_gotchiId] = g;
      gotchiHealth[_gotchiId] = h;

      /// @dev tell the world gotchi is still alive
      emit GotchiProgress(msg.sender, _gotchiId, g.totalGames, g.totalFood);
    }

  /// @dev function to get all gotchis IDs for an owner
  function getOwnerGotchiIds(address _owner) external view returns(uint[]) {
    uint[] memory result = new uint[](ownerGotchiCount[_owner]);
    uint counter = 0;
    for (uint i = 0; i < gotchis.length; i++) {
      if (gotchiIdOwner[i] == _owner) {
        result[counter] = i;
        counter++;
      }
    }
    return result;
  }

  /// @dev function to get a single gotchi UUID
  function getGotchiUuid(uint _gotchiId)
    external view returns(uint id) {
        uint idx = gotchiIdUuid[_gotchiId];
        return idx;
      }

  /// @dev function to get a single gotchi based on ID
  function getGotchiById(uint256 _gotchiId)
    external view returns(
        address keeper,
        uint256 id,
        uint256 lastSleep,
        uint256 startDate,
        uint32 totalFood,
        uint32 totalGames,
        uint8 stage,
        bool alive
      ) {
        /// @dev get storage instance of gotchi
        Tama memory g = gotchis[_gotchiId];
        Health memory h = gotchiHealth[_gotchiId];

        /// @dev Double check gotchi is still alive
        bool _isAlive = GotchiUtils.isGotchiAlive(
          g.lastSleep,
          g.lastUpdate,
          h.energy,
          h.fun,
          h.hunger,
          h.hygiene,
          h.poops
        );

        /// @dev Get gotchi stage by health factors
        uint8 _stage = GotchiUtils.getCurrentStage(
          g.stage,
          h.energy,
          h.fun,
          h.hunger,
          h.hygiene
        );

        return (
          g.keeper,
          g.id,
          g.lastSleep,
          g.startDate,
          g.totalFood,
          g.totalGames,
          _stage,
          _isAlive
        );
      }

  /// @dev function to get a single gotchi based on ID
  ///   all the health associated, since stack local variables can't be greater than 12
  function getGotchiHealth(uint256 _gotchiId)
    external view returns(
        uint32 energy,
        uint32 fun,
        uint32 hunger,
        uint32 hygiene,
        uint32 poops,
        bool sleeping,
        bool isImmortal
      ) {
        /// @dev get storage instance of gotchi
        Health memory h = gotchiHealth[_gotchiId];
        return (
          h.energy,
          h.fun,
          h.hunger,
          h.hygiene,
          h.poops,
          h.sleeping,
          h.isImmortal
        );
      }

}
