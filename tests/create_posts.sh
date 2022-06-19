#!/bin/bash

dfx identity use default

cd ..

for i in {1..16}
do
    dfx identity new --disable-encryption test_$i
    dfx identity use test_$i
    RESPONSE=$(dfx canister call gateway grabPortal)
    PRINCIPAL=$(echo $RESPONSE | cut -c28-54)

    AVATAR=$(cat tests/resources/default_profile.blob)
    dfx canister call $PRINCIPAL setProfile '(record {avatar=(blob "'${AVATAR}'"); username="user_'${i}'"; bio="random bio"})'

    MEDIA=$(cat tests/sample_posts/$i.blob)
    DESCRIPTION=$(sed -n "$ip" < tests/sample_posts/descriptions.txt)
    dfx canister call $PRINCIPAL createPost '(record {media=(blob "'${MEDIA}'"); description="'${DESCRIPTION}'"})'

    #for j in {1..11}
    #do
    #    MEDIA=$(cat tests/sample_posts/$j.blob)
    #    DESCRIPTION=$(sed -n "$jp" < tests/sample_posts/descriptions.txt)
    #    dfx canister call $PRINCIPAL createPost '(record {media=(blob "'${MEDIA}'"); description="'${DESCRIPTION}'"})'
    #done
done

for i in {1..16}
do
    dfx identity remove test_$i
done

dfx identity use default
cd tests/
