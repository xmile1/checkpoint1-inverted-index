$(document).ready(function() {

  let theindex = new Index();
  $("#search").click(function() {
    var fileNames = [];
    var searchTerm = $("#search-term").val();
    $("input.filter-filename").each(function() {
      if ($(this).is(":checked") == true) {
        fileNames.push($(this).val());
      }
    });
    console.log(fileNames);
    $("#result-pane").append(theindex.searchIndex(fileNames, theindex.createResultHtml, searchTerm)[1]);

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

  var fileInput = document.getElementById("fileUpload");
  var submit = $("#submit");

  fileInput.addEventListener('change', function(e) {
    var file = fileInput.files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
      // theindex.createIndex(fileInput.files[0].name, theJSON, reader.result);
      $("#index-view").append(theindex.createIndex(fileInput.files[0].name, theJSON, theindex.createIndexHtml)[1]);
      // theindex.saveUploads(fileInput.files[0].name, reader.result);

    }
    reader.readAsText(file);
  });

});
