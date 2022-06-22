#!/bin/bash

USERNAMES=('trumpetred' 'pioneer10pelican' 'rearwindowpig' 'n0tn')
BIOS=("Excited to join the next wave of social media!" "IDK yet lol" "OG Blotch supporter" "Ssssh!")

dfx identity use default

cd ..

for i in {0..3}
do
    dfx identity new --disable-encryption ${USERNAMES[$i]}
    dfx identity use ${USERNAMES[$i]}
    RESPONSE=$(dfx canister call gateway grabPortal)
    PRINCIPAL=$(echo $RESPONSE | cut -c28-54)

    AVATAR=$(cat tests/for_demo_resources/${USERNAMES[$i]}.blob)
    dfx canister call $PRINCIPAL setProfile '(record {avatar=(blob "'${AVATAR}'"); username="'${USERNAMES[$i]}'"; bio="Hey Im new to blotch"})'
done

dfx identity use default

for i in {0..3}
do
    dfx identity remove ${USERNAMES[$i]}
done

cd tests/
