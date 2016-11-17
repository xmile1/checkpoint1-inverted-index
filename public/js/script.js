$(document).ready(function() {
  let theindex = new Index();

  $("#search-term").change(function() {


  });


  var fileInput = document.getElementById("fileUpload");
  var submit = $("#submit");

  fileInput.addEventListener('change', function(e) {
    var file = fileInput.files[0];
    console.log(file);
    var reader = new FileReader();
    reader.onload = function(e) {
      theindex.saveUploads(fileInput.files[0].name, reader.result);
    }
    reader.readAsText(file);
  });





  // for (var i = 0; i < files.length; i++) {
  //   alert(files[0]);
  //   var reader = new FileReader();
  //   var reader = new FileReader();
  //   reader.onload = function(e) {
  //     alert(files[i]);
  //     theindex.saveUploads(files[i], reader.result);
  //   }
  //   reader.readAsText(files[i]);
  // }



  // });


});
