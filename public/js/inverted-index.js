"use strict";
/**
 *Seach Index class 
 */
class Index {
  /**
   *
   
   */
  constructor() {
    this.jsonDatabase = {};
    this.indexFile = {};
    this.searchResult
  }

  saveUploads(fileName, jsonFile, overwrite) {
    // if (!this.authenticateJson(jsonFile)) {
    //   return false;
    // }

    jsonFile = JSON.parse(jsonFile)
      /**Check if File Already Exists in jsonDataBase
       * and if user gave permission to overwrite
       */
    if (this.jsonDatabase[fileName] && !overwrite) {
      return ("File Already Exist in DataBase");
    }
    this.jsonDatabase[fileName] = [];

    for (var docObject in jsonFile) {
      /*add each document to be indexed from .json file to temporary storage
       * using fileName as key. 
       */
      this.jsonDatabase[fileName].push(jsonFile[docObject]);
    }
    this.createIndex(fileName);
    return true;
  }


  getjsonDatabase() {
    return this.jsonDatabase;
  }

  // authenticateJson(jsonFile) {
  //     var checkType = JSON.parse(jsonFile);
  //     if (checkType) {
  //       return true;
  //     }
  //   }

  /**
   *Create 
   */
  createIndex(filePath) {
    var localIndexFile = this.indexFile;
    var jsDb = this.jsonDatabase[filePath];
    var concSentence = "";
    var wordArray = [];
    localIndexFile[filePath] = {};
    jsDb.forEach((element, index) => {
      concSentence = this.cleanString((element.title + " " + element.text));
      wordArray = new Set(concSentence.split(" "));
      wordArray.forEach(word => {
        localIndexFile[filePath][word] = localIndexFile[filePath][word] || [];
        localIndexFile[filePath][word].push(index);
      });
    });
    this.indexFile = localIndexFile;
  }


  /**
   * @param  {filename}
   * @return {indexFile}
   */
  getIndex(fileName) {
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
  cleanString(theString, theRegex) {

    return theString.replace(theRegex, '').toLowerCase() || theString.replace(/[^a-z0-9\s]+/gi, '').toLowerCase();
  }


  // {
  //   'book.json': {
  //     'alice': [0, 1]
  //   }
  // }


  searchIndex(fileNames, searchContent) {
    this.searchResult = {};
    if (Array.isArray(searchContent)) {
      searchContent = searchContent.join(" ");
    }
    if (Object.keys(arguments).length > 2) {
      for (let index in arguments) {
        if (parseInt(index) > 1) {
          searchContent += " " + arguments[index];
        }
      }

    }
    searchContent = this.cleanString(searchContent, /[^a-z0-9\s,]+/gi);
    var searchTerms = searchContent.split(/[,\s]/);
    searchTerms.forEach(searchTerm => {
      this.searchResult[searchTerm] = {};
      fileNames.forEach(fileName => {
        if (this.indexFile[fileName][searchTerm]) {
          this.searchResult[searchTerm][fileName] = this.indexFile[fileName][searchTerm];
        }

      });

    });
  }

}


// var thisindex = new Index();
// var theJSON = [{
//     "title": "Alice in Wonderland",
//     "text": "Alice falls into a rabbit hole and enters a world full of imagination."
//   },

//   {
//     "title": "The Lord of the Rings: The Fellowship of the Ring.",
//     "text": "An unusual alliance in of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring."
//   }
// ];

// thisindex.saveUploads("books.json", theJSON);
// thisindex.saveUploads("books1.json", theJSON);
// // thisindex.createIndex("books.json")
// // thisindex.createIndex("books1.json")
// thisindex.searchIndex(["books.json"], "lord", ["alice", "in", "algeria", "wonderland"]);
// // startTime = performance.now();
// // index.searchIndex(["validJson"], "alice in");
// // endTime = performance.now();
// console.log(thisindex.searchResult);
