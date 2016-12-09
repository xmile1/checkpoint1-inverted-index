(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("invertedIndex", [], factory);
	else if(typeof exports === 'object')
		exports["invertedIndex"] = factory();
	else
		root["invertedIndex"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(6);


/***/ },
/* 1 */,
/* 2 */,
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const utils = __webpack_require__(4);
	
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
	  }
	
	  /**
	   * [saveUploads stores the uploaded file(s)]
	   * @param  {string} fileName [filename]
	   * @param  {object} jsonFile [content of uploaded json file]
	   * @return {boolean} [returns true on addition of object to datatbase]
	   */
	  saveUploads(fileName, jsonFile) {
	    if (utils.fileAlreadyExists(fileName, this.jsonDatabase)) {
	      return false;
	    }
	    if (!utils.isFileValid(fileName, jsonFile)) {
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
	   * @return {array} [an arrray of the indexed file]
	   */
	  createIndex(filePath) {
	    let indexFile = this.indexFile;
	    const jsonDoc = this.jsonDatabase[filePath];
	    let joinedValues = '';
	    let words = [];
	    if (indexFile[filePath]) {
	      return false;
	    }
	    indexFile[filePath] = {};
	    jsonDoc.forEach((element, index) => {
	      joinedValues = utils.cleanString((`${element.title} ${element.text}`));
	      words = new Set(joinedValues.split(' '));
	      words.forEach((word) => {
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
	   * @param  {...Array} searchContent [the words to search for]
	   * @return {Array}                  [an array of two elements, an
	   * object with the search term as key and their locations in the
	   * array of the originally uploaded file, an html view of the result]
	   */
	  searchIndex(fileNames, ...searchContent) {
	    let searchResult = {};
	    let Terms = searchContent.join(' ');
	    if (fileNames.length < 1) {
	      fileNames = this.getFileNames();
	    }
	    Terms = utils.cleanString(Terms, /[^a-z0-9\s,]+/gi);
	    Terms = Terms.split(/[,\s]/);
	    Terms.forEach((Term) => {
	      searchResult[Term] = {};
	      fileNames.forEach((fileName) => {
	        if (this.indexFile[fileName][Term]) {
	          searchResult[Term][fileName] = this.indexFile[fileName][Term];
	        }
	      });
	    });
	    return searchResult;
	  }
	
	  /**
	   * [getFileNames returns the filenames of all files present in the object]
	   * @return {array} [an array of filenames]
	   */
	  getFileNames() {
	    return Object.keys(this.jsonDatabase);
	  }
	
	  /**
	   * [deleteIndex Deletes an index file from the index object]
	   * @param  {string} fileName [the filename(key) of the data to delete]
	   * @param  {boolean} option   [determines the file to delete]
	   * @return {boolean}  [delete indexFile and/or jsonDatabase]
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


/***/ },
/* 4 */
/***/ function(module, exports) {

	/* eslint class-methods-use-this: 0*/
	/**
	 * Util - An helper class for inverted-index
	 */
	class Util {
	
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
	   * [isFileValid Check if a file is a valid json object based]
	   * @param  {string}  fileName [the filename of the jsonFile]
	   * @param  {object}  jsonFile [the json object to be tested]
	   * @return {Boolean} [returns true if valid else false]
	   */
	  isFileValid(fileName, jsonFile) {
	    if (typeof jsonFile === 'string') {
	      try {
	        jsonFile = JSON.parse(jsonFile);
	      } catch (e) {
	        return false;
	      }
	    }
	    if (jsonFile && jsonFile.length > 0) {
	      const isValidFileStructure = this.checkFileStructure(jsonFile);
	      if (isValidFileStructure) {
	        return true;
	      }
	    }
	    return false;
	  }
	
	  /**
	   * [checkFileStructure Checks if fileStructure is valid]
	   * @param  {[object]} jsonFile [json file to be tested]
	   * @return {boolean}          [true if valid and false if invalid]
	   */
	  checkFileStructure(jsonFile) {
	    this.isValidFile = true;
	    jsonFile.forEach((document) => {
	      const validTitle = document.title && document.title.length > 0
	      const validType = typeof document.title === 'string';
	      const validText = document.text && document.text.length > 0
	      const validTextType = typeof document.text === 'string';
	
	      if (!(validTitle && validType && validText && validTextType)) {
	        this.isValidFile = false;
	        return false;
	      }
	    });
	    return this.isValidFile;
	  }
	
	  /**
	   * [cleanString This method returns a clean version of a string
	   * with all unecessary characters striped away]
	   * @param  {string} theString [the string to cleanup]
	   * @param  {[Regex]} theRegex  [the regex to use]
	   * @return {[String]}           [A string Strpped based on the regex]
	   */
	  cleanString(theString, theRegex) {
	    return theString.replace(theRegex, '').toLowerCase() || theString.replace(/[^a-z0-9\s]+/gi, '').toLowerCase();
	  }
	
	  /**
	   * [Checks if file already exists]
	   * @param  {string} fileName [the filename to search for]
	   * @param  {Object} documentDatabase  [the database to check]
	   * @return {Boolean} true if it exists
	   */
	  fileAlreadyExists(fileName, documentDatabase) {
	    if (documentDatabase[fileName]) {
	      return true;
	    } else {
	      return false
	    }
	  }
	}
	
	module.exports = new Util();


/***/ },
/* 5 */,
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const valid2 = __webpack_require__(7);
	const empty = __webpack_require__(8);
	const valid1 = __webpack_require__(7);
	const invalidStructure = __webpack_require__(9);
	const invalidContent = __webpack_require__(10);
	const nonString = __webpack_require__(11);
	var Index = __webpack_require__(3);
	
	describe('Read Book data', function() {
	  const index = new Index();
	
	  describe('When I upload a JSON file', () => {
	    it('should checks if its a valid JSON array', (done) => {
	      expect(index.saveUploads('invalidStructure.json', invalidStructure)).toBeFalsy();
	      done();
	    });
	    it('should check if the file is empty', (done) => {
	      expect(index.saveUploads('empty.json', empty)).toBeFalsy();
	      done();
	    });
	    it('should check if Its property values are strings', (done) => {
	      expect(index.saveUploads('nonString.json', nonString)).toBeFalsy();
	      done();
	    });
	  });
	
	  describe('When I call the getJsonDatabase function', () => {
	    it('should return the saved content', (done) => {
	      index.saveUploads('valid1.json', valid1);
	      expect(Object.keys(index.getJsonDatabase()).length).toEqual(1);
	      done();
	    });
	  });
	
	  describe('When I call the getFileName function', () => {
	    it('should return the filenames of the saved contents', (done) => {
	      index.saveUploads('valid1.json', valid1);
	      expect(Object.keys(index.getJsonDatabase()).length).toEqual(1);
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
	    it('should create an index', (done) => {
	      expect(typeof index.getIndex('valid1.json')).toEqual('object');
	      done();
	    });
	
	    it('should create an accurate index', (done) => {
	      expect(index.getIndex('valid1.json').alice[0]).toEqual(0);
	      expect(index.getIndex('valid1.json').lord[0]).toEqual(1);
	      expect(index.getIndex('valid1.json').a[1]).toEqual(1);
	      done();
	    });
	
	    it('should create an inverted index', (done) => {
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
	    it('should not overwrite an already created index', (done) => {
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
	
	  describe('When i pass a single word argument', () => {
	    it('should return the correct index', (done) => {
	      const result = index.searchIndex(['valid1.json'], 'alice');
	      expect(result).toEqual({
	        alice: {
	          'valid1.json': [0]
	        }
	      });
	      done();
	    });
	  });
	
	  describe('When i pass a single word argument with non-alphanumeric', () => {
	    it('should return the correct index', (done) => {
	      const result = index.searchIndex(['valid1.json'], '+alice-=');
	      expect(result).toEqual({
	        alice: {
	          'valid1.json': [0]
	        }
	      });
	      done();
	    });
	  });
	
	  describe('When i pass multiple words in one argument', () => {
	    it('should return the correct index of each word', (done) => {
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
	
	  describe('When i pass an argument to search for a word', () => {
	    it('should not take too long to execute', (done) => {
	      const startTime = performance.now();
	      index.searchIndex(['valid1.json'], 'alice');
	      const endTime = performance.now();
	      expect(endTime - startTime < 5000).toBeTruthy();
	      done();
	    });
	  });
	
	  describe('When i pass in varied number of argument', () => {
	    it('should return an object with the correct index of each word', (done) => {
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
	  });
	
	  describe('When i pass in an array as argument', () => {
	    it('should return the correct index of each word', (done) => {
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
	  });
	
	  describe('When i pass in a mix of array and words as argument', () => {
	    it('should return the correct index of each word', (done) => {
	      result = index.searchIndex(['valid1.json'], 'alice in', ['lord', 'town']);
	      expect(typeof result).toEqual('object');
	      done();
	    });
	  });
	});
	
	describe('Get Index', () => {
	  const index = new Index();
	  index.saveUploads('valid1.json', valid1);
	  index.createIndex('valid1.json');
	  describe('When i pass a filename', () => {
	    it('should return an object', () => {
	      expect(typeof index.getIndex('valid1.json')).toEqual('object');
	    });
	  });
	});


/***/ },
/* 7 */
/***/ function(module, exports) {

	var valid = [{
	  title: 'Alice in Wonderland',
	  text: 'Alice falls into a rabbit hole and enters a world full of imagination.'
	}, {
	  title: 'The Lord of in the Rings: The Fellowship of the Ring.',
	  text: 'An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring.'
	}];
	
	module.exports = valid;


/***/ },
/* 8 */
/***/ function(module, exports) {

	{
	}


/***/ },
/* 9 */
/***/ function(module, exports) {

	[{
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


/***/ },
/* 10 */
/***/ function(module, exports) {

	[{
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


/***/ },
/* 11 */
/***/ function(module, exports) {

	[{
	  "title": "Black Panther",
	  "text": 2
	}, {
	  "title": "Constantine: HellBlazer",
	  "text": "One man stands between Heaven and Hell. He may be our last hope"
	}, {
	  "title": "Batman: Year One",
	  "text": "A rookie BatMan, Fresh from the League of Assasins tries to find his way"
	}]


/***/ }
/******/ ])
});
;
//# sourceMappingURL=test.js.map