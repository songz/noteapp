#!/bin/bash

cd ./data
echo "current folder"
pwd
echo "running backup current time:"
date
echo "pushing...."
git push origin master
echo "pushed"
cd ..
