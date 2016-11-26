'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var util = new require('./utils.js');

/**
 * A class for Creating and searching an inverted index
 */
console.log(util.parseJSON("yugjhg"));

var Index = function () {

  /**
   * [constructor Creates Object variables to hold
   * 1. [jsonDatabase] Uploaded files
   * 2. [indexFile] the indexed filenames and their contents
   * 3. [searchResult] the search results
   * @return {[type]} [description]
   */
  function Index() {
    _classCallCheck(this, Index);

    this.jsonDatabase = {};
    this.indexFile = {};
    this.searchResult = {};
  }

  /**
   * [saveUploads creates a key and value object item that stores the uploaded file(s)]
   * @param  {[string} fileName [filename]
   * @param  {[object]} jsonFile [content of uploaded json file]
   * @return {[boolean]}          [returns true on succesful addition of object to datatbase]
   */


  _createClass(Index, [{
    key: 'saveUploads',
    value: function saveUploads(fileName, jsonFile) {
      var _this = this;

      if (!this.isValid(fileName, jsonFile)) {
        return false;
      }
      if (typeof jsonFile === 'string') {
        jsonFile = JSON.parse(jsonFile);
      }

      this.jsonDatabase[fileName] = [];
      Object.keys(jsonFile).forEach(function (keys) {
        _this.jsonDatabase[fileName].push(jsonFile[keys]);
      });
      // for (const docObject in jsonFile) {

      // }
      return true;
    }
    /**
     * [getjsonDatabase function to return the saved uploads]
     * @return {[object]} [the saved uploads]
     */

  }, {
    key: 'getJsonDatabase',
    value: function getJsonDatabase() {
      return this.jsonDatabase;
    }

    /**
     * [createIndex Creates an index of the words in the received json file]
     * @param  {string}   fileName [the key(filename) of the json value to index]
     * @param  {Function} cb  [call back to return the indexed file object/an html format index table]
     * @return {[array]} [an arrray of the indexed file result and the html Div of the index]
     */

  }, {
    key: 'createIndex',
    value: function createIndex(fileName, cb) {
      var _this2 = this;

      var indexFile = this.indexFile;
      var jsonDoc = this.jsonDatabase[fileName];
      var mergedContent = '';
      var wordArray = [];
      if (indexFile[fileName]) {
        return false;
      }
      indexFile[fileName] = {};

      jsonDoc.forEach(function (element, index) {
        mergedContent = _this2.cleanString(element.title + ' ' + element.text);
        wordArray = new Set(mergedContent.split(' '));
        wordArray.forEach(function (word) {
          indexFile[fileName][word] = indexFile[fileName][word] || [];
          indexFile[fileName][word].push(index);
        });
      });
      this.indexFile = indexFile;
      return cb(fileName, indexFile, jsonDoc);
    }

    /**
     * [getIndex Gets the index object of the indexed json file]
     * @param  {[string]} fileName [the filename(key) of the index needed]
     * @return {[object]}          [index of the object]
     */

  }, {
    key: 'getIndex',
    value: function getIndex(fileName) {
      return this.indexFile[fileName] || this.indexFile;
    }

    /**
     * [searchIndex It searches the already indexed files for particular words]
     * @param  {[string]}    fileNames     [description]
     * @param  {Function}  cb            [description]
     * @param  {...[Array]} searchContent [the words to search for]
     * @return {[Array]}                  [an array of two elements, an
     * object with the search term as key and their locations in the
     * array of the originally uploaded file, an html view of the result]
     */

  }, {
    key: 'searchIndex',
    value: function searchIndex(fileNames, cb) {
      var _this3 = this;

      var searchResult = {};

      for (var _len = arguments.length, searchContent = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        searchContent[_key - 2] = arguments[_key];
      }

      var searchTerms = searchContent.join(' ');
      if (fileNames.length < 1) {
        fileNames = this.getFilenames();
      }
      searchTerms = this.cleanString(searchTerms, /[^a-z0-9\s,]+/gi);
      searchTerms = searchTerms.split(/[,\s]/);
      searchTerms.forEach(function (searchTerm) {
        searchResult[searchTerm] = {};
        fileNames.forEach(function (fileName) {
          if (_this3.indexFile[fileName][searchTerm]) {
            searchResult[searchTerm][fileName] = _this3.indexFile[fileName][searchTerm];
          }
        });
      });
      this.searchResult = searchResult;
      return cb(searchResult, this.jsonDatabase);
    }

    /**
     * [createResultHtml Creates an html view based the result of the index search]
     * @param  {[object]} resultObject [the result of the index search]
     * @param  {[object]} jsonDatabase [the json database containing the original Uploaded object]
     * @return {[ogject]}              [returns the search result and the Html view]
     */

  }, {
    key: 'createResultHtml',
    value: function createResultHtml(resultObject, jsonDatabase) {
      var _this4 = this;

      this.resultView = '';
      var termTag = ['<h3>', '</h3>'];
      var fileTag = ['<p>', '</p>'];
      var resultContainer = ["<div class='panel panel-default'>", '</div>'];
      var titleTag = ["<div class='panel-heading result-header'><h3 class='panel-title'> ", '</h3> </div>'];
      var textTag = ["<div class='panel-body'> ", '</div>'];

      Object.keys(resultObject).forEach(function (term) {
        _this4.resultView += 'Search Term: ' + termTag[0] + term + termTag[1];
        Object.keys(resultObject[term]).forEach(function (file) {
          _this4.resultView += fileTag[0] + file + fileTag[1];
          resultObject[term][file].forEach(function (element, index) {
            _this4.resultView += resultContainer[0] + ' ' + titleTag[0] + ' Index: ' + index + ' ';
            _this4.resultView += jsonDatabase[file][index].title + ' ' + titleTag[1];
            _this4.resultView += textTag[0] + jsonDatabase[file][index].text + textTag[1];
            _this4.resultView += resultContainer[1] + titleTag[1];
          });
        });
      });
      return [resultObject, this.resultView];

      // for (const term in resultObject) {
      //   this.resultView += `Search Term: ${termTag[0]}${term}${termTag[1]}`;
      //   for (const file in resultObject[term]) {
      //     this.resultView += fileTag[0] + file + fileTag[1];
      //     resultObject[term][file].forEach((element, index) => {
      //       this.resultView += `${resultContainer[0]} ${titleTag[0]} Index: ${index} `;
      //       this.resultView += `${jsonDatabase[file][index].title} ${titleTag[1]}`;
      //       this.resultView += textTag[0] + jsonDatabase[file][index].text + textTag[1];
      //       this.resultView += resultContainer[1] + titleTag[1];
      //     });
      //   }
      // }
      // return [resultObject, this.resultView];
    }

    /**
     * [getFilenames returns the filenames of all files present in the object]
     * @return {[array]} [an array of filenames]
     */

  }, {
    key: 'getFilenames',
    value: function getFilenames() {
      return Object.keys(this.jsonDatabase);
    }

    /**
     * [deleteIndex Deletes an index file from the index object]
     * @param  {[string]} fileName [the filename(key) of the data to delete]
     * @param  {[boolean]} option   [determines if to delete the index only or also the json file]
     * @return {[boolean]}  [true to delete indexFile and jsonDatabase/false to delete only the index]
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

    /**
     * [createIndexHeader Creates the HTML header of the index file based on the uploaded file]
     * @param  {[string]} FileName [the name of the file(key) to create an index header for]
     * @return {[string]}          [and HTML Panel header with buttons to create and delete index]
     */

  }, {
    key: 'createIndexHeader',
    value: function createIndexHeader(FileName) {
      this.indexHeadView = '';
      var cFileName = FileName.replace(/[^a-z0-9]+/gi, '');
      var htmlTop = '<div id="' + cFileName + '-panel" class="panel panel-default ">\n                            <div class="panel-heading index-header">\n                                <h4 class="panel-title">\n                    <a data-toggle="collapse" data-parent="#accordion" href="#' + cFileName + '">' + FileName + '</a></h4>\n                    <span class="input-group-addon create-button" onclick="callCreateIndex(\'' + FileName + '\')" id="create-index">Create Index</span>\n                    <span class="input-group-addon delete-button" onclick="callDeleteIndex(\'' + FileName + '\')" id="delete-index">Delete Index</span></div>\n                    <div id="' + cFileName + '" class="panel-collapse collapse in index-body">\n                    <div class="panel-body"><div class="table-responsive"><table id="' + cFileName + '-table" class="table"></table></div></div></div></div>';
      this.indexHeadView += htmlTop;
      return this.indexHeadView;
    }

    /**
     * [createIndexHtml Creates an html file based on the index of the provided filepath]
     * @param  {[string]} filePath  [the filename of the index]
     * @param  {[object]} indexFile [the store of all created index objects]
     * @param  {[object]} jsonDoc   [the object of the uploaded json file for the file requested]
     * @return {[array]} returns the index and the html panel representation of the index]
     */

  }, {
    key: 'createIndexHtml',
    value: function createIndexHtml(filePath, indexFile, jsonDoc) {
      var _this5 = this;

      this.indexView = '';
      var indexPerPath = indexFile[filePath];
      this.indexView += '<thead> <th>#</th>';
      this.indexView += '<th>word</th>';
      jsonDoc.forEach(function (element, index) {
        _this5.indexView += '<th>Doc ' + (index + 1) + ' </th>';
      });
      var count = 1;
      this.indexView += '<tbody>';
      Object.keys(indexPerPath).forEach(function (word) {
        _this5.indexView += '<tr> <td> ' + count + '</td>';
        _this5.indexView += '<td> ' + word + ' </td>';
        jsonDoc.forEach(function (element, index) {
          if (indexPerPath[word].indexOf(index) > -1) {
            _this5.indexView += '<td>✔</td>';
          } else {
            _this5.indexView += '<td class="neg-tick">✘</td>';
          }
        });
        _this5.indexView += '</tr>';
        count = +1;
      });

      // for (const word in indexPerPath) {
      //   this.indexView += `<tr> <td> ${count}</td>`;
      //   this.indexView += `<td> ${word} </td>`;
      //   jsonDoc.forEach((element, index) => {
      //     if (indexPerPath[word].indexOf(index) > -1) {
      //       this.indexView += '<td>✔</td>';
      //     } else {
      //       this.indexView += '<td class="neg-tick">✘</td>';
      //     }
      //   });
      //   this.indexView += '</tr>';
      //   count++;
      // }
      this.indexView += '</tbody>';
      return [indexPerPath, this.indexView];
    }
  }]);

  return Index;
}();