[![lifecycle](https://img.shields.io/badge/lifecycle-experimental-orange.svg)](https://www.tidyverse.org/lifecycle/#experimental)
[![NSF-1928366](https://img.shields.io/badge/NSF-1928366-blue.svg)](https://nsf.gov/awardsearch/showAward?AWD_ID=1928366)

# Throughput Annotation Vue.js Application

This application connects to the Throughput annotation graph database.  The database itself uses a data model based on the [W3C Annotation standard](), although modified to fit the graph database model we have developed, and further modified for several use-cases to fit with unser interaction models.

## Contributors

This project is an open project, and contributiosn are welcome from anyone.  All contributors to this project are bound by a [code of conduct](CODE_OF_CONDUCT.md).  Please review and follow this code of conduct as part of your contribution.

  * [Simon Goring](http://goring.org) [![orcid](https://img.shields.io/badge/orcid-0000--0002--2700--4605-brightgreen.svg)](https://orcid.org/0000-0002-2700-4605)

All products of the Throughput Annotation Project are licensed under and [MIT License](LICENSE.md) unless otherwise noted.

## Project Components

This respository uses a Vue.js application to serve a static website with integrations for [the Throughput API](http://throughputdb.com/api-docs).

### Requirements

This project requires the user to have `node.js` and `npm` installed on their local system.  [`node.js` downloads](https://nodejs.org/en/download/) are available for multiple systems.

## Project Setup

To initialize the project on your local computer (or on a remote server) first clone this repository to your machine.  Then run the command:

```bash
npm install
```

to install all required packages.  Note that the user also requires a file called `.env` to be added to the local directory.  This can be done using:

```bash
echo "VUE_APP_URLPATH=http://throughputdb.com/api > .env"
```

### Update App Settings
Change `settings.sample.js` to `settings.js` and set the variables contained in the file. 


### Compiles and hot-reloads for development

During local development of the website it is useful to monitor the effect of changes locally.

```
npm run serve
```

Creates a local version of the website at `localhost:8080`.

### Compiles and minifies for production

This can be run to serve the vuejs webpage as a static "[single page application](https://en.wikipedia.org/wiki/Single-page_application)".

```
npm run build
```

Once the script has been run the pages to serve the website are placed in the `./dist` folder.

### Run your tests

```
npm run test
```

### Lints and fixes files

[`Lint`](https://en.wikipedia.org/wiki/Lint_(software))ing is a useful tool for software development to help ensure that code style is standardized, making it easier to detect code errors.

```
npm run lint
```
