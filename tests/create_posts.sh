#!/bin/bash

#$REGEX="\(variant \{ ok = principal "[^"]*" \}\)/

dfx identity use default

cd ..

for i in {1..15}
do
    dfx identity new --disable-encryption test_$i
    dfx identity use test_$i
    dfx canister call gateway grabPortal
done

dfx identity use default

for i in {1..15}
do
    dfx identity remove test_$i
done

cd tests/