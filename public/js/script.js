$(document).ready(function() {
  var theindex = new Index();
  theindex.searchResult = 5;
  alert(theindex.searchResult);
  $("#search").changes(function() {
    alert(index.searchResult);
  });


  $("#input-id").fileinput();

});
