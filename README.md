# Inverted-index
[![Coverage Status](https://coveralls.io/repos/github/xmile1/checkpoint1-inverted-index/badge.svg?branch=develop)](https://coveralls.io/github/xmile1/checkpoint1-inverted-index?branch=master)
![](https://travis-ci.org/xmile1/checkpoint1-inverted-index.svg?branch=develop)
[![Code Climate](https://codeclimate.com/repos/5835bf25362f3962b1000523/badges/eac0c7f614cf105ca599/gpa.svg)](https://codeclimate.com/repos/5835bf25362f3962b1000523/feed)

In computer science, an inverted index (also referred to as postings file or inverted file) is an index data structure storing a mapping from content, such as words or numbers, to its locations in a database file, or in a document or a set of documents.

Common Uses: Inverted indices have found use in the design of Search Engines, Sequence Assembly of DNA and Library, Mainframe and Database management.

## Features of the application
- Single or multiple upload of valid a json file
- Create an index to the words in the file and their location
- Delete created index
- Search single or all indexed files for their location and content

## How to Install

1.  Clone the repository `git clone https://github.com/xmile1/checkpoint1-inverted-index.git`
2.  Move into the repository directory `cd checkpoint1-inverted-index`
3.  Run npm install to install all the dependencies. The application is build on [Nodejs](nodejs.org) `npm install`

    ### Dependencies
    - gulp
    - coveralls (test coverage reporting)
    - karma (test)
    - eslint (code style)

4.  Start the application by executing the command below `npm start`
5.  To run tests, you can run the command below `npm test`


## How to Use
1. Upload valid json files you need to search from in the format below
2. create index of the uploaded file
2. enter your search term to search for a word
