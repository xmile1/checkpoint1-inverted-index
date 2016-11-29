/******/ (function(modules) { // webpackBootstrap
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

	let utils = __webpack_require__(1);
	let  utilsInstance = new utils();
	/**
	 * A class for Creating and searching an inverted index
	 */
	class Index {
	
	  /**
	   * [constructor Creates Object variables to hold
	   * 1. [jsonDatabase] Uploaded files
	   * 2. [indexFile] the indexed filenames and their contents
	   * 3. [searchResult] the search results
	   * @return {[type]} [description]
	   */
	  constructor() {
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
	  saveUploads(fileName, jsonFile) {
	    if (!utilsInstance.isValid(fileName, jsonFile)) {
	      return false;
	    }
	    if (typeof jsonFile === 'string') {
	      jsonFile = JSON.parse(jsonFile);
	    }
	
	    this.jsonDatabase[fileName] = [];
	    Object.keys(jsonFile).forEach((keys) => {
	      this.jsonDatabase[fileName].push(jsonFile[keys]);
	    });
	    // for (const docObject in jsonFile) {
	
	    // }
	    return true;
	  }
	    /**
	     * [getjsonDatabase function to return the saved uploads]
	     * @return {[object]} [the saved uploads]
	     */
	  getJsonDatabase() {
	    return this.jsonDatabase;
	  }
	
	  /**
	   * [createIndex Creates an index of the words in the received json file]
	   * @param  {string}   fileName [the key(filename) of the json value to index]
	   * @param  {Function} cb  [call back to return the indexed file object/an html format index table]
	   * @return {[array]} [an arrray of the indexed file result and the html Div of the index]
	   */
	  createIndex(fileName, cb) {
	    const indexFile = this.indexFile;
	    const jsonDoc = this.jsonDatabase[fileName];
	    let mergedContent = '';
	    let wordArray = [];
	    if (indexFile[fileName]) {
	      return false;
	    }
	    indexFile[fileName] = {};
	
	    jsonDoc.forEach((element, index) => {
	      mergedContent = utilsInstance.cleanString((`${element.title} ${element.text}`));
	      wordArray = new Set(mergedContent.split(' '));
	      wordArray.forEach((word) => {
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
	  getIndex(fileName) {
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
	  searchIndex(fileNames, cb, ...searchContent) {
	    const searchResult = {};
	    let searchTerms = searchContent.join(' ');
	    if (fileNames.length < 1) {
	      fileNames = this.getFilenames();
	    }
	    searchTerms = utilsInstance.cleanString(searchTerms, /[^a-z0-9\s,]+/gi);
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
	    return cb(searchResult, this.jsonDatabase);
	  }
	
	  /**
	   * [createResultHtml Creates an html view based the result of the index search]
	   * @param  {[object]} resultObject [the result of the index search]
	   * @param  {[object]} jsonDatabase [the json database containing the original Uploaded object]
	   * @return {[ogject]}              [returns the search result and the Html view]
	   */
	  createResultHtml(resultObject, jsonDatabase) {
	    this.resultView = '';
	    const termTag = ['<h3>', '</h3>'];
	    const fileTag = ['<p>', '</p>'];
	    const resultContainer = ["<div class='panel panel-default'>", '</div>'];
	    const titleTag = ["<div class='panel-heading result-header'><h3 class='panel-title'> ", '</h3> </div>'];
	    const textTag = ["<div class='panel-body'> ", '</div>'];
	
	    Object.keys(resultObject).forEach((term) => {
	      this.resultView += `Search Term: ${termTag[0]}${term}${termTag[1]}`;
	      Object.keys(resultObject[term]).forEach((file) => {
	        this.resultView += fileTag[0] + file + fileTag[1];
	        resultObject[term][file].forEach((element, index) => {
	          this.resultView += `${resultContainer[0]} ${titleTag[0]} Index: ${index} `;
	          this.resultView += `${jsonDatabase[file][index].title} ${titleTag[1]}`;
	          this.resultView += textTag[0] + jsonDatabase[file][index].text + textTag[1];
	          this.resultView += resultContainer[1] + titleTag[1];
	        });
	      });
	    });
	    return [resultObject, this.resultView];
	  }
	
	  /**
	   * [getFilenames returns the filenames of all files present in the object]
	   * @return {[array]} [an array of filenames]
	   */
	  getFilenames() {
	    return Object.keys(this.jsonDatabase);
	  }
	
	  /**
	   * [deleteIndex Deletes an index file from the index object]
	   * @param  {[string]} fileName [the filename(key) of the data to delete]
	   * @param  {[boolean]} option   [determines if to delete the index only or also the json file]
	   * @return {[boolean]}  [true to delete indexFile and jsonDatabase/false to delete only the index]
	   */
	  deleteIndex(fileName, option) {
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
	  createIndexHeader(FileName) {
	    this.indexHeadView = '';
	    const cFileName = FileName.replace(/[^a-z0-9]+/gi, '');
	    const htmlTop = `<div id="${cFileName}-panel" class="panel panel-default ">
	                            <div class="panel-heading index-header">
	                                <h4 class="panel-title">
	                    <a data-toggle="collapse" data-parent="#accordion" href="#${cFileName}">${FileName}</a></h4>
	                    <span class="input-group-addon create-button" onclick="callCreateIndex('${FileName}')" id="create-index">Create Index</span>
	                    <span class="input-group-addon delete-button" onclick="callDeleteIndex('${FileName}')" id="delete-index">Delete Index</span></div>
	                    <div id="${cFileName}" class="panel-collapse collapse in index-body">
	                    <div class="panel-body"><div class="table-responsive"><table id="${cFileName}-table" class="table"></table></div></div></div></div>`;
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
	  createIndexHtml(filePath, indexFile, jsonDoc) {
	    this.indexView = '';
	    const indexPerPath = indexFile[filePath];
	    this.indexView += '<thead> <th>#</th>';
	    this.indexView += '<th>word</th>';
	    jsonDoc.forEach((element, index) => {
	      this.indexView += `<th>Doc ${index + 1} </th>`;
	    });
	    let count = 1;
	    this.indexView += '<tbody>';
	    Object.keys(indexPerPath).forEach((word) => {
	      this.indexView += `<tr> <td> ${count}</td>`;
	      this.indexView += `<td> ${word} </td>`;
	      jsonDoc.forEach((element, index) => {
	        if (indexPerPath[word].indexOf(index) > -1) {
	          this.indexView += '<td>✔</td>';
	        } else {
	          this.indexView += '<td class="neg-tick">✘</td>';
	        }
	      });
	      this.indexView += '</tr>';
	      count = +1;
	    });
	
	    this.indexView += '</tbody>';
	    return [indexPerPath, this.indexView];
	  }
	}
	module.exports = new Index();
	
	
	var i = new Index();


/***/ },
/* 1 */
/***/ function(module, exports) {

	/**
	 * [parseJSON converts sting to a Json object]
	 * @param  {string} jsonFile
	 * @return {object || boolean}  [the parsed file or false on error]
	 */
	  class util{
	
	  parseJSON(jsonFile) {
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
	        if (!this.jsonDatabase[fileName]) {
	          return true;
	        }
	      }
	    }
	    return false;
	  }
	
	
	    /**
	     * [checkFileStructure Checks if object follows the structure as found in ./jasmine/books.json]
	     * @param  {[object]} jsonFile [json file to be tested]
	     * @return {[boolean]}          [true if valid and false if invalid]
	     */
	  checkFileStructure(jsonFile) {
	    this.isValidFile = true;
	
	    jsonFile.forEach((document) => {
	      const isValidTitle = document.title !== undefined && document.title.length > 0 && typeof document.title === 'string';
	      const isValidText = document.text !== undefined && document.text.length > 0 && typeof document.text === 'string';
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
	   * @param  {[string]} theString [the string to cleanup]
	   * @param  {[Regex]} theRegex  [the regex to use]
	   * @return {[String]}           [A string Strpped based on the regex]
	   */
	  cleanString(theString, theRegex) {
	    return theString.replace(theRegex, '').toLowerCase() || theString.replace(/[^a-z0-9\s]+/gi, '').toLowerCase();
	  }
	}
	module.exports = util;


/***/ }
/******/ ]);
//# sourceMappingURL=31ce7ffc070d4f2ef5b0.js.map