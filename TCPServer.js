var net = require('net');

var server = net.createServer();
server.on('connection', function(socket) {


	console.log('new connection\n');

	socket.on('data', function(data) {
		console.log('received data ' + data);
		socket.write('world');
	});
	socket.on('close', function(data) {
		console.log('close event');
	});

});

server.on('close', function(socket) {
	console.log('socket closed');
});

server.listen(4040);