console.log('starting server');
var net = require('net');
var fs = require('fs');

function getParameters() {
	var args = process.argv.slice(2);
	if (args < 3) {
		throw "<input port> <output port> <host / ip address>";
	}
	return args;
}

function getFileName() {
	var now = new Date();
	return now.getTime();
}

function getTimeNow() {
	return new Date().toUTCString();
}

function getOutputDir() {
	return './output/';
}
function buildFilePathBase(fileName) {
	return getOutputDir() + '/' + fileName;
}


function closeLogStreamIfRequired(socketClosed, logStream) {
	if (socketClosed) {
		logStream.end();
	}
	socketClosed = true;
	return socketClosed;
}

function createServer(inputPort, outputPort, host) {
	var server = net.createServer();
	server.on('connection', function(incomingSocket) {

		var filePathBase = buildFilePathBase(getFileName());
		var logStream = fs.createWriteStream(filePathBase + '.meta');
		logStream.write(getTimeNow() + ' IP ' + incomingSocket.remoteAddress + ' socket connected\n');
		
		console.log('new connection\n');

		var outgoingSocket = net.createConnection(outputPort, host);
		var socketClosed = false;
		
		
		incomingSocket.on('data', function(data) {
			var logMessage = getTimeNow() + ' upstream data: ' + data + '\n';
			console.log(logMessage);
			logStream.write(logMessage);
		});
		
		incomingSocket.on('close', function(data) {
			var logMessage = getTimeNow() + ' incoming socket closed \n';
			console.log(logMessage);
			logStream.write(logMessage);
			socketClosed = closeLogStreamIfRequired(socketClosed, logStream);
			
			
		});
		
		outgoingSocket.on('data', function(data) {
			var logMessage = getTimeNow() + ' downstream data: ' + data + '\n';
			console.log(logMessage);
			logStream.write(logMessage);
		});
		
		outgoingSocket.on('close', function(data) {
			var logMessage = getTimeNow() + ' outgoing socket closed \n';
			console.log(logMessage);
			logStream.write(logMessage);
			socketClosed = closeLogStreamIfRequired(socketClosed, logStream);
		});

		incomingSocket.pipe(outgoingSocket);
		outgoingSocket.pipe(incomingSocket);
	});

	server.on('close', function(socket) {
		console.log('socket closed');
	});

	server.listen(inputPort);
}

function createDirectory(name, callback) {
	 fs.mkdir(name, null, callback);
}

parameters = getParameters();
var inputPort = parameters[0];
var outputPort = parameters[1];
var host = parameters[2];
console.log('input port ' + inputPort + ' output port ' + outputPort + ' ip address ' + host);

createDirectory(getOutputDir(), function(err) {

	createDirectory(getOutputDir(), function(err) {
		// todo check err
		createServer(inputPort, outputPort, host);
	});
});
	
