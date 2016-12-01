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
    this.indexView = '';
  }

  /**
   * [saveUploads creates a key and value object item that stores the uploaded file(s)]
   * @param  {[string} fileName [filename]
   * @param  {[object]} jsonFile [content of uploaded json file]
   * @return {[boolean]}          [returns true on succesful addition of object to datatbase]
   */
  saveUploads(fileName, jsonFile) {
    if (!view.isValid(fileName, jsonFile)) {
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
     * [getjsonDatabase function to return the saved uploads]
     * @return {[object]} [the saved uploads]
     */
  getjsonDatabase() {
    return this.jsonDatabase;
  }

  /**
   * [createIndex Creates an index of the words in the received json file]
   * @param  {string}   filePath [the key(filename) of the json value to index]
   * @param  {Function} cb  [call back to return the indexed file object/an html format index table]
   * @return {[array]} [an arrray of the indexed file result and the html Div of the index]
   */
  createIndex(filePath, cb) {
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
    return cb(filePath, indexFile, jsonDoc);
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
    return cb(searchResult, this.jsonDatabase);
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

}
