"use strict";

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
    key: "saveUploads",
    value: function saveUploads(fileName, jsonFile) {
      // console.log(jsonFile);
      // console.log(JSON.parse(jsonFile));


      // jsonFile = JSON.parse(JSON.stringify(jsonFile));
      if (this.jsonDatabase[fileName]) {
        return "File Already Exist in DataBase";
      }
      this.jsonDatabase[fileName] = [];

      for (var docObject in jsonFile) {
        this.jsonDatabase[fileName].push(jsonFile[docObject]);
      }
      // this.createIndex(fileName);
    }
  }, {
    key: "getjsonDatabase",
    value: function getjsonDatabase() {
      return this.jsonDatabase;
    }
  }, {
    key: "createIndex",
    value: function createIndex(filePath, jsonFile, cb) {
      var _this = this;

      this.saveUploads(filePath, jsonFile);
      var indexFile = this.indexFile;
      var jsonDatabase = this.jsonDatabase[filePath];
      var concSentence = "";
      var wordArray = [];
      indexFile[filePath] = {};
      jsonDatabase.forEach(function (element, index) {
        concSentence = _this.cleanString(element.title + " " + element.text);
        wordArray = new Set(concSentence.split(" "));
        wordArray.forEach(function (word) {
          indexFile[filePath][word] = indexFile[filePath][word] || [];
          indexFile[filePath][word].push(index);
        });
      });
      this.indexFile = indexFile;

      return cb(indexFile, jsonDatabase);
      // console.log(indexFile);
    }

    /**
     * @param  {filename}
     * @return {indexFile}
     */

  }, {
    key: "getIndex",
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
    key: "cleanString",
    value: function cleanString(theString, theRegex) {

      return theString.replace(theRegex, '').toLowerCase() || theString.replace(/[^a-z0-9\s]+/gi, '').toLowerCase();
    }
  }, {
    key: "searchIndex",
    value: function searchIndex(fileNames, cb) {
      var _this2 = this;

      var searchResult = {};

      for (var _len = arguments.length, searchContent = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        searchContent[_key - 2] = arguments[_key];
      }

      var searchTerms = searchContent.join(" ");
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
      console.log(searchResult);
      return cb(searchResult, this.jsonDatabase);
    }
  }, {
    key: "createResultHtml",
    value: function createResultHtml(resultObject, jsonDatabase) {
      var resultView = "";
      var termTag = ["<h3>", "</h3>"];
      var fileTag = ["<p>", "</p>"];
      var resultContainer = ["<div class='panel panel-default'>", "</div>"];
      var titleTag = ["<div class='panel-heading'><h3 class='panel-title'> ", "</h3> </div>"];
      var textTag = ["<div class='panel-body'> ", "</div>"];
      for (var term in resultObject) {
        resultView += termTag[0] + term + termTag[1];

        var _loop = function _loop(file) {
          resultView += fileTag[0] + file + fileTag[1];
          resultObject[term][file].forEach(function (element, index) {
            resultView += resultContainer[0] + " " + titleTag[0] + " Index: " + index + " ";
            resultView += jsonDatabase[file][index]["title"] + " " + titleTag[1];
            resultView += textTag[0] + jsonDatabase[file][index]["text"] + textTag[1];
            resultView += resultContainer[1] + titleTag[1];
          });
        };

        for (var file in resultObject[term]) {
          _loop(file);
        }
      }
      return [resultObject, resultView];
    }

    // 
    // // <thead>
    //                                               <tr>
    //                                                   <th>#</th>
    //                                                   <th>word</th>
    //                                                   <th>Doc 1</th>
    //                                                   <th>Doc 2</th>
    //                                               </tr>
    //                                           </thead>
    //                                           <tbody>
    //                                               <tr>
    //                                                   <td>1</td>
    //                                                   <td>Mark</td>
    //                                                   <td>Otto</td>
    //                                                   <td>@mdo</td>
    //                                               </tr>
    //                                               </body>
    //                                               
    //                                               
    // ({ 'books.json': { alice: [0], in : [0, 1], wonderland: [0], falls: [0], into: [0], a: [0, 1], rabbit: [0], hole: [0], and: [0, 1], enters: [0], world: [0], full: [0], of: [0, 1], 'imagination.': [0], the: [1], lord: [1], 'rings:': [1], fellowship: [1], 'ring.': [1], an: [1], unusual: [1], alliance: [1], 'man,': [1], 'elf,': [1], 'dwarf,': [1], wizard: [1], hobbit: [1], seek: [1], to: [1], destroy: [1], powerful: [1] } })

    // ({ 'books.json': [{ title: "Alice in Wonderland", text: "Alice falls into a rabbit hole and enters a world full of imagination." }, { title: "The Lord of the Rings: The Fellowship of the Ring.", text: "An unusual alliance in of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring." }], 'book2.json': [{ title: "Alice in Wonderland", text: "Alice falls into a rabbit hole and enters a world full of imagination." }, { title: "The Lord of the Rings: The Fellowship of the Ring.", text: "An unusual alliance in of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring." }] })


  }, {
    key: "createIndexHtml",
    value: function createIndexHtml(indexFile, jsonDatabase) {
      var indexView = "";
      var headContainer = ["<div class=\"panel-group\">\n                        <div class=\"panel panel-default\">\n                            <div class=\"panel-heading\">\n                                <h4 class=\"panel-title\">\n                    <a data-toggle=\"collapse\" data-parent=\"#accordion\" href=\"#collapse1\">", "</a>\n                  </h4>\n                            </div>"];
      var bodyContainer = ["<div id=\"collapse1\" class=\"panel-collapse collapse in\">\n                                <div class=\"panel-body\">\n                                    <div class=\"table-responsive\">\n                                        <table class=\"table\">", "</table></div></div></div>"];
      var headTag = ["<thead>", "</thead>"];
      var rowTag = ["<tr>", "</tr>"];
      var tdTag = ["<td>", "</td>"];
      var headDataTag = ["<th>", "</th>"];
      var bodyTag = ["<tbody>", "</tbody>"];

      var _loop2 = function _loop2(filename) {
        console.log(indexFile[filename]);
        indexView += headContainer[0] + filename + headContainer[1] + bodyContainer[0] + headTag[0];
        indexView += headDataTag[0] + "#" + headDataTag[1];
        indexView += headDataTag[0] + "word" + headDataTag[1];

        jsonDatabase.forEach(function (element, index) {
          indexView += headDataTag[0] + "Doc " + index + headDataTag[1];
        });
        var count = 0;

        var _loop3 = function _loop3(word) {
          indexView += rowTag[0] + tdTag[0] + count + tdTag[1];
          indexView += tdTag[0] + word + tdTag[1];
          var counter = 0;
          jsonDatabase.forEach(function (element, index) {
            console.log(index);
            if (indexFile[filename][word].indexOf(index) > -1) {
              indexView += tdTag[0] + "gud" + tdTag[1];
            } else {
              indexView += tdTag[0] + "bad" + tdTag[1];
            }
            // indexView += headDataTag[0] + index + headDataTag[1];
          });

          indexView += rowTag[1];
          count++;
        };

        for (var word in indexFile[filename]) {
          _loop3(word);
        }
        indexView += headContainer[1];
      };

      for (var filename in indexFile) {
        _loop2(filename);
      }
      return [indexFile, indexView];
    }
  }]);

  return Index;
}();

var thisindex = new Index();
var theJSON = [{
  "title": "Alice in Wonderland",
  "text": "Alice falls into a rabbit hole and enters a world full of imagination."
}, {
  "title": "The Lord of the Rings: The Fellowship of the Ring.",
  "text": "An unusual alliance in of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring."
}];

// thisindex.saveUploads("books.json", theJSON);


// thisindex.createIndex("books.json", theJSON);
// // // thisindex.createIndex("books.json")
// // // thisindex.createIndex("books1.json")
// // thisindex.searchIndex(["books.json"], "lord", ["alice", "in", "algeria", "wonderland"]);
// // // startTime = performance.now();

// console.log(thisindex.searchIndex(["books.json"], thisindex.createResultHtml, "alice in"));
// console.log(thisindex.searchResult);
// // // endTime = performance.now();
// console.log(thisindex.getIndex("books.json"));