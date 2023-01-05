pragma solidity ^0.4.24;

import "zeppelin-solidity/contracts/math/SafeMath.sol";

/**
 * @title GotchiUtils
 * @author Trevor Clarke (github.com/trevorjtclarke)
 * @dev helper functions to keep it DRY up in here!
 */
library GotchiUtils {
  using SafeMath for uint256;

  /**
  * @dev Checks if the gotchi is alive, based on current stage, & health factors
  */
  function isGotchiAlive(
    uint256 _lastSleep,
    uint256 _lastUpdate,
    uint32 _energy,
    uint32 _fun,
    uint32 _hunger,
    uint32 _hygiene,
    uint32 _poops
  ) internal view returns (bool alive) {
    bool _alive = true;

    // sleep greater than 3 days ago
    if (_lastSleep < now - 3 days) _alive = false;

    // poops > 35
    if (_poops > 35) _alive = false;

    // lastUpdate greater than 1 days ago & any of health is < 1
    if (_lastUpdate > now - 2 days) {
      if (_energy < 1) _alive = false;
      if (_fun < 1) _alive = false;
      if (_hunger < 1) _alive = false;
      if (_hygiene < 1) _alive = false;
    }

    return _alive;
  }

  /**
  * @dev returns current stage (uint8) based on health factors
  */
  function getCurrentStage(
    uint8 _current,
    uint32 _energy,
    uint32 _fun,
    uint32 _hunger,
    uint32 _hygiene
  ) internal pure returns (uint8 stage) {
    // TODO: Increase difficulty here, once playtest is done
    // (3 * 4) 3 is the base, 4 is the variable count
    uint256 _expOffset = 12;
    uint256 _stage = uint256(_current);
    uint256 _exponent = _stage.mul(_stage);
    uint256 _multiplier = _exponent.mul(_expOffset);

    /// @dev store all health, calculate percentage
    uint256 _t = 0;
    _t = _t.add(uint256(_energy));
    _t = _t.add(uint256(_fun));
    _t = _t.add(uint256(_hunger));
    _t = _t.add(uint256(_hygiene));

    /// @dev increase stage if percent is full
    if (_t >= _multiplier) _stage = _stage.add(1);

    return uint8(_stage);
  }
}
