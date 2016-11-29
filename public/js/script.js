/*global $:true*/

 $(document).ready(() => {
   const theIndex = new Index();
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
    * [creates the html for filter search filter]
    */
   function createFilterHtml() {
     $('#filter-filename').empty();
     theIndex.getFilenames().forEach((element) => {
       $('#filter-filename').append(`<label><input class="filter-filename" type="checkbox" value="${element}">${element}</label>`);
     });
   }

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
             $('#index-view').prepend(theIndex.createIndexHeader(files[fileIndex].name));
             createFilterHtml();
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
   const index = theIndex.createIndex(fileName, theIndex.createIndexHtml);
   if (index == false) {
     $.toaster({ priority: 'warning', title: 'Create Index', message: 'Index already Exists' });
   } else {
     $(tableid).css('display', 'none');
     $(tableid).append(index[1]);
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
