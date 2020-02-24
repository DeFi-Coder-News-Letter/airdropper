pragma solidity ^0.5.12;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "./AccessControls.sol";

contract CommissionSplitter is AccessControls {
    using SafeMath for uint256;

    address public platform;
    uint256 public platformSplit;

    address public partner;
    uint256 public partnerSplit;

    constructor(AccessWhitelist _accessWhitelist, address _platform, uint256 _platformSplit, address _partner, uint256 _partnerSplit)
        AccessControls(_accessWhitelist) public {
        require(_platformSplit.add(_partnerSplit) == 100, "Split percentages are not setup correctly");
        platform = _platform;
        platformSplit = _platformSplit;
        partner = _partner;
        partnerSplit = _partnerSplit;
    }

    function () external payable {
        uint256 singleUnitOfValue = msg.value.div(100);

        uint256 amountToSendPlatform = singleUnitOfValue.mul(platformSplit);
        (bool platformSuccess,) = platform.call.value(amountToSendPlatform)("");
        require(platformSuccess, "Failed to send split to platform");

        uint256 amountToSendPartner = singleUnitOfValue.mul(partnerSplit);
        (bool partnerSuccess,) = partner.call.value(amountToSendPartner)("");
        require(partnerSuccess, "Failed to send split to partner");
    }

    function updatePlatform(address _platform) external onlyWhitelisted {
        platform = _platform;
    }

    function updatePartner(address _partner) external onlyWhitelisted {
        partner = _partner;
    }

    function updateSplit(uint256 _platformSplit, uint256 _partnerSplit) external onlyWhitelisted {
        require(_platformSplit.add(_partnerSplit) == 100, "Split percentages are not setup correctly");
        platformSplit = _platformSplit;
        partnerSplit = _partnerSplit;
    }
}