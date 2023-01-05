# Avoiding Common Attacks
Compared to other environments, Solidity is highly visible and accessible to attackers and mistake execution. For this and many other reasons, it is critical to keep a close watch on security. The following are security attacks that have been addressed and covered within Gotchi.

## Miner Vulnerabilities
Gotchi does not utilize timestamp or block information.

## `tx.origin` Problem
Gotchi does not utilize `tx.origin`.

## Gas Limit
Gas limit issues were difficult to overcome, however Gotchi:
* Keeps loops to minimal scope based in mappings
* No strings are stored/used in any contracts.

## Recursive Calls
Gotchi does not utilize recursive calls.

## Exposed Secrets
Gotchi does not utilize or require any secret information.

## Logic Bugs
All major logic has been built to be heavily client side, thus:
* Gotchi is mainly used as a checkpoint & store of data
* Gotchi logic uses SafeMath for all math operations
* Truffle tests cover all contracts & execute majority of use cases
* Follow best practices in software development
* Apply Solidity and Consensys known attack principles

## Integer Arithmetic Overflow
* Gotchi logic uses SafeMath for all math operations

## Malicous Data
Gotchi data is either timestamps stored as uint, booleans, or uint for snapshot data. This keeps all logic within bounds since it is wrapped by SafeMath library.

## Exposed Functions
Public facing/executable code utilizes contract owner validation or does not allow state mutation.
