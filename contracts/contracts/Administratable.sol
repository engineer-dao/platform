// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

abstract contract Administratable {

    address private _admin;

    modifier onlyAdmin() {
        require(admin() == msg.sender, "Caller is not the admin");
        _;
    }

    function admin() public view virtual returns (address) {
        return _admin;
    }

    function transferAdmin(address newAdmin) public virtual onlyAdmin {
        initializeAdmin(newAdmin);
    }

    function initializeAdmin(address newAdmin) internal {
        require(newAdmin != address(0), "new admin is the zero address");
        _admin = newAdmin;
    }

}