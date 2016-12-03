'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var utils = require('./utils.js');

/**
 * A class for Creating and searching an inverted index
 */

var Index = function () {

  /**
   * [constructor Creates Object variables to hold
   * 1. [jsonDatabase] Uploaded files
   * 2. [indexFile] the indexed filenames and their contents
   * 3. [searchResult] the search results
   */
  function Index() {
    _classCallCheck(this, Index);

    this.jsonDatabase = {};
    this.indexFile = {};
    this.searchResult = {};
    this.indexView = '';
  }

  /**
   * [saveUploads creates a key and value object item that stores the uploaded file(s)]
   * @param  {string} fileName [filename]
   * @param  {object} jsonFile [content of uploaded json file]
   * @return {boolean} [returns true on succesful addition of object to datatbase]
   */


  _createClass(Index, [{
    key: 'saveUploads',
    value: function saveUploads(fileName, jsonFile) {
      var _this = this;

      if (!utils.isValid(fileName, jsonFile)) {
        return false;
      }
      if (typeof jsonFile === 'string') {
        jsonFile = JSON.parse(jsonFile);
      }
      this.jsonDatabase[fileName] = [];
      Object.keys(jsonFile).forEach(function (keys) {
        _this.jsonDatabase[fileName].push(jsonFile[keys]);
      });
      return true;
    }

    /**
     * [getJsonDatabase function to return the saved uploads]
     * @return {object} [the saved uploads]
     */

  }, {
    key: 'getJsonDatabase',
    value: function getJsonDatabase() {
      return this.jsonDatabase;
    }

    /**
     * [createIndex Creates an index of the words in the received json file]
     * @param  {string}   filePath [the key(filename) of the json value to index]
     * @param  {Function} cb  [call back to return the indexed file object/an html format index table]
     * @return {array} [an arrray of the indexed file result and the html Div of the index]
     */

  }, {
    key: 'createIndex',
    value: function createIndex(filePath) {
      var indexFile = this.indexFile;
      var jsonDoc = this.jsonDatabase[filePath];
      var joinedValues = '';
      var wordArray = [];
      if (indexFile[filePath]) {
        return false;
      }
      indexFile[filePath] = {};
      jsonDoc.forEach(function (element, index) {
        joinedValues = utils.cleanString(element.title + ' ' + element.text);
        wordArray = new Set(joinedValues.split(' '));
        wordArray.forEach(function (word) {
          indexFile[filePath][word] = indexFile[filePath][word] || [];
          indexFile[filePath][word].push(index);
        });
      });
      this.indexFile = indexFile;
      return indexFile[filePath];
    }

    /**
     * [getIndex Gets the index object of the indexed json file]
     * @param  {string} fileName [the filename(key) of the index needed]
     * @return {object}          [index of the object]
     */

  }, {
    key: 'getIndex',
    value: function getIndex(fileName) {
      return this.indexFile[fileName] || this.indexFile;
    }

    /**
     * [searchIndex It searches the already indexed files for particular words]
     * @param  {string}    fileNames     [description]
     * @param  {Function}  cb            [description]
     * @param  {...Array} searchContent [the words to search for]
     * @return {Array}                  [an array of two elements, an
     * object with the search term as key and their locations in the
     * array of the originally uploaded file, an html view of the result]
     */

  }, {
    key: 'searchIndex',
    value: function searchIndex(fileNames) {
      var _this2 = this;

      var searchResult = {};

      for (var _len = arguments.length, searchContent = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        searchContent[_key - 1] = arguments[_key];
      }

      var searchTerms = searchContent.join(' ');
      if (fileNames.length < 1) {
        fileNames = this.getFilenames();
      }
      searchTerms = utils.cleanString(searchTerms, /[^a-z0-9\s,]+/gi);
      searchTerms = searchTerms.split(/[,\s]/);
      searchTerms.forEach(function (searchTerm) {
        searchResult[searchTerm] = {};
        fileNames.forEach(function (fileName) {
          if (_this2.indexFile[fileName][searchTerm]) {
            searchResult[searchTerm][fileName] = _this2.indexFile[fileName][searchTerm];
          }
        });
      });
      this.searchResult = searchResult;
      return searchResult;
      // return cb(searchResult, this.jsonDatabase);
    }

    /**
     * [getFilenames returns the filenames of all files present in the object]
     * @return {array} [an array of filenames]
     */

  }, {
    key: 'getFilenames',
    value: function getFilenames() {
      return Object.keys(this.jsonDatabase);
    }

    /**
     * [deleteIndex Deletes an index file from the index object]
     * @param  {string} fileName [the filename(key) of the data to delete]
     * @param  {boolean} option   [determines if to delete the index only or also the json file]
     * @return {boolean}  [true to delete indexFile and jsonDatabase/false to delete only the index]
     */

  }, {
    key: 'deleteIndex',
    value: function deleteIndex(fileName, option) {
      delete this.indexFile[fileName];
      if (option === true) {
        delete this.jsonDatabase[fileName];
        return true;
      }
      return false;
    }
  }]);

  return Index;
}();

module.exports = Index;