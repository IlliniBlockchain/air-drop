// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 * @title AirDrop
 * @dev Send ether and distribute it to addresses
 */
contract AirDrop {
    
    // Distrbute eth in certain amounts to a set of addresses
    function airDropAmounts(address payable[] memory _addrs, uint[] memory _amnts) public payable {
        require(_addrs.length == _amnts.length);
        uint n = _addrs.length;
        uint totalAmnts = 0;
        for (uint i = 0; i < n; i++) {
            totalAmnts += _amnts[i];
        }
        // Ensure no leftover eth
        require(msg.value == totalAmnts);
        uint remainEth = totalAmnts;
        for (uint i = 0; i < n; i++) {
            _addrs[i].transfer(_amnts[i]);
            remainEth -= _amnts[i];
        }
    }

    // Distribute eth equally to a set of addresses
    function airDrop(address payable[] memory _addrs) public payable {
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