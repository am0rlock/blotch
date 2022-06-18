#!/bin/bash

dfx identity use default

for i in {1..25}
do
    dfx identity remove test_$i
done
