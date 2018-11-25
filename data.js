const http = require('http');
const fs = require('fs');

var request = http.get('', function(response) {
  response.pipe(file);
});