## Hosting Application on S3

The application is intended to be hosted as part of an s3 bucket.

Based on the instructions from AWS we initiate two S3 bucket using the AWS CLI:

```
aws s3api create-bucket --bucket throughputdb.com --region us-west-2 --create-bucket-configuration LocationConstraint=us-west-2
```

This returns:

```
{
    "Location": "http://throughputdb.com.s3.amazonaws.com/"
}
```

We also need to make sure the policies for the bucket are set so that it allows public access:

```
aws s3api put-bucket-policy --bucket throughputdb.com --policy '{"Version":"2012-10-17", "Statement":[{"Sid":"PublicReadGetObject","Effect":"Allow", "Principal": "*","Action":["s3:GetObject"],"Resource":["arn:aws:s3:::throughputdb.com/*"]}]}'
```

Then to set it up for static website delivery:

```
aws s3 website s3://throughputdb.com/ --index-document index.html --error-document error.html
```

If you are using the bucket as a static website then the website's URL changes to: `http://**$BUCKET**.s3-website-us-west-2.amazonaws.com/` where `$BUCKET` is the bucket name (e.g. `throughputdb.com`).  If you use the original URL provided above you will get an `AccessDenied` message scripted in an XML document.

## Uploading Content

Once the bucket is set up we can then make sure we upload everything to it.  To do this I've written a short bash script that will build the Vue.js app and then sync it with the S3 bucket:

```
#!/bin/bash

BUCKET="throughputdb.com"
npm run build
aws s3 sync ./dist s3://$BUCKET --acl public-read
aws s3 website s3://$BUCKET/ --index-document index.html --error-document error.html
```

All our files are now in the bucket and we can navigate to the (inelegant) URL using the modified S3 URL described above.

## Setting the Alias

Amazon's Route 53 provides web redirection and DNS services for applications.  This will provide a stable IP address for our S3 bucket, and allow us to link to the host domain `throughputdb.com` that has already been registered.

Using Route 53 we then create Amazon-specific Name Servers and then set the Custom Name Servers for our Google Domain.
