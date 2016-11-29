class view { 

 /**
   * [createResultHtml Creates an html view based the result of the index search]
   * @param  {[object]} resultObject [the result of the index search]
   * @param  {[object]} jsonDatabase [the json database containing the original Uploaded object]
   * @return {[ogject]}              [returns the search result and the Html view]
   */
  createResultHtml(resultObject, jsonDatabase) {
    this.resultView = '';
    const termTag = ['<h3>', '</h3>'];
    const fileTag = ['<p>', '</p>'];
    const resultContainer = ["<div class='panel panel-default'>", '</div>'];
    const titleTag = ["<div class='panel-heading result-header'><h3 class='panel-title'> ", '</h3> </div>'];
    const textTag = ["<div class='panel-body'> ", '</div>'];

    Object.keys(resultObject).forEach((term) => {
      this.resultView += `Search Term: ${termTag[0]}${term}${termTag[1]}`;
      Object.keys(resultObject[term]).forEach((file) => {
        this.resultView += fileTag[0] + file + fileTag[1];
        resultObject[term][file].forEach((element, index) => {
          this.resultView += `${resultContainer[0]} ${titleTag[0]} Index: ${index} `;
          this.resultView += `${jsonDatabase[file][index].title} ${titleTag[1]}`;
          this.resultView += textTag[0] + jsonDatabase[file][index].text + textTag[1];
          this.resultView += resultContainer[1] + titleTag[1];
        });
      });
    });
    return [resultObject, this.resultView];
  }



      /**
     * [createIndexHeader Creates the HTML header of the index file based on the uploaded file]
     * @param  {string} FileName [the name of the file(key) to create an index header for]
     * @return {string}          [and HTML Panel header with buttons to create and delete index]
     */
  createIndexHeader(FileName) {
    this.indexHeadView = '';
    const cFileName = FileName.replace(/[^a-z0-9]+/gi, '');
    const htmlTop = `<div id="${cFileName}-panel" class="panel panel-default ">
                            <div class="panel-heading index-header">
                                <h4 class="panel-title">
                    <a data-toggle="collapse" data-parent="#accordion" href="#${cFileName}">${FileName}</a></h4>
                    <span class="input-group-addon create-button" onclick="callCreateIndex('${FileName}')" id="create-index">Create Index</span>
                    <span class="input-group-addon delete-button" onclick="callDeleteIndex('${FileName}')" id="delete-index">Delete Index</span></div>
                    <div id="${cFileName}" class="panel-collapse collapse in index-body">
                    <div class="panel-body"><div class="table-responsive"><table id="${cFileName}-table" class="table"></table></div></div></div></div>`;
    this.indexHeadView += htmlTop;
    return this.indexHeadView;
  }



    /**
     * [createIndexHtml Creates an html file based on the index of the provided filepath]
     * @param  {string} filePath  [the filename of the index]
     * @param  {[object]} indexFile [the store of all created index objects]
     * @param  {[object]} jsonDoc   [the object of the uploaded json file for the file requested]
     * @return {[array]} returns the index and the html panel representation of the index]
     */
  createIndexHtml(filePath, indexFile, jsonDoc) {
    this.indexView = '';
    const indexPerPath = indexFile[filePath];
    this.indexView += '<thead> <th>#</th>';
    this.indexView += '<th>word</th>';
    jsonDoc.forEach((element, index) => {
      this.indexView += `<th>Doc ${index + 1} </th>`;
    });
    let count = 1;
    this.indexView += '<tbody>';
    Object.keys(indexPerPath).forEach((word) => {
      this.indexView += `<tr> <td> ${count}</td>`;
      this.indexView += `<td> ${word} </td>`;
      jsonDoc.forEach((element, index) => {
        if (indexPerPath[word].indexOf(index) > -1) {
          this.indexView += '<td>✔</td>';
        } else {
          this.indexView += '<td class="neg-tick">✘</td>';
        }
      });
      this.indexView += '</tr>';
      count = +1;
    });

    this.indexView += '</tbody>';
    return [indexPerPath, this.indexView];
  }
}
module.exports = view;