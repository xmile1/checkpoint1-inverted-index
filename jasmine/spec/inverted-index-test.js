// "use strict"

// var IndexObject = require("../../src/inverted-index.js");
// var chai = require('chai');
// var expect = chai.expect;


/************************************* Dummy JSON data for test ***********************************************/
var emptyJson = {};
var validJson = [{
  "title": "Alice in Wonderland",
  "text": "Alice falls into a rabbit hole and enters a world full of imagination."
}, {
  "title": "The Lord of the Rings: The Fellowship of the Ring.",
  "text": "An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring."
}];
var invalidJson = "'title': 'Alice in Wonderland";

var JsonWithArrayContent = [{
  "title": "Alice in Wonderland",
  "text": ["this is an array", "and We dont Allow such"]
}, {
  "title": "The Lord of the Rings: The Fellowship of the Ring.",
  "text": "An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring."
}];
/****************************** Dummy JSON data for test ********************************************************/

describe("Tdemo", function() {



      describe("Test Suite for Reading Book Data", function() {

        beforeEach(function() {
          var Index = new Index();
        });
        describe("When I upload a JSON file", function() {
          it("It should checks if its a valid JSON array", function(done) {
            expect(Index.saveUploads("invalidJson", invalidJson)).toBeFalsy();
            done();
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
