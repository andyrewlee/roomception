var users = require('./../server/controllers/users.js');

module.exports = function Routes(app){

  var roomValues = [{}, {}, {},
                    {}, {}, {},
                    {}, {}, {}];

  var roomKeys = ['limbo', 'lust', 'gluttony',
                 'greed', 'anger', 'heresy',
                 'violence', 'fraud', 'treachery'];


  app.get('/', function(req,res) {
    users.index(req,res)
  });

  app.io.route('client:newUserInRoom', function(req) {
    var roomKey;

    if(req.session.name == undefined) {
      req.session.name = 'anonymous';
    }

    req.session.room = req.data.name;
    req.session.save(function(){
      for(var i=0; i < roomValues.length; i++) {
        if(roomKeys[i] == req.session.room) {
          roomValues[i][req.io.socket.id] = req.session.name;
          roomKey = i;
        }
      }

      req.io.join(req.session.room);

      app.io.room(req.session.room).broadcast('server:newUserInRoom', { connectedUser: req.session.name,
                                                                        existingUsers: roomValues[roomKey] });
      req.io.emit('server:existingUsers', roomValues[roomKey] );
    });
  });

  app.io.route('disconnect', function(req) {
    for(var i in roomKeys) {
      if(roomKeys[i] == req.session.room) {
        delete roomValues[i][req.io.socket.id];
        req.io.room(req.session.room).broadcast('server:userLeavingRoom', { disconnectedUser: req.session.name,
                                                                            existingUsers: roomValues[i] });
      }
    }
  });

}
