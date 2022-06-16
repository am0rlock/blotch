#!/bin/bash

dfx identity use default

cd ..

for i in {1..15}
do
    dfx identity new --disable-encryption test_$i
    dfx identity use test_$i
    RESPONSE=$(dfx canister call gateway grabPortal)
    PRINCIPAL=$(echo $RESPONSE | cut -c28-54)
    dfx canister call $PRINCIPAL setProfile '(record {avatar=(blob "a"); username="user_${i}"; bio="random bio"})'
done

dfx identity use default

for i in {1..15}
do
    dfx identity remove test_$i
done
