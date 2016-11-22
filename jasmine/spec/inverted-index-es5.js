'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Index = function () {
  function Index() {
    _classCallCheck(this, Index);

    this.jsonDatabase = {};
    this.indexFile = {};
    this.searchResult;
  }

  _createClass(Index, [{
    key: 'saveUploads',
    value: function saveUploads(fileName, jsonFile) {
      if (!this.isValid(fileName, jsonFile)) {
        return false;
      }
      if (typeof jsonFile === 'string') {
        jsonFile = JSON.parse(jsonFile);
      }

      this.jsonDatabase[fileName] = [];
      for (var docObject in jsonFile) {
        this.jsonDatabase[fileName].push(jsonFile[docObject]);
      }
      return true;
    }
  }, {
    key: 'getjsonDatabase',
    value: function getjsonDatabase() {
      return this.jsonDatabase;
    }
  }, {
    key: 'createIndex',
    value: function createIndex(filePath, cb) {
      var _this = this;

      var indexFile = this.indexFile;
      var jsonDoc = this.jsonDatabase[filePath];
      var concSentence = '';
      var wordArray = [];
      if (indexFile[filePath]) {
        return false;
      }
      indexFile[filePath] = {};

      jsonDoc.forEach(function (element, index) {
        concSentence = _this.cleanString(element.title + ' ' + element.text);
        wordArray = new Set(concSentence.split(' '));
        wordArray.forEach(function (word) {
          indexFile[filePath][word] = indexFile[filePath][word] || [];
          indexFile[filePath][word].push(index);
        });
      });
      this.indexFile = indexFile;
      console.log(indexFile);
      return cb(filePath, indexFile, jsonDoc);
      // console.log(indexFile);
    }
  }, {
    key: 'isValid',
    value: function isValid(fileName, jsonFile) {
      if (typeof jsonFile === 'string') {
        jsonFile = JSON.parse(jsonFile);
      }

      if (jsonFile && jsonFile.length > 0) {
        var isValidFileStructure = this.checkFileStructure(jsonFile);
        if (isValidFileStructure) {
          if (!this.jsonDatabase[fileName]) {
            return true;
          }
        }
      }
      return false;
    }
  }, {
    key: 'checkFileStructure',
    value: function checkFileStructure(jsonFile) {
      var isValidFile = true;

      jsonFile.forEach(function (document, documentIndex) {
        var isValidTitle = document.title !== undefined && document.title.length > 0 && typeof document.title === 'string';
        var isValidText = document.text !== undefined && document.text.length > 0 && typeof document.text === 'string';
        if (!(isValidText && isValidTitle)) {
          isValidFile = false;
          return false;
        }
      });
      return isValidFile;
    }
  }, {
    key: 'parseJSON',
    value: function parseJSON(jsonFile) {
      try {
        return JSON.parse(jsonFile);
      } catch (err) {
        return true;
      }
    }

    /**
     * @param  {filename}
     * @return {indexFile}
     */

  }, {
    key: 'getIndex',
    value: function getIndex(fileName) {
      return this.indexFile[fileName] || this.indexFile;
    }

    /**
     *
     *
     * This method takes in a sentence with whitespaces, non-alphanumric characters and
     * Returns a clean version with all unecessary characters striped away
     * @param {string} theString
     * @return {string} clean String
     */

  }, {
    key: 'cleanString',
    value: function cleanString(theString, theRegex) {
      return theString.replace(theRegex, '').toLowerCase() || theString.replace(/[^a-z0-9\s]+/gi, '').toLowerCase();
    }
  }, {
    key: 'searchIndex',
    value: function searchIndex(fileNames, cb) {
      var _this2 = this;

      if (fileNames.length < 1) {
        fileNames = this.getFilenames();
      }
      var searchResult = {};

      for (var _len = arguments.length, searchContent = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        searchContent[_key - 2] = arguments[_key];
      }

      var searchTerms = searchContent.join(' ');
      searchTerms = this.cleanString(searchTerms, /[^a-z0-9\s,]+/gi);
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
      return cb(searchResult, this.jsonDatabase);
    }
  }, {
    key: 'createResultHtml',
    value: function createResultHtml(resultObject, jsonDatabase) {
      var resultView = '';
      var termTag = ['<h3>', '</h3>'];
      var fileTag = ['<p>', '</p>'];
      var resultContainer = ["<div class='panel panel-default'>", '</div>'];
      var titleTag = ["<div class='panel-heading'><h3 class='panel-title'> ", '</h3> </div>'];
      var textTag = ["<div class='panel-body'> ", '</div>'];
      for (var term in resultObject) {
        resultView += termTag[0] + term + termTag[1];

        var _loop = function _loop(file) {
          resultView += fileTag[0] + file + fileTag[1];
          resultObject[term][file].forEach(function (element, index) {
            resultView += resultContainer[0] + ' ' + titleTag[0] + ' Index: ' + index + ' ';
            resultView += jsonDatabase[file][index].title + ' ' + titleTag[1];
            resultView += textTag[0] + jsonDatabase[file][index].text + textTag[1];
            resultView += resultContainer[1] + titleTag[1];
          });
        };

        for (var file in resultObject[term]) {
          _loop(file);
        }
      }
      return [resultObject, resultView];
    }
  }, {
    key: 'getFilenames',
    value: function getFilenames() {
      return Object.keys(this.jsonDatabase);
    }
  }, {
    key: 'deleteIndex',
    value: function deleteIndex(fileName, option) {
      delete this.indexFile[fileName];
      if (option == true) {
        delete this.jsonDatabase[fileName];
      }
    }
  }, {
    key: 'createIndexHeader',
    value: function createIndexHeader(FileName) {
      var indexHeadView = '';
      var cFileName = FileName.replace(/[^a-z0-9]+/gi, '');
      var htmlTop = '<div id="' + cFileName + '-panel" class="panel panel-default ">\n                            <div class="panel-heading index-header">\n                                <h4 class="panel-title">\n                    <a data-toggle="collapse" data-parent="#accordion" href="#' + cFileName + '">' + FileName + '</a></h4><span class="input-group-addon create-button" onclick="callCreateIndex(\'' + FileName + '\')" id="create-index">Create Index</span><span class="input-group-addon delete-button" onclick="callDeleteIndex(\'' + FileName + '\')" id="delete-index">Delete Index</span></div><div id="' + cFileName + '" class="panel-collapse collapse in index-body"><div class="panel-body"><div class="table-responsive"><table id="' + cFileName + '-table" class="table"></table></div></div></div></div>';
      indexHeadView += htmlTop;

      return indexHeadView;
    }
  }, {
    key: 'createIndexHtml',
    value: function createIndexHtml(filePath, indexFile, jsonDoc) {
      var indexView = '';
      var indexPerPath = indexFile[filePath];
      for (var filename in indexFile) {
        var cFilename = filePath.replace(/[^a-z0-9]+/gi, '');
        var headTag = ['<thead>', '</thead>'];
        var rowTag = ['<tr>', '</tr>'];
        var tdTag = ['<td>', '</td>'];
        var headDataTag = ['<th>', '</th>'];
        var bodyTag = ['<tbody>', '</tbody>'];

        indexView += '<thead> + <th>#</th>';
        indexView += '<th>word</th>';

        jsonDoc.forEach(function (element, index) {
          indexView += '<th>Doc </th>';
        });
        var count = 1;
        indexView += '<tbody>';

        var _loop2 = function _loop2(word) {
          indexView += '<tr> + <td> + count + </td>';
          indexView += '<td> + word + </td>';
          jsonDoc.forEach(function (element, index) {
            if (indexPerPath[word].indexOf(index) > -1) {
              indexView += '<td>\u2714</td>';
            } else {
              indexView += '<td class="neg-tick">\u2718</td>';
            }
          });

          indexView += '</tr>';
          count++;
        };

        for (var word in indexPerPath) {
          _loop2(word);
        }
        indexView += '</tbody>';
      }

      return [indexPerPath, indexView];
    }
  }]);

  return Index;
}();

var thisindex = new Index();
var theJSON = [{
  title: 'Alice in Wonderland',
  text: 'Alice falls into a rabbit hole and enters a world full of imagination.'
}, {
  title: 'The Lord of the Rings: The Fellowship of the Ring.',
  text: 'An unusual alliance in of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring.'
}];

// Sample Structure of this.indexFile
// ({ 'books.json': { alice: [0], in : [0, 1], wonderland: [0], falls: [0], into: [0], a: [0, 1], rabbit: [0], hole: [0], and: [0, 1], enters: [0], world: [0], full: [0], of: [0, 1], 'imagination.': [0], the: [1], lord: [1], 'rings:': [1], fellowship: [1], 'ring.': [1], an: [1], unusual: [1], alliance: [1], 'man,': [1], 'elf,': [1], 'dwarf,': [1], wizard: [1], hobbit: [1], seek: [1], to: [1], destroy: [1], powerful: [1] } })

// Sample Structure of this.jsonDatabase
// ({ 'books.json': [{ title: "Alice in Wonderland", text: "Alice falls into a rabbit hole and enters a world full of imagination." }, { title: "The Lord of the Rings: The Fellowship of the Ring.", text: "An unusual alliance in of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring." }], 'book2.json': [{ title: "Alice in Wonderland", text: "Alice falls into a rabbit hole and enters a world full of imagination." }, { title: "The Lord of the Rings: The Fellowship of the Ring.", text: "An unusual alliance in of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring." }] })