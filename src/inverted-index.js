class Index {

  constructor() {
    this.jsonDatabase = {};
    this.indexFile = {};
    this.searchResult;
  }

  saveUploads(fileName, jsonFile) {
    // console.log(jsonFile);
    // console.log(JSON.parse(jsonFile));


    // jsonFile = JSON.parse(JSON.stringify(jsonFile));
    if (this.jsonDatabase[fileName]) {
      return ("File Already Exist in DataBase");
    }
    this.jsonDatabase[fileName] = [];

    for (let docObject in jsonFile) {
      this.jsonDatabase[fileName].push(jsonFile[docObject]);
    }
    // this.createIndex(fileName);

  }


  getjsonDatabase() {
    return this.jsonDatabase;
  }

  createIndex(filePath, jsonFile, cb) {
    this.saveUploads(filePath, jsonFile)
    let indexFile = this.indexFile;
    const jsonDatabase = this.jsonDatabase[filePath];
    let concSentence = "";
    let wordArray = [];
    indexFile[filePath] = {};
    jsonDatabase.forEach((element, index) => {
      concSentence = this.cleanString((`${element.title} ${element.text}`));
      wordArray = new Set(concSentence.split(" "));
      wordArray.forEach(word => {
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



  createIndexHtml(indexFile, jsonDatabase) {
    let indexView = "";
    let headContainer = [`<div class="panel-group">
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <h4 class="panel-title">
                    <a data-toggle="collapse" data-parent="#accordion" href="#collapse1">`, `</a>
                  </h4>
                            </div>`];
    let bodyContainer = [`<div id="collapse1" class="panel-collapse collapse in">
                                <div class="panel-body">
                                    <div class="table-responsive">
                                        <table class="table">`, `</table></div></div></div>`]
    let headTag = ["<thead>", "</thead>"];
    let rowTag = ["<tr>", "</tr>"];
    let tdTag = ["<td>", "</td>"];
    let headDataTag = ["<th>", "</th>"];
    let bodyTag = ["<tbody>", "</tbody>"];

    for (let filename in indexFile) {
      console.log(indexFile[filename]);
      indexView += headContainer[0] + filename + headContainer[1] + bodyContainer[0] + headTag[0];
      indexView += headDataTag[0] + "#" + headDataTag[1];
      indexView += headDataTag[0] + "word" + headDataTag[1];

      jsonDatabase.forEach(function(element, index) {
        indexView += headDataTag[0] + "Doc " + index + headDataTag[1];
      });
      let count = 0;
      for (let word in indexFile[filename]) {
        indexView += rowTag[0] + tdTag[0] + count + tdTag[1];
        indexView += tdTag[0] + word + tdTag[1];
        let counter = 0
        jsonDatabase.forEach(function(element, index) {
          console.log(index);
          if (indexFile[filename][word].indexOf(index) > -1) {
            indexView += tdTag[0] + "gud" + tdTag[1];
          } else {
            indexView += tdTag[0] + "bad" + tdTag[1];
          }
          // indexView += headDataTag[0] + index + headDataTag[1];

        });

        indexView += rowTag[1]
        count++;
      }
      indexView += headContainer[1];
    }
    return [indexFile, indexView];

  }



}




var thisindex = new Index();
var theJSON = [{
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
