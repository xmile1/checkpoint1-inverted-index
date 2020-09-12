const valid2 = require('./dummy-data/file1.js');
const empty = require('./dummy-data/empty.json');
const valid1 = require('./dummy-data/file1.js');
const invalidStructure = require('./dummy-data/file5.json');
const invalidContent = require('./dummy-data/file4.json');
const nonString = require('./dummy-data/file3.json');
var Index = require('../../src/inverted-index.js');

describe('Read Book data', function() {
  const index = new Index();

  describe('When I upload a JSON file', () => {
    it('should checks if its a valid JSON array', (done) => {
      expect(index.saveUploads('invalidStructure.json', invalidStructure)).toBeFalsy();
      done();
    });
    it('should check if the file is empty', (done) => {
      expect(index.saveUploads('empty.json', empty)).toBeFalsy();
      done();
    });
    it('should check if Its property values are strings', (done) => {
      expect(index.saveUploads('nonString.json', nonString)).toBeFalsy();
      done();
    });
  });

  describe('When I call the getJsonDatabase function', () => {
    it('should return the saved content', (done) => {
      index.saveUploads('valid1.json', valid1);
      expect(Object.keys(index.getJsonDatabase()).length).toEqual(1);
      done();
    });
  });

  describe('When I call the getFileName function', () => {
    it('should return the filenames of the saved contents', (done) => {
      index.saveUploads('valid1.json', valid1);
      expect(Object.keys(index.getJsonDatabase()).length).toEqual(1);
      done();
    });
  });
});

describe('Populate Index', () => {
  const index = new Index();
  index.saveUploads('valid1.json', valid1);
  index.saveUploads('valid2.json', valid1);
  index.createIndex('valid1.json');

  describe('When I Upload a File', () => {
    it('should create an index', (done) => {
      expect(typeof index.getIndex('valid1.json')).toEqual('object');
      done();
    });

    it('should create an accurate index', (done) => {
      expect(index.getIndex('valid1.json').alice[0]).toEqual(0);
      expect(index.getIndex('valid1.json').lord[0]).toEqual(1);
      expect(index.getIndex('valid1.json').a[1]).toEqual(1);
      done();
    });

    it('should create an inverted index', (done) => {
      let verdict = true;
      const indexContent = index.indexFile['valid1.json'];

      for (value in indexContent) {
        if (!Array.isArray(indexContent[value]) || isNaN(indexContent[value][0])) {
          verdict = false;
        }
      }
      expect(verdict).toEqual(true);
      done();
    });
    it('should not overwrite an already created index', (done) => {
      const indexBefore = index.getIndex('valid1.json');
      index.createIndex('valid2.json');
      const indexAfter = index.getIndex('valid1.json');
      expect(indexBefore).toEqual(indexAfter);
      done();
    });
  });
});

describe('Search Index', () => {
  const index = new Index();
  index.saveUploads('valid1.json', valid1);
  index.createIndex('valid1.json');

  describe('When i pass a single word argument', () => {
    it('should return the correct index', (done) => {
      const result = index.searchIndex(['valid1.json'], 'alice');
      expect(result).toEqual({
        alice: {
          'valid1.json': [0]
        }
      });
      done();
    });
  });

  describe('When i pass a single word argument with non-alphanumeric', () => {
    it('should return the correct index', (done) => {
      const result = index.searchIndex(['valid1.json'], '+alice-=');
      expect(result).toEqual({
        alice: {
          'valid1.json': [0]
        }
      });
      done();
    });
  });

  describe('When i pass multiple words in one argument', () => {
    it('should return the correct index of each word', (done) => {
      const result = index.searchIndex(['valid1.json'], 'alice in');
      expect(result).toEqual({
        alice: {
          'valid1.json': [0]
        },
        in: {
          'valid1.json': [0, 1]
        }
      });
      done();
    });
  });

  describe('When i pass an argument to search for a word', () => {
    it('should not take too long to execute', (done) => {
      const startTime = performance.now();
      index.searchIndex(['valid1.json'], 'alice');
      const endTime = performance.now();
      expect(endTime - startTime < 5000).toBeTruthy();
      done();
    });
  });

  describe('When i pass in varied number of argument', () => {
    it('should return an object with the correct index of each word', (done) => {
      let result = index.searchIndex(['valid1.json'], 'alice in', 'lord town');
      expect(typeof result).toEqual('object');
      result = index.searchIndex(['valid1.json'], 'alice in', ['lord', 'town']);
      expect(typeof result).toEqual('object');
      result = index.searchIndex(['valid1.json'], 'enters', 'and');
      expect(result).toEqual({
        enters: {
          'valid1.json': [0]
        },
        and: {
          'valid1.json': [0, 1]
        }
      });
      done();
    });
  });

  describe('When i pass in an array as argument', () => {
    it('should return the correct index of each word', (done) => {
      const result = index.searchIndex(['valid1.json'], ['full', 'seek']);
      expect(result).toEqual({
        full: {
          'valid1.json': [0]
        },
        seek: {
          'valid1.json': [1]
        }
      });
      done();
    });
  });

  describe('When i pass in a mix of array and words as argument', () => {
    it('should return the correct index of each word', (done) => {
      result = index.searchIndex(['valid1.json'], 'alice in', ['lord', 'town']);
      expect(typeof result).toEqual('object');
      done();
    });
  });
});

describe('Get Index', () => {
  const index = new Index();
  index.saveUploads('valid1.json', valid1);
  index.createIndex('valid1.json');
  describe('When i pass a filename', () => {
    it('should return an object', () => {
      expect(typeof index.getIndex('valid1.json')).toEqual('object');
    });
  });
});
