 let theindex = new Index();
 $(document).ready(function() {


   $("#search").click(function() {
     var fileNames = [];
     var searchTerm = $("#search-term").val();
     $("input.filter-filename").each(function() {
       if ($(this).is(":checked") == true) {
         fileNames.push($(this).val());
       }
     });
     $("#result-pane").empty();
     $("#result-pane").append(theindex.searchIndex(fileNames, theindex.createResultHtml, searchTerm)[1]);

   });

   $("#search-term").focus(function() {
     var tag = [`<label><input class="filter-filename" type="checkbox" value="`, `">`, `</label>`];
     $("#filter-filename").empty();
     theindex.getFilenames().forEach(function(element) {
       $("#filter-filename").append(tag[0] + element + tag[1] + element + tag[2]);
     });
   });





   var fileInput = document.getElementById("fileUpload");
   var submit = $("#submit");
   fileInput.addEventListener('change', function(e) {
     var file = fileInput.files[0];
     var reader = new FileReader();
     reader.onload = function(e) {
       $("#index-view").empty();
       // theindex.createIndex(fileInput.files[0].name, theJSON, reader.result);
       $("#index-view").append(theindex.createIndex(fileInput.files[0].name, theJSON, theindex.createIndexHtml)[1]);
       // theindex.saveUploads(fileInput.files[0].name, reader.result);

     }
     reader.readAsText(file);
   });


   var theJSON = [{
       "title": "Alice in Wonderland",
       "text": "Alice falls into a rabbit hole and enters a world full of imagination."
     },

     {
       "title": "The Lord of the Rings: The Fellowship of the Ring.",
       "text": "An unusual alliance in of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring."
     }
   ];
 });





 function callCreateIndex(filename) {
   createIndex(filePath, jsonFile, cb);
 }



 function callDeleteIndex(filename) {
   var deleteIndex = confirm(`Delete ${filename} index?
    Are You sure you want to Delete this Index \n Note: This is Unrecoverable`);


   if (deleteIndex) {
     var deleteAll = confirm("Do you want to Delete the JSON file? \n Note: This is Unrecoverable", "Delete JSON File");
     if (deleteAll) {
       theindex.deleteIndex(filename, true);
     } else {
       theindex.deleteIndex(filename, false);
     }
     $.toaster({ priority: 'success', title: 'Delete Index', message: 'Index deleted Successfully' });
     $("#index-view").empty();
     $("#index-view").append(theindex.createIndexHtml(theindex.indexFile, theindex.jsonDatabase));

   }

 }
