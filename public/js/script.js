 let theIndex = new Index();
 let latestRead = "";
 $(document).ready(function() {

   $("#search-term").focus();
   $("#search").click(function() {
     var fileNames = [];
     var searchTerm = $("#search-term").val();
     $("input.filter-filename").each(function() {
       if ($(this).is(":checked") == true) {
         fileNames.push($(this).val());
       }
     });
     $("#result-pane").empty();
     $("#result-pane").append(theIndex.searchIndex(fileNames, theIndex.createResultHtml, searchTerm)[1]);

   });

   $("#search-term").focus(function() {
     $("#filter-filename").css("display", "block");
     $("#filter-filename").empty();
     theIndex.getFilenames().forEach(function(element) {
       $("#filter-filename").append(`<label><input class="filter-filename" type="checkbox" value="${element}">${element}</label>`);
     });
   });


   var fileInput = document.getElementById("fileUpload");
   fileInput.addEventListener('change', function(e) {
     // var option = confirm("Do you want to create index automatically after Upload");
     var files = fileInput.files;
     for (var i = 0; i < files.length; i++) {
       var reader = new FileReader();
       console.log(files[i]);

       (function(fileIndex, reader) {
         reader.addEventListener('load', function() {
           if (theIndex.saveUploads(files[fileIndex].name, reader.result)) {
             $("#index-view").append(theIndex.createIndexHeader(files[fileIndex].name));
           } else {
             $.toaster({ priority: 'warning', title: 'Upload Error', message: 'Invalid JSON file' });
           }
           // theIndex.saveUploads(fileInput.files[0].name, reader.result)

         });
       })(i, reader);

       reader.readAsText(fileInput.files[i]);
     }
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





 function callCreateIndex(fileName) {
   let tableid = `#${fileName}-table`.replace(".", "");
   let index = theIndex.createIndex(fileName, theIndex.createIndexHtml);
   if (index == false) {
     $.toaster({ priority: 'warning', title: 'Create Index', message: 'Index already Exists' });
   } else {
     $(tableid).append(index[1]);
   }
 }



 function callDeleteIndex(filename) {
   var deleteIndex = confirm(`Delete ${filename} index?
    Are You sure you want to Delete this Index \n Note: This is Unrecoverable`);


   if (deleteIndex) {
     var deleteAll = confirm("Do you want to Delete the JSON file? \n Note: This is Unrecoverable", "Delete JSON File");
     if (deleteAll) {
       theIndex.deleteIndex(filename, true);
       $(`#${filename}-panel`);
       $(`#${filename}`);
       $.toaster({ priority: 'success', title: 'Delete', message: 'Index & File deleted Successfully' });
     } else {
       theIndex.deleteIndex(filename, false);
       $(`#${filename}`).remove;
       $.toaster({ priority: 'success', title: 'Delete Index', message: 'Index deleted Successfully' });
     }
     console.log(theIndex.indexFile);

   }

 }
