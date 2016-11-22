// const invalid = 'spec/dummy-data/empty.json ';
// const empty = 'spec/dummy-data/file0.json';
// const valid1 = 'spec/dummy-data/file1.json';
// const valid2 = 'spec/dummy-data/file2.json';
// const nonString = 'spec/dummy-data/file3.json';
// const invalidContent = 'spec/dummy-data/file4.json';
// const invalidStructure = 'spec/dummy-data/file5.json';

let Index = require(__dirname + "/inverted-index-es5.js");

const invalid = "";

const empty = {};

const valid1 = [{
  "title": "Alice in Wonderland",
  "text": "Alice falls into a rabbit hole and enters a world full of imagination."
}, {
  "title": "The Lord of the Rings: The Fellowship of the Ring.",
  "text": "An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring."
}];

const valid2 = [{
  "title": "Alice in Wonderland",
  "text": "Alice falls into a rabbit hole and enters a world full of imagination."
}, {
  "title": "The Lord of the Rings: The Fellowship of the Ring.",
  "text": "An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring."
}];

const nonString = [{
  "title": "Black Panther",
  "text": 2
}, {
  "title": "Constantine: HellBlazer",
  "text": "One man stands between Heaven and Hell. He may be our last hope"
}, {
  "title": "Batman: Year One",
  "text": "A rookie BatMan, Fresh from the League of Assasins tries to find his way"
}];

const invalidContent = [{
  "title": "Black Panther",
  "text": ""
}, {
  "title": "Constantine: HellBlazer",
  "text": "One man stands between Heaven and Hell. He may be our last hope"
}, {
  "title": "Batman: Year One",
  "text": "A rookie BatMan, Fresh from the League of Assasins tries to find his way"
}];


const invalidStructure = [{
  "not-title": "Black Panther"
}, {
  "title": "Constantine: HellBlazer",
  "text": "One man stands between Heaven and Hell. He may be our last hope"
}, {
  "title": "Batman: Year One",
  "text": "A rookie BatMan, Fresh from the League of Assasins tries to find his way"
}];


function getFile(filename, cb) {
  let
    theResult = filename;
  cb(theResult);
}

describe("Read Book data", function() {
  let index = new Index();
  describe("When I upload a JSON file", function() {
    it("It should checks if its a valid JSON array", function(done) {
      getFile(invalidStructure, function(file) {
        console.log(file);
        expect(index.saveUploads("invalidStructure.json", file)).toBeFalsy();
      });
      done();

    });
    it("It should check if the file is empty", function(done) {
      getFile(invalidContent, function(file) {
        expect(index.saveUploads("empty.json", file)).toBeFalsy();
        done();
      })

    });
    it("It should check if Its property values are strings", function(done) {
      getFile(nonString, function(file) {
        expect(index.saveUploads("nonString.json", file)).toBeFalsy();
        done();
      })
    });
  });

});
describe("Populate Index", function() {
  var index = new Index();
  getFile(valid1, function(file) {
    index.saveUploads("valid1.json", file);
    index.createIndex("valid1.json", index.createIndexHtml);
  });

  describe("When I Upload a File", function() {
    it("the index is created once the JSON file has been read", function(done) {
      expect(typeof index.getIndex("valid1.json")).toEqual("object");
      done();
    });

    it("the created index should be an accurate one", function(done) {
      console.log(index.getIndex("valid1.json").alice[0]);
      expect(index.getIndex("valid1.json").alice[0]).toEqual(0);
      expect(index.getIndex("valid1.json").lord[0]).toEqual(1);
      expect(index.getIndex("valid1.json").a[1]).toEqual(1);
      done();
    });
    it("the created index should be an inverted index", function(done) {
      var verdict = true;
      var indexContent = index.indexFile["valid1.json"];

      for (value in indexContent) {

        if (!Array.isArray(indexContent[value]) || isNaN(indexContent[value][0])) {
          verdict = false;
        }
      }
      expect(verdict).toEqual(true);
      done();
    });
    it("it should not overwrite the index", function(done) {
      var indexBefore = index.getIndex("valid1.json");
      getFile(valid1, function(file) {
        var indexAfter = index.createIndex(["valid1.json"], file)[0];
      })
      indexAfter = index.getIndex("valid1.json");
      expect(indexBefore).toEqual(indexAfter);
      done();
    });

  });

});

describe("Search Index", function() {
  var index = new Index();
  getFile(valid1, function(file) {
    // console.log(index.saveUploads("valid1.json", file))
    index.saveUploads("valid1.json", file);
    index.createIndex("valid1.json", index.createIndexHtml);
    console.log(index.getIndex("valid1.json"));
  });

  describe("should return the correct result when searched", function() {
    it("for single word argument", function(done) {
      var result = index.searchIndex(["valid1.json"], index.createResultHtml, "alice");
      expect(result[0]).toEqual({ alice: { "valid1.json": [0] } });
      done();
    });
    it("for single word argument with non-alphanumeric", function(done) {
      var result = index.searchIndex(["valid1.json"], index.createResultHtml, "+alice-=");
      expect(result[0]).toEqual({ alice: { "valid1.json": [0] } });
      done();
    });

    it("It should return correct answer for multiple words in one argument", function(done) {
      var result = index.searchIndex(["valid1.json"], index.createResultHtml, "alice in");
      expect(result[0]).toEqual({ alice: { "valid1.json": [0] }, in : { "valid1.json": [0] } });
      done();
    });
  });

  it(" - The search should not take too long to execute", function(done) {
    var startTime = performance.now();
    index.searchIndex(["valid1.json"], index.createResultHtml, "alice");
    var endTime = performance.now();
    expect(endTime - startTime < 5000).toBeTruthy();
    done();
  });

  it("should accept a varied number of argument", function(done) {
    var result = index.searchIndex(["valid1.json"], index.createResultHtml, "alice in", "lord town");
    expect(typeof result[0]).toEqual("object");
    result = index.searchIndex(["valid1.json"], index.createResultHtml, "alice in", ["lord", "town"]);
    expect(typeof result[0]).toEqual("object");
    result = index.searchIndex(["valid1.json"], index.createResultHtml, "alice", "in");
    expect(result[0]).toEqual({ alice: { "valid1.json": [0] }, in : { "valid1.json": [0] } });
    done();

  });

  it("It should accept an array of argument", function(done) {
    var result = index.searchIndex(["valid1.json"], index.createResultHtml, ["alice", "in"]);
    expect(result[0]).toEqual({ alice: { "valid1.json": [0] }, in : { "valid1.json": [0] } });
    done();
  });


  it("It should accept mix of array and words as argument", function(done) {
    result = index.searchIndex(["valid1.json"], index.createResultHtml, "alice in", ["lord", "town"]);
    expect(typeof result[0]).toEqual("object");
    done();
  });

  describe("Get Index", function() {
    it("should take the filename of the indexed JSON data", function() {
      expect(typeof index.getIndex("valid1.json")).toEqual("object");
    });
  });

});
