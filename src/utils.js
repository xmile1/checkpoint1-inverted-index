/* eslint class-methods-use-this: 0*/
/**
 * Util - An helper class for inverted-index
 */
class Util {

  /**
   * [parseJSON converts sting to a Json object]
   * @param  {string} jsonFile
   * @return {object}  [the parsed file or false on error]
   */
  parseJSON(jsonFile) {
    if (typeof jsonFile === 'object') {
      return jsonFile;
    }
    try {
      return JSON.parse(jsonFile);
    } catch (err) {
      return true;
    }
  }

  /**
   * [isFileValid Check if a file is a valid json object based]
   * @param  {string}  fileName [the filename of the jsonFile]
   * @param  {object}  jsonFile [the json object to be tested]
   * @return {Boolean} [returns true if valid else false]
   */
  isFileValid(fileName, jsonFile) {
    if (typeof jsonFile === 'string') {
      try {
        jsonFile = JSON.parse(jsonFile);
      } catch (e) {
        return false;
      }
    }
    if (jsonFile && jsonFile.length > 0) {
      const isValidFileStructure = this.checkFileStructure(jsonFile);
      if (isValidFileStructure) {
        return true;
      }
    }
    return false;
  }

  /**
   * [checkFileStructure Checks if fileStructure is valid]
   * @param  {[object]} jsonFile [json file to be tested]
   * @return {boolean}          [true if valid and false if invalid]
   */
  checkFileStructure(jsonFile) {
    this.isValidFile = true;
    jsonFile.forEach((document) => {
      const validTitle = document.title && document.title.length > 0
      const validType = typeof document.title === 'string';
      const validText = document.text && document.text.length > 0
      const validTextType = typeof document.text === 'string';

      if (!(validTitle && validType && validText && validTextType)) {
        this.isValidFile = false;
        return false;
      }
    });
    return this.isValidFile;
  }

  /**
   * [cleanString This method returns a clean version of a string
   * with all unecessary characters striped away]
   * @param  {string} theString [the string to cleanup]
   * @param  {[Regex]} theRegex  [the regex to use]
   * @return {[String]}           [A string Strpped based on the regex]
   */
  cleanString(theString, theRegex) {
    return theString.replace(theRegex, '').toLowerCase() || theString.replace(/[^a-z0-9\s]+/gi, '').toLowerCase();
  }

  /**
   * [Checks if file already exists]
   * @param  {string} fileName [the filename to search for]
   * @param  {Object} documentDatabase  [the database to check]
   * @return {Boolean} true if it exists
   */
  fileAlreadyExists(fileName, documentDatabase) {
    if (documentDatabase[fileName]) {
      return true;
    } else {
      return false
    }
  }
}

module.exports = new Util();
