/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
// storage = {
//   hrsf87: {
//    lobby: {}, main: {}, cats: {}
//   }, 
//   hrsf86: {
//     main: {}, dinotalk: {}  
//   }
// };

var storage = {
  classes: {
    hrsf87: {
      lobby: []
    }
  }
};


var requestHandler = function(request, response) {

  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  var statusCode = 200;
  //var headers = defaultCorsHeaders;

  headers['Content-Type'] = 'text/plain';
  response.writeHead(statusCode, headers);

  if (request.method === 'POST') {
    var details = {};
    request.on('data', function(data) {
      var text = JSON.parse(data).text;
      text = JSON.stringify(text);
      var username = JSON.parse(data).username;
      var room = JSON.parse(data).room;
      storage.classes.hrsf87.lobby.push({'text': text, 'username': username, 'room': room});
    }); 
    response.end(JSON.stringify(details));
  } else {
    // check first term of URL against storage 
      // if valid, return all messages in that class
      // else check all message of all classes for that username, collect and return.
    var term = request.url.split('/');
    console.log(term[1]);
    response.end(JSON.stringify(storage.classes[term[1]]));  
  }
    
  response.end('done');
}; 


var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

module.exports.requestHandler = requestHandler;
