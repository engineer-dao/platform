pragma solidity 0.8.10;

import {Ownable} from '@openzeppelin/contracts/access/Ownable.sol';

contract FirewallFactory is Ownable {
    mapping(bytes => bool) public whitelist;

    event NotWhitelisted(bytes code);
    event WhitelistUpdated(bytes _code, bool _value);
    event Deployed(address addr);

    modifier onlyWhitelisted(bytes memory _code) {
        require(_code.length != 0, 'ERROR: no code');

        if (!whitelist[_code]) {
            emit NotWhitelisted(_code);
            revert('Not Whitelisted !');
        }
        _;
    }

    // *many improvements possible - init data for example
    function deploy2(bytes memory _code, uint256 _salt)
    public
    onlyWhitelisted(_code)
    returns (address addr)
    {
        assembly {
            addr := create2(0, add(_code, 0x20), mload(_code), _salt)
        }
        require(addr != address(0), 'Failed on deploy');

        emit Deployed(addr);
        return addr;
    }

    function deploy(bytes memory _code)
    public
    onlyWhitelisted(_code)
    returns (address addr)
    {
        assembly {
            addr := create(0, add(_code, 0x20), mload(_code))
        }
        require(addr != address(0), 'Failed on deploy');

        emit Deployed(addr);
        return addr;
    }

    function updateWhitelist(bytes memory _code, bool _value)
    public
    onlyOwner
    returns (bool)
    {
        whitelist[_code] = _value;
        emit WhitelistUpdated(_code, _value);
        return true;
    }

    fallback() external payable {}

    receive() external payable {}
}
