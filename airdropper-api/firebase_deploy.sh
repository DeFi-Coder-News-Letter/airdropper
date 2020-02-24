#!/usr/bin/env bash

cd functions;

npm i;

cd ..;

firebase use erc20-airdropper;
firebase deploy --only functions;

