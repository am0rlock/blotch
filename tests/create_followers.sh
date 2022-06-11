#!/bin/bash

dfx identity use default

cd ..

for i in {1..15}
do
    dfx identity new --disable-encryption test_$i
    dfx identity use test_$i
    RESPONSE=$(dfx canister call gateway grabPortal)
    PRINCIPAL=$(echo $RESPONSE | cut -c28-54)
    for j in {1..10}
    do
        dfx canister call $PRINCIPAL createPost '(record {words="random"})'
    done
done

dfx identity use default

for i in {1..15}
do
    dfx identity remove test_$i
done

cd tests/
