/*global $:true*/
var $ = require('jquery');
var Index = require('./inverted-index');
   const theIndex = new Index();
 $(document).ready(() => {

   const fileInput = document.getElementById('fileUpload');

   /**
    * [On click it calls the search index function and appends its result to the result pane in views]
    */
   $('#search').click(() => {
     const fileNames = [];
     const searchTerm = $('#search-term').val();
     $('#search-panel').css('display', 'none');
     $('input.filter-filename').each(function() {
       if ($(this).is(':checked') == true) {
         fileNames.push($(this).val());
       }
     });
     $('#result-pane').empty();
     $('#result-pane').append(theIndex.searchIndex(fileNames, theIndex.utilsInstance.createResultHtml, searchTerm)[1]);
   });

   /**
    * [shows the filter list ]
    */
   $('#search-term').click(() => {
     $('#search-panel').delay(200).fadeIn(300);
   });




   /**
    * [reads the file using a file input and prepends a create index pane to the view]
    */
   fileInput.addEventListener('change', (e) => {
     const files = fileInput.files;
     $('.file-preview').delay(200).fadeIn(300);
     for (let i = 0; i < files.length; i++) {
       const reader = new FileReader();
       (function(fileIndex, theReader) {
         reader.addEventListener('load', () => {
           if (theIndex.saveUploads(files[fileIndex].name, reader.result)) {
             $('#index-view').prepend(controller.createIndexHeader(files[fileIndex].name));
             controller.createFilterHtml();
           } else {
             $.toaster({ priority: 'warning', title: 'Upload Error', message: 'Invalid JSON file' });
           }
           // theIndex.saveUploads(fileInput.files[0].name, reader.result)
         });
       }(i, reader));
       reader.readAsText(fileInput.files[i]);
     }
   });
 });

 /**
  * [Calls the creare index function and create the index]
  */
 function callCreateIndex(fileName) {
   $('.file-preview').css('display', 'none');
   const tableid = `#${fileName}-table`.replace('.', '');
   const index = theIndex.createIndex(fileName);
   if (index == false) {
     $.toaster({ priority: 'warning', title: 'Create Index', message: 'Index already Exists' });
   } else {
     $(tableid).css('display', 'none');
     $(tableid).append(theIndex.createIndexHtml());
     $(tableid).delay(200).fadeIn(300);
   }
 }


 /**
  * [Calls the delete index function based on prompt resonses]
  */
 function callDeleteIndex(filename) {
   let panelIdPrefix = `${filename}`.replace('.', '');
   const deleteIndex = confirm(`Delete ${filename} index?
    Are You sure you want to Delete this Index \n Note: This is Unrecoverable`);


   if (deleteIndex) {
     const deleteAll = confirm('Do you want to Delete the JSON file? \n Note: This is Unrecoverable', 'Delete JSON File');
     if (deleteAll) {
       theIndex.deleteIndex(filename, true);
       $(`#${panelIdPrefix}-panel`).remove();
       $.toaster({ priority: 'success', title: 'Delete', message: 'Index & File deleted Successfully' });
     } else {
       theIndex.deleteIndex(filename, false);
       $(`#${panelIdPrefix}`).remove();
       $.toaster({ priority: 'success', title: 'Delete Index', message: 'Index deleted Successfully' });
     }
   }
 }


var controller = {

  /**
   * [creates the html for filter search filter]
   */
  createFilterHtml() {
    $('#filter-filename').empty();
    theIndex.getFilenames().forEach((element) => {
      $('#filter-filename').append(`<label><input class="filter-filename"
      type="checkbox" value="${element}">${element}</label>`);
    });
  },

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
   },



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
   },



     /**
      * [createIndexHtml Creates an html file based on the index of the provided filepath]
      * @param  {string} filePath  [the filename of the index]
      * @param  {[object]} indexFile [the store of all created index objects]
      * @param  {[object]} jsonDoc   [the object of the uploaded json file for the file requested]
      * @return {[array]} returns the index and the html panel representation of the index]
      */
   createIndexHtml(filePath, indexFile, jsonDoc) {
     this.indexView = '';
     const indexPerPath = theIndex.indexFile[filePath];
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
