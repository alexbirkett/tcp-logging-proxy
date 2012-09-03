var net = require('net');


var client = net.createConnection(4050, "localhost");

client.addListener("connect", function(){
    client.write("hello");
});

client.on('data', function(data) {
  console.log(data.toString());
});
client.on('end', function() {
  console.log('client disconnected');
});