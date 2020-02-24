pragma solidity ^0.5.12;

import "@openzeppelin/contracts/access/roles/WhitelistedRole.sol";

contract AccessWhitelist is WhitelistedRole {
    constructor() public {
        super.addWhitelisted(msg.sender);
    }
}