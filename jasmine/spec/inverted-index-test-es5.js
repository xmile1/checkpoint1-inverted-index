(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports={
}

},{}],2:[function(require,module,exports){
var valid = [{
  title: 'Alice in Wonderland',
  text: 'Alice falls into a rabbit hole and enters a world full of imagination.'
}, {
  title: 'The Lord of in the Rings: The Fellowship of the Ring.',
  text: 'An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring.'
}];

module.exports = valid;

},{}],3:[function(require,module,exports){
module.exports=[{
  "title": "Black Panther",
  "text": 2
}, {
  "title": "Constantine: HellBlazer",
  "text": "One man stands between Heaven and Hell. He may be our last hope"
}, {
  "title": "Batman: Year One",
  "text": "A rookie BatMan, Fresh from the League of Assasins tries to find his way"
}]

},{}],4:[function(require,module,exports){
module.exports=[{
    "title": "Black Panther",
    "text": ""
  },
  {
    "title": "Constantine: HellBlazer",
    "text": "One man stands between Heaven and Hell. He may be our last hope"
  },
  {
    "title": "Batman: Year One",
    "text": "A rookie BatMan, Fresh from the League of Assasins tries to find his way"
}]

},{}],5:[function(require,module,exports){
module.exports=[{
    "not-title": "Black Panther"
  },
  {
    "title": "Constantine: HellBlazer",
    "text": "One man stands between Heaven and Hell. He may be our last hope"
  },
  {
    "title": "Batman: Year One",
    "text": "A rookie BatMan, Fresh from the League of Assasins tries to find his way"
}]

},{}],6:[function(require,module,exports){
const valid2 = require('./dummy-data/file1.js');
const empty = require('./dummy-data/empty.json');
const valid1 = require('./dummy-data/file1.js');
const invalidStructure = require('./dummy-data/file5.json');
const invalidContent = require('./dummy-data/file4.json');
const nonString = require('./dummy-data/file3.json');
var Index = require('../../src/inverted-index.js');

// /** @type {String} [description] -------------------------------------------------------------- */
// const invalid = '';
// const empty = {};
// const valid1 = [{
//   title: 'Alice in Wonderland',
//   text: 'Alice falls into a rabbit hole and enters a world full of imagination.'
// }, {
//   title: 'The Lord of the Rings: The Fellowship of the Ring.',
//   text: 'An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring.'
// }];
// const valid2 = [{
//   title: 'Alice in Wonderland',
//   text: 'Alice falls into a rabbit hole and enters a world full of imagination.'
// }, {
//   title: 'The Lord of the Rings: The Fellowship of the Ring.',
//   text: 'An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring.'
// }];
// const nonString = [{
//   title: 'Black Panther',
//   text: 2
// }, {
//   title: 'Constantine: HellBlazer',
//   text: 'One man stands between Heaven and Hell. He may be our last hope'
// }, {
//   title: 'Batman: Year One',
//   text: 'A rookie BatMan, Fresh from the League of Assasins tries to find his way'
// }];
//
// const invalidContent = [{
//   title: 'Black Panther',
//   text: ''
// }, {
//   title: 'Constantine: HellBlazer',
//   text: 'One man stands between Heaven and Hell. He may be our last hope'
// }, {
//   title: 'Batman: Year One',
//   text: 'A rookie BatMan, Fresh from the League of Assasins tries to find his way'
// }];
//
// const invalidStructure = [{
//   'not-title': 'Black Panther'
// }, {
//   title: 'Constantine: HellBlazer',
//   text: 'One man stands between Heaven and Hell. He may be our last hope'
// }, {
//   title: 'Batman: Year One',
//   text: 'A rookie BatMan, Fresh from the League of Assasins tries to find his way'
// }];
// /**
//  * Dummy Data for Test End --------------------------------------------------------------
//  */

function getFile(filename, cb) {
  const theResult = [filename];
  cb(theResult);
}
describe('Read Book data', function() {
  const index = new Index();
  describe('When I upload a JSON file', () => {
    it('It should checks if its a valid JSON array', (done) => {
      expect(index.saveUploads('invalidStructure.json', invalidStructure)).toBeFalsy();
      done();
    });
    it('It should check if the file is empty', (done) => {
      expect(index.saveUploads('empty.json', empty)).toBeFalsy();
      done();
    });
    it('It should check if Its property values are strings', (done) => {
      expect(index.saveUploads('nonString.json', nonString)).toBeFalsy();
      done();
    });
    it('get json database should return the saved content', (done) => {
      index.saveUploads('valid1.json', valid1);
      expect(Object.keys(index.getJsonDatabase()).length).toEqual(1);
      done();
    });
    it('getfilename should return the filenames of the saved contents', (done) => {
      index.saveUploads('valid1.json', valid1);
      expect(index.getFilenames()).toEqual(['valid1.json']);
      done();
    });
  });
});
describe('Populate Index', () => {
  const index = new Index();
  index.saveUploads('valid1.json', valid1);
  index.saveUploads('valid2.json', valid1);
  index.createIndex('valid1.json');

  describe('When I Upload a File', () => {
    it('the index is created once the JSON file has been read', (done) => {
      expect(typeof index.getIndex('valid1.json')).toEqual('object');
      done();
    });

    it('the created index should be an accurate one', (done) => {
      expect(index.getIndex('valid1.json').alice[0]).toEqual(0);
      expect(index.getIndex('valid1.json').lord[0]).toEqual(1);
      expect(index.getIndex('valid1.json').a[1]).toEqual(1);
      done();
    });

    it('the created index should be an inverted index', (done) => {
      let verdict = true;
      const indexContent = index.indexFile['valid1.json'];

      for (value in indexContent) {
        if (!Array.isArray(indexContent[value]) || isNaN(indexContent[value][0])) {
          verdict = false;
        }
      }
      expect(verdict).toEqual(true);
      done();
    });
    it('it should not overwrite the index', (done) => {
      const indexBefore = index.getIndex('valid1.json');
      index.createIndex('valid2.json');
      const indexAfter = index.getIndex('valid1.json');
      expect(indexBefore).toEqual(indexAfter);
      done();
    });
  });
});

describe('Search Index', () => {
  const index = new Index();
  index.saveUploads('valid1.json', valid1);
  index.createIndex('valid1.json');

  describe('should return the correct result when searched', () => {
    it('for single word argument', (done) => {
      const result = index.searchIndex(['valid1.json'], 'alice');
      expect(result).toEqual({
        alice: {
          'valid1.json': [0]
        }
      });
      done();
    });
    it('for single word argument with non-alphanumeric', (done) => {
      const result = index.searchIndex(['valid1.json'], '+alice-=');
      expect(result).toEqual({
        alice: {
          'valid1.json': [0]
        }
      });
      done();
    });

    it('It should return correct answer for multiple words in one argument', (done) => {
      const result = index.searchIndex(['valid1.json'], 'alice in');
      expect(result).toEqual({
        alice: {
          'valid1.json': [0]
        },
        in: {
          'valid1.json': [0, 1]
        }
      });
      done();
    });
  });

  it(' - The search should not take too long to execute', (done) => {
    const startTime = performance.now();
    index.searchIndex(['valid1.json'], 'alice');
    const endTime = performance.now();
    expect(endTime - startTime < 5000).toBeTruthy();
    done();
  });

  it('should accept a varied number of argument', (done) => {
    let result = index.searchIndex(['valid1.json'], 'alice in', 'lord town');
    expect(typeof result).toEqual('object');
    result = index.searchIndex(['valid1.json'], 'alice in', ['lord', 'town']);
    expect(typeof result).toEqual('object');
    result = index.searchIndex(['valid1.json'], 'alice', 'in');
    expect(result).toEqual({
      alice: {
        'valid1.json': [0]
      },
      in: {
        'valid1.json': [0, 1]
      }
    });
    done();
  });

  it('It should accept an array of argument', (done) => {
    const result = index.searchIndex(['valid1.json'], ['alice', 'in']);
    expect(result).toEqual({
      alice: {
        'valid1.json': [0]
      },
      in: {
        'valid1.json': [0, 1]
      }
    });
    done();
  });


  it('It should accept mix of array and words as argument', (done) => {
    result = index.searchIndex(['valid1.json'], 'alice in', ['lord', 'town']);
    expect(typeof result).toEqual('object');
    done();
  });

  describe('Get Index', () => {
    it('should take the filename of the indexed JSON data', () => {
      expect(typeof index.getIndex('valid1.json')).toEqual('object');
    });
  });
});

},{"../../src/inverted-index.js":7,"./dummy-data/empty.json":1,"./dummy-data/file1.js":2,"./dummy-data/file3.json":3,"./dummy-data/file4.json":4,"./dummy-data/file5.json":5}],7:[function(require,module,exports){
const utils = require('./utils.js');

/**
 * A class for Creating and searching an inverted index
 */
class Index {

  /**
   * [constructor Creates Object variables to hold
   * 1. [jsonDatabase] Uploaded files
   * 2. [indexFile] the indexed filenames and their contents
   * 3. [searchResult] the search results
   */
  constructor() {
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
  saveUploads(fileName, jsonFile) {
    if (!utils.isValid(fileName, jsonFile)) {
      return false;
    }
    if (typeof jsonFile === 'string') {
      jsonFile = JSON.parse(jsonFile);
    }
    this.jsonDatabase[fileName] = [];
    Object.keys(jsonFile).forEach((keys) => {
      this.jsonDatabase[fileName].push(jsonFile[keys]);
    });
    return true;
  }

  /**
   * [getJsonDatabase function to return the saved uploads]
   * @return {object} [the saved uploads]
   */
  getJsonDatabase() {
    return this.jsonDatabase;
  }

  /**
   * [createIndex Creates an index of the words in the received json file]
   * @param  {string}   filePath [the key(filename) of the json value to index]
   * @param  {Function} cb  [call back to return the indexed file object/an html format index table]
   * @return {array} [an arrray of the indexed file result and the html Div of the index]
   */
  createIndex(filePath) {
    const indexFile = this.indexFile;
    const jsonDoc = this.jsonDatabase[filePath];
    let concSentence = '';
    let wordArray = [];
    if (indexFile[filePath]) {
      return false;
    }
    indexFile[filePath] = {};
    jsonDoc.forEach((element, index) => {
      concSentence = utils.cleanString((`${element.title} ${element.text}`));
      wordArray = new Set(concSentence.split(' '));
      wordArray.forEach((word) => {
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
  getIndex(fileName) {
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
  searchIndex(fileNames, ...searchContent) {
    const searchResult = {};
    let searchTerms = searchContent.join(' ');
    if (fileNames.length < 1) {
      fileNames = this.getFilenames();
    }
    searchTerms = utils.cleanString(searchTerms, /[^a-z0-9\s,]+/gi);
    searchTerms = searchTerms.split(/[,\s]/);
    searchTerms.forEach((searchTerm) => {
      searchResult[searchTerm] = {};
      fileNames.forEach((fileName) => {
        if (this.indexFile[fileName][searchTerm]) {
          searchResult[searchTerm][fileName] = this.indexFile[fileName][searchTerm];
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
  getFilenames() {
    return Object.keys(this.jsonDatabase);
  }

  /**
   * [deleteIndex Deletes an index file from the index object]
   * @param  {string} fileName [the filename(key) of the data to delete]
   * @param  {boolean} option   [determines if to delete the index only or also the json file]
   * @return {boolean}  [true to delete indexFile and jsonDatabase/false to delete only the index]
   */
  deleteIndex(fileName, option) {
    delete this.indexFile[fileName];
    if (option === true) {
      delete this.jsonDatabase[fileName];
      return true;
    }
    return false;
  }

}

module.exports = Index;

},{"./utils.js":8}],8:[function(require,module,exports){
/* eslint class-methods-use-this: 0*/
/**
 * util - An helper class for inverted-index
 */
class util {

  /**
     * [parseJSON converts sting to a Json object]
     * @param  {string} jsonFile
     * @return {object}  [the parsed file or false on error]
     */
  parseJSON(jsonFile) {
    if (typeof jsonFile === 'object') {
      return jsonFile;
    }
    try {
      return JSON.parse(jsonFile);
    } catch (err) {
      return true;
    }
  }

  /**
     * [isValid Check if a file is a valid json object based, calls method to check structure]
     * @param  {string}  fileName [the filename to verfity if is the object in the database]
     * @param  {object}  jsonFile [the json object to be tested]
     * @return {Boolean}          [returns true if valid else false]
     */
  isValid(fileName, jsonFile) {
    if (typeof jsonFile === 'string') {
      jsonFile = JSON.parse(jsonFile);
    }
    if (jsonFile && jsonFile.length > 0) {
      const isValidFileStructure = this.checkFileStructure(jsonFile);
      if (isValidFileStructure) {
        // if (!this.jsonDatabase[fileName]) {
        return true;
      // }
      }
    }
    return false;
  }


  /**
     * [checkFileStructure Checks if object follows the structure as found in ./jasmine/books.json]
     * @param  {[object]} jsonFile [json file to be tested]
     * @return {boolean}          [true if valid and false if invalid]
     */
  checkFileStructure(jsonFile) {
    this.isValidFile = true;
    jsonFile.forEach((document) => {
      const isValidTitle = document.title && document.title.length > 0 && typeof document.title === 'string';
      const isValidText = document.text && document.text.length > 0 && typeof document.text === 'string';
      if (!(isValidText && isValidTitle)) {
        this.isValidFile = false;
        return false;
      }
    });
    return this.isValidFile;
  }

  /**
   * [cleanString This method takes in a string with whitespaces, non-alphanumric characters and
   * Returns a clean version with all unecessary characters striped away]
   * @param  {string} theString [the string to cleanup]
   * @param  {[Regex]} theRegex  [the regex to use]
   * @return {[String]}           [A string Strpped based on the regex]
   */
  cleanString(theString, theRegex) {
    return theString.replace(theRegex, '').toLowerCase() || theString.replace(/[^a-z0-9\s]+/gi, '').toLowerCase();
  }
}
module.exports = new util();

},{}]},{},[6])