#!/bin/bash

USERNAMES=('trumpetred' 'pioneer10pelican' 'rearwindowpig' 'n0tn')
BIOS=("Excited to join the next wave of social media!" "IDK yet lol" "OG Blotch supporter" "Ssssh!")

dfx identity use default

cd ..

for i in {0..3}
do
    dfx identity new --disable-encryption ${USERNAMES[$i]}
    dfx identity use ${USERNAMES[$i]}
    RESPONSE=$(dfx canister --network ic call gfjgu-biaaa-aaaam-qaq5a-cai grabPortal)
    PRINCIPAL=$(echo $RESPONSE | cut -c28-54)

    AVATAR=$(cat tests/for_demo_resources/${USERNAMES[$i]}.blob)
    dfx canister --network ic call $PRINCIPAL setProfile '(record {avatar=(blob "'${AVATAR}'"); username="'${USERNAMES[$i]}'"; bio="Hey Im new to blotch"})'
done

dfx identity use default

cd tests/
