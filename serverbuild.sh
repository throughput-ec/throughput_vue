#!/bin/bash

git pull
npm update
npm run build
cp -r ./dist/* /app/tpvue/ | chown -R nginx /app/
