#!/usr/bin/env bash

node ./node_modules/.bin/truffle-flattener ./contracts/ERC20Airdropper.sol > ./flat/ERC20Airdropper.sol;

node ./node_modules/.bin/truffle-flattener ./contracts/mocks/TestToken.sol > ./flat/TestToken.sol;
