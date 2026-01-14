// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BlockVerifier {
    function getBlockNumber() external view returns (uint256) {
        return block.number;
    }
}
