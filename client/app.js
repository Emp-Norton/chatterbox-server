String.prototype.encodeHtml = function() {
  var tagsToReplace = {
    '&': '&amp;',
    '<': '&lt;',
    '"': '&quot;',
    "'": '&#x27',
    '>': '&gt;',
    '/': '&#x2F'
  };
  return this.split('').map(function(char) {
    return tagsToReplace[char] || char;
  }).join('');
};

String.prototype.decodeHtml = function() {
  var tagsToReplace = {
    '&amp;': '&',
    '&lt;': '<',
    '"': '&quot;',
    "'": '&#x27',
    '>': '&gt;',
    '/': '&#x2F',
    '&gt;': '>'};
  return this.replace(/[&<>]/g, function(tag) {
    return tagsToReplace[tag] || tag;
  });
};

var app = {
  server: '127.0.0.1:3000',
  rooms: [],
  messages: [],


  init: function() {
    app.getRecent();
  },
  
  send: function(message) {
    var room = $('#newRoomInput').val();
    $.ajax({
      url: 'http://127.0.0.1:3000/classes/' + room,
      type: 'POST',
      data: message,
      success: function (data) {
        console.log('chatterbox: Message sent', data);
        app.getRecent(room);
      },
      error: function (data) {
        console.error(`chatterbox: Failed to send message: ${data}`);
      }
    });
  },

  fetch: function(callback) {
    app.server = `${app.server}`;
    $.get( `${app.server}`, callback);
  },
  
  clearMessages: function() {
    $('#chats').html('');
  },

  addFriend: function(friend) {
    app.friends.push(friend);
    app.showRoom();
  },

  handleUsernameClick: function(uname) {
    // for specrunner test, not working so reverted to original code.
  },

  handleSubmit: function() {
    // same as above.
  },

  renderMessage: function(message) { 

    var userName = message.username || 'Anonymous';
    if (userName) {
      userName = userName.encodeHtml();
    } 

    var roomName = message.roomname || 'lobby';
    if (roomName) {
      roomName = roomName.encodeHtml();
    }

    var text = message.message;
    if (text) {
      text = text.encodeHtml();
    } 
    var createdAt = message.createdAt;
    $('#chats').prepend(`<div class="message"><a id="friendLink" href="#" onclick="app.addFriend('${userName}')">${userName}</a><br>${text}</div>`);   
    
  },

  renderRoom: function(room) { 
    if (!app.rooms.includes(room)) {
      app.rooms.push(room);
      $('#roomSelect').append(`<option>${room}</option>`);
    }
    app.showRoom();
  },

  getRecent: function() {
    var room = $('#newRoomInput').val();
    app.clearMessages();
    $.ajax({
      url: 'http://127.0.0.1:3000/classes/' + room, // 
      type: 'GET',
      success: function (response) {
        console.log('request sent, returned: ', response);
        app.messages = JSON.parse(response).results || app.messages;
        if (app.messages.length) {
          app.messages.forEach(message => {
            app.renderRoom(message.room);
          });
        }
      },
      error: function (response) {
        console.error('chatterbox: request', response);
      }
    });

  },

  showUpto: function(index) {
    for (var idx = app.messages.length - index; idx < app.messages.length; idx++) {
      app.renderMessage(app.messages[idx]); 
    }
  },

  showRoom: function() {
    app.clearMessages();
    app.messages.forEach(function(message) {
      if (message.room === $('#newRoomInput').val() || message.room === 'messages') {
        app.renderMessage(message);
      }
    });
  }
};

$(function() {
  
  app.init();


  $('#roomSelect').on('change', function(e) {
    app.showRoom();
  });
 
  $('#message').on('submit', function(e) {
    e.preventDefault();
    var messageObj = {};
    var $form = $(this);
    messageObj.message = $('#text').val();
    var klass = 'classes'; 
    messageObj.username = window.name;
    messageObj.room = $('#newRoomInput').val(); 
    if (messageObj.room === undefined || messageObj.room.length < 1) { 
      messageObj.room = 'lobby';
    }
    document.getElementById('text').value = ''; // why didn't jQuery work here?
    app.send(JSON.stringify(messageObj), messageObj.klass, messageObj.room); 
  });
});
