pragma solidity ^0.5.12;

import "./AccessWhitelist.sol";

contract AccessControls {
    AccessWhitelist public accessWhitelist;

    constructor(AccessWhitelist _accessWhitelist) internal {
        accessWhitelist = _accessWhitelist;
    }

    modifier onlyWhitelisted() {
        require(accessWhitelist.isWhitelisted(msg.sender), "Caller not whitelisted");
        _;
    }

    modifier onlyWhitelistAdmin() {
        require(accessWhitelist.isWhitelistAdmin(msg.sender), "Caller not whitelist admin");
        _;
    }

    function updateAccessWhitelist(AccessWhitelist _accessWhitelist) external onlyWhitelistAdmin {
        accessWhitelist = _accessWhitelist;
    }
}