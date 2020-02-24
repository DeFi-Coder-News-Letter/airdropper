pragma solidity ^0.5.5;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./AccessControls.sol";
import "./CommissionSplitter.sol";

contract ERC20Airdropper is AccessControls {
    using SafeMath for uint256;

    event Transfer(
        address indexed _token,
        address indexed _caller,
        uint256 _recipientCount,
        uint256 _totalTokensSent
    );

    event PricePerTxChanged(
        address indexed _caller,
        uint256 _oldPrice,
        uint256 _newPrice
    );

    event EtherMoved(
        address indexed _caller,
        address indexed _to,
        uint256 _amount
    );

    event TokensMoved(
        address indexed _caller,
        address indexed _to,
        uint256 _amount
    );

    event CreditsAdded(
        address indexed _caller,
        address indexed _to,
        uint256 _amount
    );

    event CreditsRemoved(
        address indexed _caller,
        address indexed _to,
        uint256 _amount
    );

    mapping(address => uint256) public credits;

    uint256 public pricePerTx = 0.01 ether;

    CommissionSplitter public splitter;

    constructor(AccessWhitelist _accessWhitelist, CommissionSplitter _splitter)
        AccessControls(_accessWhitelist) public {
        splitter = _splitter;
    }

    // @notice will receive any eth sent to the contract
    function () external payable {}

    function transfer(address _token, address[] calldata _addresses, uint256[] calldata _values) payable external returns (bool) {
        require(_addresses.length == _values.length, "Address array and values array must be same length");

        require(credits[msg.sender] > 0 || msg.value >= pricePerTx, "Must have credit or min value");

        uint256 totalTokensSent;
        for (uint i = 0; i < _addresses.length; i += 1) {
            require(_addresses[i] != address(0), "Address invalid");
            require(_values[i] > 0, "Value invalid");

            IERC20(_token).transferFrom(msg.sender, _addresses[i], _values[i]);
            totalTokensSent = totalTokensSent.add(_values[i]);
        }

        if (msg.value == 0 && credits[msg.sender] > 0) {
            credits[msg.sender] = credits[msg.sender].sub(1);
        } else {
            (bool splitterSuccess,) = address(splitter).call.value(msg.value)("");
            require(splitterSuccess, "Failed to transfer to the commission splitter");
        }

        emit Transfer(_token, msg.sender, _addresses.length, totalTokensSent);

        return true;
    }

    function moveEther(address payable _account) onlyWhitelistAdmin external returns (bool)  {
        uint256 contractBalance = address(this).balance;
        _account.transfer(contractBalance);
        emit EtherMoved(msg.sender, _account, contractBalance);
        return true;
    }

    function moveTokens(address _token, address _account) external onlyWhitelistAdmin returns (bool) {
        uint256 contractTokenBalance = IERC20(_token).balanceOf(address(this));
        IERC20(_token).transfer(_account, contractTokenBalance);
        emit TokensMoved(msg.sender, _account, contractTokenBalance);
        return true;
    }

    function addCredit(address _to, uint256 _amount) external onlyWhitelisted returns (bool) {
        credits[_to] = credits[_to].add(_amount);
        emit CreditsAdded(msg.sender, _to, _amount);
        return true;
    }

    function reduceCredit(address _to, uint256 _amount) external onlyWhitelisted returns (bool) {
        credits[_to] = credits[_to].sub(_amount);
        emit CreditsRemoved(msg.sender, _to, _amount);
        return true;
    }

    function setPricePerTx(uint256 _pricePerTx) external onlyWhitelisted returns (bool) {
        uint256 oldPrice = pricePerTx;
        pricePerTx = _pricePerTx;
        emit PricePerTxChanged(msg.sender, oldPrice, pricePerTx);
        return true;
    }

    function creditsOfOwner(address _owner) external view returns (uint256) {
        return credits[_owner];
    }

    function updateCommissionSplitter(CommissionSplitter _splitter) external onlyWhitelistAdmin {
        splitter = _splitter;
    }
}
