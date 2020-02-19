#!/bin/bash

cd ./data
echo "running backup current time:"
date
echo "pushing...."
git push origin master
echo "pushed"
cd ..
