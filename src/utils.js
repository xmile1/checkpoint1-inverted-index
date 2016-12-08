/* eslint class-methods-use-this: 0*/
/**
 * util - An helper class for inverted-index
 */
class util {

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
     * [isFileValid Check if a file is a valid json object based, calls method to check structure]
     * @param  {string}  fileName [the filename to verfity if is the object in the database]
     * @param  {object}  jsonFile [the json object to be tested]
     * @return {Boolean}          [returns true if valid else false]
     */
  isFileValid(fileName, jsonFile) {
    if (typeof jsonFile === 'string') {
      jsonFile = JSON.parse(jsonFile);
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
     * [checkFileStructure Checks if object follows the structure as found in ./jasmine/books.json]
     * @param  {[object]} jsonFile [json file to be tested]
     * @return {boolean}          [true if valid and false if invalid]
     */
  checkFileStructure(jsonFile) {
    this.isValidFile = true;
    jsonFile.forEach((document) => {
      const isValidTitle = document.title && document.title.length > 0 && typeof document.title === 'string';
      const isValidText = document.text && document.text.length > 0 && typeof document.text === 'string';
      if (!(isValidText && isValidTitle)) {
        this.isValidFile = false;
        return false;
      }
    });
    return this.isValidFile;
  }

  /**
   * [cleanString This method takes in a string with whitespaces, non-alphanumric characters and
   * Returns a clean version with all unecessary characters striped away]
   * @param  {string} theString [the string to cleanup]
   * @param  {[Regex]} theRegex  [the regex to use]
   * @return {[String]}           [A string Strpped based on the regex]
   */
  cleanString(theString, theRegex) {
    return theString.replace(theRegex, '').toLowerCase() || theString.replace(/[^a-z0-9\s]+/gi, '').toLowerCase();
  }
}
module.exports = new util();
