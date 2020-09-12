var express = require('express');
var app = express();
var port = process.env.PORT || 3500;
app.use('/', express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

app.listen(port, function() {});
