#!/bin/bash

for dir in */; do
    echo "----------TEST: $dir --------------"
    cd $dir
    npm run test:once
    echo "----------DONE: $dir --------------"
    cd ..
done