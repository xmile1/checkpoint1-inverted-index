class Index {

  constructor() {
    this.jsonDatabase = {};
    this.indexFile = {};
    this.searchResult;
  }

  saveUploads(fileName, jsonFile) {
    // console.log(jsonFile);
    // console.log(JSON.parse(jsonFile));
    if (!this.isValid) {
      return false;
    }
    jsonFile = this.parseJSON(jsonFile);
    this.jsonDatabase[fileName] = [];
    console.log(jsonFile);
    for (let docObject in jsonFile) {
      console.log(docObject);
      this.jsonDatabase[fileName].push(jsonFile[docObject]);
    }
    // this.createIndex(fileName);
    return true;
  }


  getjsonDatabase() {
    return this.jsonDatabase;
  }

  createIndex(filePath, cb) {

    let indexFile = this.indexFile;
    const jsonDoc = this.jsonDatabase[filePath];
    let concSentence = "";
    let wordArray = [];
    if (indexFile[filePath]) {
      return false;
    }
    indexFile[filePath] = {};
    jsonDoc.forEach((element, index) => {
      concSentence = this.cleanString((`${element.title} ${element.text}`));
      wordArray = new Set(concSentence.split(" "));
      wordArray.forEach(word => {
        indexFile[filePath][word] = indexFile[filePath][word] || [];
        indexFile[filePath][word].push(index);
      });
    });
    this.indexFile = indexFile;
    return cb(filePath, indexFile, jsonDoc);
    // console.log(indexFile);
  }

  isValid() {
    var parsedFile = this.parseJSON(jsonFile);
    var isValidFileStructure = this.checkFileStructure(parsedFile);
    if (parsedFile && parsedFile.length > 0 && isValidFileStructure) {
      if (!this.jsonDatabase[fileName]) {
        return true;
      }
    }
    return false;
  }

  checkFileStructure(jsonFile) {
    let isValidFile = true;
    jsonFile.forEach(function(document, documentIndex) {
      let isValidTitle = document.title !== undefined && document.title.length > 0 && typeof document.title === 'string';
      let isValidText = document.text !== undefined && document.text.length > 0 && typeof document.text === 'string';
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
      return false;
    }
  };


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


  searchIndex(fileNames, cb, ...searchContent) {
    if (fileNames.length < 1) {
      fileNames = this.getFilenames();
    }
    let searchResult = {};
    let searchTerms = searchContent.join(" ");
    searchTerms = this.cleanString(searchTerms, /[^a-z0-9\s,]+/gi);
    searchTerms = searchTerms.split(/[,\s]/);
    searchTerms.forEach(searchTerm => {
      searchResult[searchTerm] = {};
      fileNames.forEach(fileName => {
        if (this.indexFile[fileName][searchTerm]) {
          searchResult[searchTerm][fileName] = this.indexFile[fileName][searchTerm];
        }
      });
    });
    this.searchResult = searchResult;
    console.log(searchResult);
    return cb(searchResult, this.jsonDatabase);
  }



  createResultHtml(resultObject, jsonDatabase) {
    let resultView = "";
    let termTag = ["<h3>", "</h3>"];
    let fileTag = ["<p>", "</p>"];
    let resultContainer = ["<div class='panel panel-default'>", "</div>"];
    let titleTag = ["<div class='panel-heading'><h3 class='panel-title'> ", "</h3> </div>"];
    let textTag = ["<div class='panel-body'> ", "</div>"];
    for (let term in resultObject) {
      resultView += termTag[0] + term + termTag[1];
      for (let file in resultObject[term]) {
        resultView += fileTag[0] + file + fileTag[1];
        resultObject[term][file].forEach(function(element, index) {
          resultView += `${resultContainer[0]} ${titleTag[0]} Index: ${index} `;
          resultView += `${jsonDatabase[file][index]["title"]} ${titleTag[1]}`;
          resultView += textTag[0] + jsonDatabase[file][index]["text"] + textTag[1];
          resultView += resultContainer[1] + titleTag[1];
        });
      }


    }
    return [resultObject, resultView];
  }

  //Sample Structure of this.indexFile
  //({ 'books.json': { alice: [0], in : [0, 1], wonderland: [0], falls: [0], into: [0], a: [0, 1], rabbit: [0], hole: [0], and: [0, 1], enters: [0], world: [0], full: [0], of: [0, 1], 'imagination.': [0], the: [1], lord: [1], 'rings:': [1], fellowship: [1], 'ring.': [1], an: [1], unusual: [1], alliance: [1], 'man,': [1], 'elf,': [1], 'dwarf,': [1], wizard: [1], hobbit: [1], seek: [1], to: [1], destroy: [1], powerful: [1] } })

  //Sample Structure of this.jsonDatabase
  // ({ 'books.json': [{ title: "Alice in Wonderland", text: "Alice falls into a rabbit hole and enters a world full of imagination." }, { title: "The Lord of the Rings: The Fellowship of the Ring.", text: "An unusual alliance in of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring." }], 'book2.json': [{ title: "Alice in Wonderland", text: "Alice falls into a rabbit hole and enters a world full of imagination." }, { title: "The Lord of the Rings: The Fellowship of the Ring.", text: "An unusual alliance in of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring." }] })

  getFilenames() {
    return Object.keys(this.jsonDatabase);
  }

  deleteIndex(fileName, option) {
    delete this.indexFile[fileName];
    if (option == true) {
      delete this.jsonDatabase[fileName];
    }

  }
  createIndexHeader(FileName) {
    let indexHeadView = "";
    let cFileName = FileName.replace(/[^a-z0-9]+/gi, "");
    let htmlTop = `<div id="${cFileName}-panel" class="panel panel-default">
                            <div class="panel-heading">
                                <h4 class="panel-title">
                    <a data-toggle="collapse" data-parent="#accordion" href="#${cFileName}">${FileName}</a></h4><span class="input-group-addon" onclick="callCreateIndex('${FileName}')" style="cursor:pointer" id="create-index">Create Index</span><span class="input-group-addon" style="cursor:pointer" onclick="callDeleteIndex('${FileName}')" id="delete-index">Delete Index</span></div><div id="${cFileName}" class="panel-collapse collapse in"><div class="panel-body"><div class="table-responsive"><table id="${cFileName}-table" class="table"></table></div></div></div></div>`;
    indexHeadView += htmlTop;

    return indexHeadView;
  }

  createIndexHtml(filePath, indexFile, jsonDoc) {
    let indexView = "";
    let indexPerPath = indexFile[filePath];
    for (let filename in indexFile) {
      let cFilename = filePath.replace(/[^a-z0-9]+/gi, "");
      let headTag = ["<thead>", "</thead>"];
      let rowTag = ["<tr>", "</tr>"];
      let tdTag = ["<td>", "</td>"];
      let headDataTag = ["<th>", "</th>"];
      let bodyTag = ["<tbody>", "</tbody>"];

      indexView += headTag[0] + headDataTag[0] + "#" + headDataTag[1];
      indexView += headDataTag[0] + "word" + headDataTag[1];

      jsonDoc.forEach(function(element, index) {
        indexView += headDataTag[0] + "Doc " + index + headDataTag[1];
      });
      let count = 0;
      indexView += bodyTag[0];
      for (let word in indexPerPath) {
        indexView += rowTag[0] + tdTag[0] + count + tdTag[1];
        indexView += tdTag[0] + word + tdTag[1];
        console.log(jsonDoc);
        jsonDoc.forEach(function(element, index) {
          if (indexPerPath[word].indexOf(index) > -1) {
            indexView += tdTag[0] + "gud" + tdTag[1];
          } else {
            indexView += tdTag[0] + "bad" + tdTag[1];
          }
        });

        indexView += rowTag[1];
        count++;
      }
      indexView += bodyTag[1];
    }

    return [indexPerPath, indexView];

  }





  // createIndexHtml(indexFile, jsonDatabase) {
  //     let indexView = "";
  //     let headContainer = [`<div class="panel panel-default">
  //                             <div class="panel-heading">
  //                                 <h4 class="panel-title">
  //                     <a data-toggle="collapse" data-parent="#accordion" href="#`, `">`, `</a>
  //                   </h4>`,
  //       `</div>`
  //     ];
  //     let createIndexButton = [`<span class="input-group-addon" onclick="callCreateIndex('`, `')" cursor="pointer" id="create-index">Create Index</span>`];
  //     let deleteIndexButton = [`<span class="input-group-addon" cursor="pointer" onclick="callDeleteIndex('`, `')" id="delete-index">Delete Index</span>`];

  //     let bodyContainer = [`<div id="`, `" class="panel-collapse collapse in">
  //                                 <div class="panel-body">
  //                                     <div class="table-responsive">
  //                                         <table class="table">`, `</table></div></div></div>`]
  //     let headTag = ["<thead>", "</thead>"];
  //     let rowTag = ["<tr>", "</tr>"];
  //     let tdTag = ["<td>", "</td>"];
  //     let headDataTag = ["<th>", "</th>"];
  //     let bodyTag = ["<tbody>", "</tbody>"];

  //     for (let filename in indexFile) {
  //       indexView += headContainer[0] + filename.replace(".", "") + headContainer[1] + filename + headContainer[2];
  //       indexView += createIndexButton[0] + filename + createIndexButton[1];
  //       indexView += deleteIndexButton[0] + filename + deleteIndexButton[1];
  //       indexView += headContainer[3] + bodyContainer[0] + filename.replace(".", "") + bodyContainer[1] + headTag[0];
  //       indexView += headDataTag[0] + "#" + headDataTag[1];
  //       indexView += headDataTag[0] + "word" + headDataTag[1];

  //       jsonDatabase.forEach(function(element, index) {
  //         indexView += headDataTag[0] + "Doc " + index + headDataTag[1];
  //       });
  //       let count = 0;
  //       for (let word in indexFile[filename]) {
  //         indexView += rowTag[0] + tdTag[0] + count + tdTag[1];
  //         indexView += tdTag[0] + word + tdTag[1];
  //         jsonDatabase.forEach(function(element, index) {
  //           console.log(index);
  //           if (indexFile[filename][word].indexOf(index) > -1) {
  //             indexView += tdTag[0] + "gud" + tdTag[1];
  //           } else {
  //             indexView += tdTag[0] + "bad" + tdTag[1];
  //           }
  //         });

  //         indexView += rowTag[1]
  //         count++;
  //       }
  //       indexView += bodyContainer[2] + headContainer[3];
  //     }
  //     console.log(indexView);
  //     return [indexFile, indexView];

  //   }





}




let thisindex = new Index();
let theJSON = [{
    "title": "Alice in Wonderland",
    "text": "Alice falls into a rabbit hole and enters a world full of imagination."
  },

  {
    "title": "The Lord of the Rings: The Fellowship of the Ring.",
    "text": "An unusual alliance in of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring."
  }
];

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
