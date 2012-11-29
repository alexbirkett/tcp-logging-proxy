console.log('starting server');
var net = require('net');
var fs = require('fs');

function getParameters() {
	var args = process.argv.slice(2);
	if (args < 3) {
		throw "usage <input port> <output port> <host / ip address>";
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

var log = function(logStream, message, data) {
	var logMessage = '\n' + getTimeNow() + ' ' + message;
	if (data != undefined) {
		logMessage = logMessage + ': \n' + data;
	}
	
	logStream.write(logMessage);
	console.log(logMessage);
}

var handleConnection = function(incomingSocket) {

	var filePathBase = buildFilePathBase(getFileName());
	var logStream = fs.createWriteStream(filePathBase + '.meta');
	var upStream = fs.createWriteStream(filePathBase + '.upstream');
	var downStream = fs.createWriteStream(filePathBase + '.downstream');
	
	log(logStream, 'socket connected', incomingSocket.remoteAddress);

	var outgoingSocket = net.createConnection(outputPort, host);
	var socketClosed = false;
	
	incomingSocket.on('data', function(data) {
		log(logStream, 'upstream data', data);
		upStream.write(data);
	});
	
	incomingSocket.on('close', function(data) {
		log(logStream, 'incoming socket closed');
		socketClosed = closeLogStreamIfRequired(socketClosed, logStream);
	});
	
	outgoingSocket.on('data', function(data) {
		log(logStream, 'downstream data', data);
		downStream.write(data);
	});
	
	outgoingSocket.on('close', function(data) {
		log(logStream, 'outgoing socket closed');
		socketClosed = closeLogStreamIfRequired(socketClosed, logStream);
	});

	incomingSocket.pipe(outgoingSocket);
	outgoingSocket.pipe(incomingSocket);
};

var handleConnectionDelayed = function(connection) {
	setTimeout(function() {
		handleConnection(connection);
	}, 1000);
};

function createServer(inputPort, outputPort, host) {
	var server = net.createServer();
	server.on('connection', handleConnection);

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
console.log('input port ' + inputPort + ' output port ' + outputPort + ' ip address / host name ' + host);

createDirectory(getOutputDir(), function(err) {
	if (err == null || err.code == 'EEXIST') {
		createServer(inputPort, outputPort, host);
	} else {
		console.log('could not create output dir ' + err);
	}
}); 

	
