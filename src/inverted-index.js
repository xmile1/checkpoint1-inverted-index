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
