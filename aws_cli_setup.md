## Setting up an Application with Amazon AWS and Google Domains

This short document explains how I set up the Annotation Front-end for the ESIP Winter Meeting.  The application has four main components:

1.  An application front-end developed using Vue.js
2.  A graph database powered by neo4j
3.  An API (node.js/express) managing interactions between the database and the application.
4.  A domain (`throughputdb.com`) that will redirect to services as needed.

`neo4j` is a graph database that can be served from cloud services, such as Amazon's Web Services (AWS). The same server that hosts the database can also be used to host the API.  These services would be hosted on an Elastic Compute (EC2) instance, basically a virtual computer.  The Vue.js framework allows individuals to generate webpages that can be hosted as stand-alone pages, and so these can be stored using Amazon's Simple Cloud Storage Service (S3).

AWS can provide public access to data stored in the S3 "buckets", and to data served through EC2, so these can be served to users on the web.  The challenge is that the URLs provided are not always as nice and neat as we'd like them to be.  To manage this we can purchase a domain for our application.  In my case this was done through Google Domains.

So, the workflow is that a user will access the webpage by navigating to `throughputdb.com` or `www.throughputdb.com`, the domain will redirect them to the S3 bucket hosting the website.  The user will interact with a form on the website and hit **Submit**.  The form submission will trigger a call to the API, this will then interact with the database, and return a value to the user through the website.

### What you need to follow this tutorial

This documentation is written mostly for myself, and focuses only on setting up the S3 buckets for the Vue.js application, and their link to the Google domain.  This assumes there is an existing Vuejs project (mine can be cloned from the [throughput_vue GitHub repository](https://github.com/throughput-ec/throughput_vue)) and that Vue.js (and associated node.js installations) are already set up.  This also assumes you have a current installation of Python 3.

This documentation will take you through:

1.  Installing the AWS commandline program.
2.  Creating an S3 bucket for the website.
3.  Uploading content to the S3 bucket.
4.  Linking the bucket to the Google Domain (`throughputdb.com`).
5.  Ensuring that both `www.throughputdb.com` and the naked domain (`throughputdb.com`) redirect to the same application page.

### Setting up the `aws` commandline program

In Ubuntu we often use `apt` to install applications, however, the `apt` version of `awscli` appears to have some issues related to versions of the packages in the current version of Ubuntu.  To install the command line interface (cli) we need to use the Python version.  We can [install `awscli` using `pip3`](https://docs.aws.amazon.com/cli/latest/userguide/install-linux.html):

```
pip3 install awscli --upgrade --user
```

Once the application is installed using pip3 we need to add the path to the `awscli` program (location can be found using `which aws`) to the server's `PATH`:

```
export PATH="/home/simon/.local/bin/aws:$PATH"
```

Once the application is placed into the `PATH` we can start running the cli to walk through our setup.  The first step is configuring our commandline parameters using [`aws configure`](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html) so that the AWS servers know who we are when we send commands to AWS using the CLI.

To be able to configure access you need to create a user in the [IAM Management Console](https://docs.aws.amazon.com/IAM/latest/UserGuide/getting-started_create-admin-group.html).  I created a user called `Administrator` and added both *Billing* and *AdministratorAccess* permissions.  **BE AWARE**: Following this tutorial sets up applications and services that will potentially cost you money.

Following the guide linked above we can obtain an access key and secret key from the IAM panel for the Administrator, which we then enter when prompted to by the command `aws configure`:

```
$ aws configure
AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
Default region name [None]: us-west-2
Default output format [None]: json
```

Once the configuration is set up, we can test to make sure that everything is set up properly.  We can check that using:

```
$ aws ec2 describe-regions --output table

----------------------------------------------------------
|                     DescribeRegions                    |
+--------------------------------------------------------+
||                        Regions                       ||
|+-----------------------------------+------------------+|
||             Endpoint              |   RegionName     ||
|+-----------------------------------+------------------+|
||  ec2.ap-south-1.amazonaws.com     |  ap-south-1      ||
||  ec2.eu-west-3.amazonaws.com      |  eu-west-3       ||
||  ec2.eu-north-1.amazonaws.com     |  eu-north-1      ||
||  ec2.eu-west-2.amazonaws.com      |  eu-west-2       ||
||  ec2.eu-west-1.amazonaws.com      |  eu-west-1       ||
||  ec2.ap-northeast-2.amazonaws.com |  ap-northeast-2  ||
...

```

Getting output should indicate that the `aws` cli is accessing the AWS servers and that they are returning data as expected.

### Setting up S3 Buckets

We're going to take the files from our Vuejs application and put them into an S3 bucket.  To do that we need to (1) create a bucket, (2) set its permissions and (3) put our data into the bucket.

#### Creating an S3 Bucket

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

#### Setting Bucket Permissions for Public Access

We need to make sure the policies for the bucket are set so that it allows public access:

```
aws s3api put-bucket-policy --bucket throughputdb.com --policy '{"Version":"2012-10-17", "Statement":[{"Sid":"PublicReadGetObject","Effect":"Allow", "Principal": "*","Action":["s3:GetObject"],"Resource":["arn:aws:s3:::throughputdb.com/*"]}]}'
```

Then to set it up for static website delivery:

```
aws s3 website s3://throughputdb.com/ --index-document index.html --error-document error.html
```

If you are using the bucket as a static website then the website's URL changes to: `http://**$BUCKET**.s3-website-us-west-2.amazonaws.com/` where `$BUCKET` is the bucket name (e.g. `throughputdb.com`).  If you use the original URL provided above you will get an `AccessDenied` message scripted in an XML document.

#### Uploading Content

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
