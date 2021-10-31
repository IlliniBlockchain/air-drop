// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 * @title AirDrop
 * @dev Send ether and distribute it to addresses
 */
contract AirDrop {
    
    mapping (address => bool) public ApprovedAddresses;
    
    constructor(address originalApproved) {
        setApproved(originalApproved);
    }
    
    function getApproved(address _addr) public view returns (bool) {
        return ApprovedAddresses[_addr];
    }

    function setApproved(address _addr) public {
        ApprovedAddresses[_addr] = true;
    }
    
    // Allow depositing eth
    receive() external payable {}
    fallback() external payable {}
    
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    // distribute eth to set of addresses
    function airDrop(address payable[] memory _addrs) public payable {
        require(ApprovedAddresses[msg.sender]); // only ApprovedAddresses can call this function
        uint nAddrs = _addrs.length;
        uint totalEth = msg.value;
        uint eachEth = totalEth / nAddrs;
        uint remainEth = totalEth;
        for (uint i = 0; i < nAddrs - 1; i += 1) {
            _addrs[i].transfer(eachEth);
            remainEth -= eachEth;
        }
        _addrs[nAddrs - 1].transfer(remainEth);
    }
}