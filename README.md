# crocodoc-node

Node.js client library for Crocodoc API v2

This software is released under the MIT license. See `LICENSE.md` for more details.

## Release Status

* Latest: **1.0.0**

Release Notes, Issues & Roadmap: `RELEASE_NOTES.md`

## Download and Installation

From the command-line:

    $ npm install crocodoc-node

package.json:

    ...
    dependencies: {
      ...
      "crocodoc-node": "*$version*",
      ...
    }
    ...

### For contributors

  See *Contributing* section below

## Example use

The examples below are not intended to replace a working knowledge of the [Crocodoc API](https://crocodoc.com/docs/api/),
nor do they cover all possible uses and responses of the crocodoc-node client library.

They cover the main uses, assuming no errors.

More detailed descriptions of the client library behaviours, including errors, can be found in `test-results\*.txt`.
These files were generated from the mocha test suite with the spec reporter.

### DocumentAPI

    var documentApi = new require('crocodoc-node').CrocodocAPI('API_TOKEN').documentAPI;

#### Uploading a local file to Crocodoc

    documentApi.uploadFile(pathToSupportedFile, function(error, response, body) {
      console.log('error should be falsey: ', error);
      console.log('response.statusCode should be 200: ', response.statusCode);
      console.log('body.uuid should be a non-empty string: ', body.uuid);
    });

#### Uploading a URL to Crocodoc

    documentApi.uploadUrl('http://web.crocodoc.com/files/test-simple.pdf', function(error, response, body) {
      console.log('error should be falsey: ', error);
      console.log('response.statusCode should be 200: ', response.statusCode);
      console.log('body.uuid should be a non-empty string: ', body.uuid);
    });

#### Getting an uploaded document's status

For a single document:

    documentApi.status(docUuid, function(error, response, body) {
      console.log('error should be falsey: ', error);
      console.log('response.statusCode should be 200: ', response.statusCode);
      console.log('body should be an array containing a single status', body);
    });

OR for multiple documents:

    documentApi.status([docUuid1, docUuid2, ...] , function(error, response, body) {
      console.log('error should be falsey: ', error);
      console.log('response.statusCode should be 200: ', response.statusCode);
      console.log('body should be an array containing a single status', body);
    });

#### Deleting an uploaded document

    documentApi.remove(docUuid, function(error, response, body) {
      console.log('error should be falsey: ', error);
      console.log('response.statusCode should be 200: ', response.statusCode);
      console.log('body should be true', body);
    });

#### Poll for completion

This is additional to the Crocodoc API, and is provided as a helper.

    documentApi.poll(docUuid, function(error, response, body) {
      console.log('error should be falsey: ', error);
      console.log('response.statusCode should be 200: ', response.statusCode);
      console.log('body should be a single status', body);
    });

The callback will not be invoked until the document has finished converting (or the conversion has failed).
The body contains the retrieved document status indicating conversion completion or failure.

### SessionAPI

    var sessionApi = new require('crocodoc-node').CrocodocAPI('API_TOKEN').sessionAPI;

#### Creating a new session

With supplied [session options](https://crocodoc.com/docs/api/#session-create):

    sessionApi.create(docUuid, {editable:false, downloadable: true}, function(error, response, body) {
      console.log('error should be falsey: ', error);
      console.log('response.statusCode should be 200: ', response.statusCode);
      console.log('body.session should be a non-empty string', body.session);
    });

With default session options:

    sessionApi.create(docUuid, function(error, response, body) {
      console.log('error should be falsey: ', error);
      console.log('response.statusCode should be 200: ', response.statusCode);
      console.log('body.session should be a non-empty string', body.session);
    });

### DownloadAPI

    var fs = require('fs');
    var downloadApi = new require('crocodoc-node').CrocodocAPI('API_TOKEN').downloadAPI;

#### Downloading the original document

    downloadApi.document(docUuid, fs.createWriteStream('filePath.orig'), function(error, response, body) {
      console.log('error should be falsey: ', error);
      console.log('response.statusCode should be 200: ', response.statusCode);
      console.log('body.uuid should be a non-empty string', body.uuid);
    });

#### Downloading the document as a PDF

    downloadApi.document(docUuid, {pdf: true}, fs.createWriteStream('filePath.pdf'), function(error, response, body) {
      console.log('error should be falsey: ', error);
      console.log('response.statusCode should be 200: ', response.statusCode);
      console.log('body.uuid should be a non-empty string', body.uuid);
    });

#### Downloading the document's thumbnail

    downloadApi.thumbnail(docUuid, '150x150', fs.createWriteStream('filePath.png'), function(error, response, body) {
      console.log('error should be falsey: ', error);
      console.log('response.statusCode should be 200: ', response.statusCode);
      console.log('body.uuid should be a non-empty string', body.uuid);
    });

#### Downloading the extracted text for a document

    downloadApi.text(docUuid,  fs.createWriteStream('filePath.txt'), function(error, response, body) {
      console.log('error should be falsey: ', error);
      console.log('response.statusCode should be 200: ', response.statusCode);
      console.log('body.uuid should be a non-empty string', body.uuid);
    });

## Bug reports

https://github.com/NetDevLtd/crocodoc-node/issues

## Contributing

Fork from: https://github.com/NetDevLtd/crocodoc-node

All contributions and constructive suggestions are welcome.

### Set-up

Once you've cloned your fork to a local repo, to install all the dependencies, run:

    $ make install

You can then run `make lint` and `make test`, to de-lint and run the tests, respectively.

In order to run the tests, you will need to configure the test framework with your Crocodoc API token:

edit `test/framework/crocodoc-details.js`, and change `DUMMY-TOKEN` to your API token.

If you don't do this, many of the tests will fail!

To make git stop tracking changes to this file, so that your sensitive API token doesn't get accidentally committed:

    $ git update-index --assume-unchanged test/framework/crocodoc-details.js

You can still explicitly `git add` it, or if you want to turn tracking on again:

    $ git update-index --no-assume-unchanged test/framework/crocodoc-details.js

These instructions are duplicated in the file.

### Pull requests

Please ensure that Pull Requests:

* are lint-free: `make lint`, with an unmodified `jshint.json`
* include new / modified mocha tests: these should be in `test/spec`
* pass all tests: `make test` reports no errors.

