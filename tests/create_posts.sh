#!/bin/bash

dfx identity use default

cd ..

for i in {1..11}
do
    dfx identity new --disable-encryption test_$i
    dfx identity use test_$i
    RESPONSE=$(dfx canister call gateway grabPortal)
    PRINCIPAL=$(echo $RESPONSE | cut -c28-54)

    MEDIA=$(cat tests/sample_posts/$j.blob)
    DESCRIPTION=$(sed -n "$jp" < tests/sample_posts/descriptions.txt)
    dfx canister call $PRINCIPAL createPost '(record {media=(blob "'${MEDIA}'"); description="'${DESCRIPTION}'"})'

    #for j in {1..11}
    #do
    #    MEDIA=$(cat tests/sample_posts/$j.blob)
    #    DESCRIPTION=$(sed -n "$jp" < tests/sample_posts/descriptions.txt)
    #    dfx canister call $PRINCIPAL createPost '(record {media=(blob "'${MEDIA}'"); description="'${DESCRIPTION}'"})'
    #done
done

for i in {1..15}
do
    dfx identity remove test_$i
done

dfx identity use default
cd tests/
