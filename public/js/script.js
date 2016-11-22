 let theIndex = new Index();
 $(document).ready(function() {


       $("#search").click(function() {
         var fileNames = [];
         var searchTerm = $("#search-term").val();
         $("#search-panel").css("display", "none");
         $("input.filter-filename").each(function() {
           if ($(this).is(":checked") == true) {
             fileNames.push($(this).val());
           }
         });
         $("#result-pane").empty();
         $("#result-pane").append(theIndex.searchIndex(fileNames, theIndex.createResultHtml, searchTerm)[1]);

       });

       $("#search-term").click(function() {
         $("#search-panel").delay(200).fadeIn(300);
         // $("#search-panel").css("display", "block");
       });


       function createFilterHtml() {
         $("#filter-filename").empty();
         theIndex.getFilenames().forEach(function(element) {
           $("#filter-filename").append(`<label><input class="filter-filename" type="checkbox" value="${element}">${element}</label>`);
         });
       }

       var fileInput = document.getElementById("fileUpload");
       fileInput.addEventListener('change', function(e) {
         $(".file-preview").delay(200).fadeIn(300);
         // var option = confirm("Do you want to create index automatically after Upload");
         var files = fileInput.files;
         for (var i = 0; i < files.length; i++) {
           var reader = new FileReader();

           (function(fileIndex, reader) {
             reader.addEventListener('load', function() {
               if (theIndex.saveUploads(files[fileIndex].name, reader.result)) {
                 $("#index-view").prepend(theIndex.createIndexHeader(files[fileIndex].name));
                 createFilterHtml();
               } else {
                 $.toaster({ priority: 'warning', title: 'Upload Error', message: 'Invalid JSON file' });
               }
               // theIndex.saveUploads(fileInput.files[0].name, reader.result)

             });
           })(i, reader);

           reader.readAsText(fileInput.files[i]);
         }

       });

       function callCreateIndex(fileName) {
         $(".file-preview").css("display", "none");
         let tableid = `#${fileName}-table`.replace(".", "");
         let index = theIndex.createIndex(fileName, theIndex.createIndexHtml);
         if (index == false) {
           $.toaster({ priority: 'warning', title: 'Create Index', message: 'Index already Exists' });
         } else {
           $(tableid).css("display", "none");
           $(tableid).append(index[1]);
           $(tableid).delay(200).fadeIn(300);
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

         }

       }
