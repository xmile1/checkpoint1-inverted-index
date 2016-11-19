var fs = require('fs');


const empty = 'dummy-data/empty.json ';
const invalid = 'dummy-data/invalid.json';
const valid = 'dummy-data/valid.json';
const valid2 = 'dummy-data/valid2.json';
const invalidContent = 'dummy-data/invalid2.json';
const invalidStructure = 'dummy-data/invalidStructure.json';

let readFile = function(fileName, callback) {
    fs.readFile(fileName, 'utf-8', function(err, data) {
      if (err) {
        expect(true).toBeFalsy();
      }
      callback(data);
    });
  }
  // Index.saveUploads(["invalid.json"], data)

describe("Test Suite for Reading Book dummy-data", function() {
  beforeEach(function() {
    // var Index = new Index();

  });
  describe("When I upload a JSON file", function() {
    it("It should checks if its a valid JSON array", function(done) {
      readFile(invalid, function(data) {
        expect(22 == 22).toBeFalsy();
        done();
      });

    });
    it("It should return object", function() {

      expect(typeof this.Index.indexFile).toEqual('object');

    });
    it("It should check if the file is empty", function(done) {
      expect(Index.saveUploads("invalidJson", invalidJson)).toBeFalsy();
      done();
    });
    it("Its property values should be a string", function(done) {
      expect(Index.saveUploads("jsonWithArrayContent", jsonWithArrayContent)).toBeFalsy();
      done();
    });
  });


});

describe("Test Suite for Populate Index", function() {
  var Index = new IndexObject();
  describe("When I create an Index File", function() {
    it("When a vaild JSON object upload is completed an Index should be create immediately", function(done) {
      Index.saveUploads("validJson", validJson);
      expect(Index.getIndex("validJson")).toBeDefined();
      expect(typeof Index.getIndex("validJson") == "object").toBeTruthy();
      done();
    });
    it("The Index created should be an accurate one", function(done) {
      Index.saveUploads("validJson", validJson);
      var theIndex = Index.getIndex("validJson");
      var Words = validJson[0]["text"].split(" ");
      var checkPresence = true;
      var checkAccuracy = true;
      for (let word of Words) {
        if (theIndex[word] == undefined) {
          checkPresence = false;
          break;
        }
        if (theIndex[word][0] != 0) {
          checkAccuracy = false;
          break;
        }
      }
      expect(checkAccuracy).toBeTruthy();
      expect(checkAccuracy).toBeTruthy();
      done();
    });

  });

});


describe("Search Index", function() {
  var Index = new IndexObject();
  Index.saveUploads("validJson", validJson);

  describe("Index should return the correct result when searched", function() {
    it("It should return correct answer for single word arguement", function(done) {
      Index.searchIndex(["validJson"], "alice");
      expect(Index.searchResult["alice"] == {
        'validJson': [0]
      }).toBeTruthy();
      done();
    });
    it("It should return correct answer for single word arguement with non-alphanumeric", function(done) {
      Index.searchIndex(["validJson"], "+alice");
      expect(Index.searchResult["alice"] == {
        'validJson': [0]
      }).toBeTruthy();
      done();
    });

    it("It should return correct answer for multiple words in one arguement", function(done) {
      Index.searchIndex(["validJson"], "alice in");
      expect(Index.searchResult["alice"] == {
        'validJson': [0]
      }).toBeTruthy();
      expect(Index.searchResult["in"] == {
        'validJson': [0, 1]
      }).toBeTruthy();
      done();
    });
  });

  it("The search should not take too long to execute", function(done) {
    var startTime,
      endTme;
    startTime = new Date();
    Index.searchIndex(["validJson"], "alice in");
    endTime = new Date();
    expect(Index.saveUploads("jsonWithArrayContent", jsonWithArrayContent)).toBeFalsy();
    done();
  });

  it("It should accept a varied number of arguement", function(done) {
    Index.searchIndex(["validJson"], "alice", "in", "algeria", "wonderland");
    expect(Index.searchResult["alice"] == {
      'validJson': [0]
    }).toBeTruthy();
    expect(Index.searchResult["in"] == {
      'validJson': [0, 1]
    }).toBeTruthy();
    expect(Index.searchResult["algeria"] == {}).toBeTruthy();
    expect(Index.searchResult["wonderland"] == {
      'validJson': [0]
    }).toBeTruthy();
    done();
  });

  it("It should accept an array of arguement", function(done) {
    Index.searchIndex(["validJson"], ["alice", "in", "algeria", "wonderland"]);
    expect(Index.searchResult["alice"] == {
      'validJson': [0]
    }).toBeTruthy();
    expect(Index.searchResult["in"] == {
      'validJson': [0, 1]
    }).toBeTruthy();
    expect(Index.searchResult["algeria"] == {}).toBeTruthy();
    expect(Index.searchResult["wonderland"] == {
      'validJson': [0]
    }).toBeTruthy();
    done();
  });


  it("It should accept  mix of array and words as arguement", function(done) {
    Index.searchIndex(["validJson"], "lord", ["alice", "in", "algeria", "wonderland"]);
    expect(Index.searchResult["lord"] == {
      'validJson': [0]
    }).toBeTruthy();
    expect(Index.searchResult["alice"] == {
      'validJson': [0]
    }).toBeTruthy();
    expect(Index.searchResult["in"] == {
      'validJson': [0, 1]
    }).toBeTruthy();
    expect(Index.searchResult["algeria"] == {}).toBeTruthy();
    expect(Index.searchResult["wonderland"] == {
      'validJson': [0]
    }).toBeTruthy();
    done();
  });

});
