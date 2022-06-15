#!/bin/bash

dfx identity use default

cd ..

for i in {1..15}
do
    dfx identity new --disable-encryption test_$i
    dfx identity use test_$i
    RESPONSE=$(dfx canister call gateway grabPortal)
    PRINCIPAL=$(echo $RESPONSE | cut -c28-54)
done

dfx identity use default
cd tests/
