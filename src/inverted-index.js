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
    this.searchResult;
  }

  /**
   * [saveUploads creates a key and value object item that stores the uploaded file(s)]
   * @param  {[string]} fileName [filename]
   * @param  {[object]} jsonFile [content of uploaded json file]
   * @return {[boolean]}          [returns true on succesful addition of object to datatbase]
   */
  saveUploads(fileName, jsonFile) {
      if (!this.isValid(fileName, jsonFile)) {
        return false;
      }
      if (typeof jsonFile === 'string') {
        jsonFile = JSON.parse(jsonFile);
      }

      this.jsonDatabase[fileName] = [];
      for (const docObject in jsonFile) {
        this.jsonDatabase[fileName].push(jsonFile[docObject]);
      }
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
   * @param  {[string]}   filePath [the key(filename) of the json value to index]
   * @param  {Function} cb       [call back function to return the indexed file object and an html format index table]
   * @return {[array]}            [an arrray of of two elements: the indexed file result and the html Div of the index]
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
        concSentence = this.cleanString((`${element.title} ${element.text}`));
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
     * [isValid Check if a file is a valid json object based, calls method to check structure]
     * @param  {[type]}  fileName [the filename used to verfity is the object is already in the database]
     * @param  {[type]}  jsonFile [the json object to be tested]
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
    let isValidFile = true;

    jsonFile.forEach((document, documentIndex) => {
      const isValidTitle = document.title !== undefined && document.title.length > 0 && typeof document.title === 'string';
      const isValidText = document.text !== undefined && document.text.length > 0 && typeof document.text === 'string';
      if (!(isValidText && isValidTitle)) {
        isValidFile = false;
        return false;
      }
    });
    return isValidFile;
  }

  parseJSON(jsonFile) {
    try {
      return JSON.parse(jsonFile);
    } catch (err) {
      return true;
    }
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
   * [cleanString This method takes in a string with whitespaces, non-alphanumric characters and
   * Returns a clean version with all unecessary characters striped away]
   * @param  {[string]} theString [the string to cleanup]
   * @param  {[Regex]} theRegex  [the regex to use]
   * @return {[String]}           [A string Strpped based on the regex]
   */
  cleanString(theString, theRegex) {
    return theString.replace(theRegex, '').toLowerCase() || theString.replace(/[^a-z0-9\s]+/gi, '').toLowerCase();
  }

  /**
   * [searchIndex It searches the already indexed files for particular words]
   * @param  {[string]}    fileNames     [description]
   * @param  {Function}  cb            [description]
   * @param  {...[Array]} searchContent [the words to search for]
   * @return {[Array]}                  [an array of two elements, 1. an object with the search term as key and their locations in the array of the originally uploaded file, an html view of the result]
   */
  searchIndex(fileNames, cb, ...searchContent) {
    const searchResult = {};
    let searchTerms = searchContent.join(' ');
    if (fileNames.length < 1) {
      fileNames = this.getFilenames();
    }
    searchTerms = this.cleanString(searchTerms, /[^a-z0-9\s,]+/gi);
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
    let resultView = '';
    const termTag = ['<h3>', '</h3>'];
    const fileTag = ['<p>', '</p>'];
    const resultContainer = ["<div class='panel panel-default'>", '</div>'];
    const titleTag = ["<div class='panel-heading result-header'><h3 class='panel-title'> ", '</h3> </div>'];
    const textTag = ["<div class='panel-body'> ", '</div>'];
    for (const term in resultObject) {
      resultView += "Search Term: " + termTag[0] + term + termTag[1];
      for (const file in resultObject[term]) {
        resultView += fileTag[0] + file + fileTag[1];
        resultObject[term][file].forEach((element, index) => {
          resultView += `${resultContainer[0]} ${titleTag[0]} Index: ${index} `;
          resultView += `${jsonDatabase[file][index].title} ${titleTag[1]}`;
          resultView += textTag[0] + jsonDatabase[file][index].text + textTag[1];
          resultView += resultContainer[1] + titleTag[1];
        });
      }
    }
    return [resultObject, resultView];
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
   * @return {[boolean]}          [true if to delete both on the indexFile and jsonDatabase and false to delete only the index]
   */
  deleteIndex(fileName, option) {
      delete this.indexFile[fileName];
      if (option == true) {
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
      let indexHeadView = '';
      const cFileName = FileName.replace(/[^a-z0-9]+/gi, '');
      const htmlTop = `<div id="${cFileName}-panel" class="panel panel-default ">
                            <div class="panel-heading index-header">
                                <h4 class="panel-title">
                    <a data-toggle="collapse" data-parent="#accordion" href="#${cFileName}">${FileName}</a></h4>
                    <span class="input-group-addon create-button" onclick="callCreateIndex('${FileName}')" id="create-index">Create Index</span>
                    <span class="input-group-addon delete-button" onclick="callDeleteIndex('${FileName}')" id="delete-index">Delete Index</span></div>
                    <div id="${cFileName}" class="panel-collapse collapse in index-body">
                    <div class="panel-body"><div class="table-responsive"><table id="${cFileName}-table" class="table"></table></div></div></div></div>`;
      indexHeadView += htmlTop;
      return indexHeadView;
    }
    /**
     * [createIndexHtml Creates an html file based on the index of the provided filepath]
     * @param  {[string]} filePath  [the filename of the index]
     * @param  {[object]} indexFile [the store of all created index objects]
     * @param  {[object]} jsonDoc   [the object of the uploaded json file for the file requested]
     * @return {[array]}           [returns the index and the html panel representation of the index]
     */
  createIndexHtml(filePath, indexFile, jsonDoc) {
    let indexView = '';
    const indexPerPath = indexFile[filePath];
    indexView += `<thead> <th>#</th>`;
    indexView += `<th>word</th>`;
    jsonDoc.forEach((element, index) => {
      indexView += `<th>Doc ${index+1} </th>`;
    });
    let count = 1;
    indexView += `<tbody>`;
    for (const word in indexPerPath) {
      indexView += `<tr> <td> ${count}</td>`;
      indexView += `<td> ${word} </td>`;
      jsonDoc.forEach((element, index) => {
        if (indexPerPath[word].indexOf(index) > -1) {
          indexView += `<td>✔</td>`;
        } else {
          indexView += `<td class="neg-tick">✘</td>`;
        }
      });
      indexView += `</tr>`;
      count++;
    }
    indexView += `</tbody>`;
    return [indexPerPath, indexView];
  }


}
