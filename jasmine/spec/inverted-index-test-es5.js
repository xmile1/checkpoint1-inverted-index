(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/** @type {String} [description] -------------------------------------------------------------- */
const invalid = '';
const empty = {};
const valid1 = [{
  title: 'Alice in Wonderland',
  text: 'Alice falls into a rabbit hole and enters a world full of imagination.'
}, {
  title: 'The Lord of the Rings: The Fellowship of the Ring.',
  text: 'An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring.'
}];
const valid2 = [{
  title: 'Alice in Wonderland',
  text: 'Alice falls into a rabbit hole and enters a world full of imagination.'
}, {
  title: 'The Lord of the Rings: The Fellowship of the Ring.',
  text: 'An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring.'
}];
const nonString = [{
  title: 'Black Panther',
  text: 2
}, {
  title: 'Constantine: HellBlazer',
  text: 'One man stands between Heaven and Hell. He may be our last hope'
}, {
  title: 'Batman: Year One',
  text: 'A rookie BatMan, Fresh from the League of Assasins tries to find his way'
}];

const invalidContent = [{
  title: 'Black Panther',
  text: ''
}, {
  title: 'Constantine: HellBlazer',
  text: 'One man stands between Heaven and Hell. He may be our last hope'
}, {
  title: 'Batman: Year One',
  text: 'A rookie BatMan, Fresh from the League of Assasins tries to find his way'
}];

const invalidStructure = [{
  'not-title': 'Black Panther'
}, {
  title: 'Constantine: HellBlazer',
  text: 'One man stands between Heaven and Hell. He may be our last hope'
}, {
  title: 'Batman: Year One',
  text: 'A rookie BatMan, Fresh from the League of Assasins tries to find his way'
}];
/**
 * Dummy Data for Test End --------------------------------------------------------------
 */

function getFile(filename, cb) {
  const theResult = filename;
  cb(theResult);
}

describe('Read Book data', function() {
  const index = new Index();
  describe('When I upload a JSON file', () => {
    it('It should checks if its a valid JSON array', (done) => {
      getFile(invalidStructure, (file) => {
        expect(index.saveUploads('invalidStructure.json', file)).toBeFalsy();
      });
      done();
    });
    it('It should check if the file is empty', (done) => {
      getFile(invalidContent, (file) => {
        expect(index.saveUploads('empty.json', file)).toBeFalsy();
        done();
      });
    });
    it('It should check if Its property values are strings', (done) => {
      getFile(nonString, (file) => {
        expect(index.saveUploads('nonString.json', file)).toBeFalsy();
        done();
      });
    });
    it('get json database should return the saved content', (done) => {
      getFile(valid1, (file) => {
        index.saveUploads('valid1.json', file);
        expect(Object.keys(index.getjsonDatabase()).length).toEqual(1);
        done();
      });
    });
    it('getfilename should return the filenames of the saved contents', (done) => {
      getFile(valid1, (file) => {
        index.saveUploads('valid1.json', file);
        expect(index.getFilenames()).toEqual(['valid1.json']);
        done();
      });
    });
  });
});
describe('Populate Index', () => {
  const index = new Index();
  getFile(valid1, (file) => {
    index.saveUploads('valid1.json', file);
    index.createIndex('valid1.json', index.createIndexHtml);
  });

  describe('When I Upload a File', () => {
    it('the index is created once the JSON file has been read', (done) => {
      expect(typeof index.getIndex('valid1.json')).toEqual('object');
      done();
    });

    it('the created index should be an accurate one', (done) => {
      expect(index.getIndex('valid1.json').alice[0]).toEqual(0);
      expect(index.getIndex('valid1.json').lord[0]).toEqual(1);
      expect(index.getIndex('valid1.json').a[1]).toEqual(1);
      done();
    });
    it('the created index should be an inverted index', (done) => {
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
    it('it should not overwrite the index', (done) => {
      const indexBefore = index.getIndex('valid1.json');
      getFile(valid1, (file) => {
        const indexAfter = index.createIndex(['valid1.json'], file)[0];
      });
      indexAfter = index.getIndex('valid1.json');
      expect(indexBefore).toEqual(indexAfter);
      done();
    });
  });
});

describe('Search Index', () => {
  const index = new Index();
  getFile(valid1, (file) => {
    index.saveUploads('valid1.json', file);
    index.createIndex('valid1.json', index.createIndexHtml);
  });

  describe('should return the correct result when searched', () => {
    it('for single word argument', (done) => {
      const result = index.searchIndex(['valid1.json'], index.createResultHtml, 'alice');
      expect(result[0]).toEqual({ alice: { 'valid1.json': [0] } });
      done();
    });
    it('for single word argument with non-alphanumeric', (done) => {
      const result = index.searchIndex(['valid1.json'], index.createResultHtml, '+alice-=');
      expect(result[0]).toEqual({ alice: { 'valid1.json': [0] } });
      done();
    });

    it('It should return correct answer for multiple words in one argument', (done) => {
      const result = index.searchIndex(['valid1.json'], index.createResultHtml, 'alice in');
      expect(result[0]).toEqual({ alice: { 'valid1.json': [0] }, in : { 'valid1.json': [0] } });
      done();
    });
  });

  it(' - The search should not take too long to execute', (done) => {
    const startTime = performance.now();
    index.searchIndex(['valid1.json'], index.createResultHtml, 'alice');
    const endTime = performance.now();
    expect(endTime - startTime < 5000).toBeTruthy();
    done();
  });

  it('should accept a varied number of argument', (done) => {
    let result = index.searchIndex(['valid1.json'], index.createResultHtml, 'alice in', 'lord town');
    expect(typeof result[0]).toEqual('object');
    result = index.searchIndex(['valid1.json'], index.createResultHtml, 'alice in', ['lord', 'town']);
    expect(typeof result[0]).toEqual('object');
    result = index.searchIndex(['valid1.json'], index.createResultHtml, 'alice', 'in');
    expect(result[0]).toEqual({ alice: { 'valid1.json': [0] }, in : { 'valid1.json': [0] } });
    done();
  });

  it('It should accept an array of argument', (done) => {
    const result = index.searchIndex(['valid1.json'], index.createResultHtml, ['alice', 'in']);
    expect(result[0]).toEqual({ alice: { 'valid1.json': [0] }, in : { 'valid1.json': [0] } });
    done();
  });


  it('It should accept mix of array and words as argument', (done) => {
    result = index.searchIndex(['valid1.json'], index.createResultHtml, 'alice in', ['lord', 'town']);
    expect(typeof result[0]).toEqual('object');
    done();
  });

  describe('Get Index', () => {
    it('should take the filename of the indexed JSON data', () => {
      expect(typeof index.getIndex('valid1.json')).toEqual('object');
    });
  });
});

},{}]},{},[1])