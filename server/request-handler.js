var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var storage = {
  classes: {
  }
};


var requestHandler = function(request, response) {
  var allMessages = {results: []};
  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  var statusCode = 200;
  var headers = defaultCorsHeaders;
  var klass = request.url.split('/')[1];
  var room = request.url.split('/')[2];
  
  headers['Content-Type'] = 'text/plain';
  response.writeHead(statusCode, headers);

  if (!storage.hasOwnProperty(klass)) {
    statusCode = 404;
    response.writeHead(statusCode, headers);
    response.end('invalid');
  }

  if (request.method === 'POST') {
    request.on('data', function(data) {      
      var text = JSON.parse(data).message;
      var username = JSON.parse(data).username;
      var details = {'message': text, 'username': username, 'room': room};

      if (storage[klass][room]) { 
        storage[klass][room].push(details);  
      } else {
        storage[klass][room] = [{'message': text, 'username': username, 'room': room}];
      } 
      allMessages.results = [details];
      statusCode = 201;
      response.writeHead(statusCode, headers);
      response.end(JSON.stringify(allMessages));
    }); 
  } else { // GET REQUESTS
    allMessages.results = storage.classes[room] || [];
    response.end(JSON.stringify(allMessages));  
  }
};




module.exports.requestHandler = requestHandler;
