#!/bin/bash

BUCKET="throughputdb.com"
npm run build
aws s3 sync ./dist s3://$BUCKET --acl public-read
aws s3 website s3://$BUCKET/ --index-document index.html --error-document error.html
