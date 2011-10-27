var net = require('net'),
    sys = require('sys'),
    events = require('events');

var ProxyServer = exports.ProxyServer = function ProxyServer( ) {
    
	var self = this;
	
	if(false === (this instanceof ProxyServer)) {
		return new ProxyServer( );
	};
    
	this.active = true;
	
	events.EventEmitter.call(this);

	this.on('connect', function(srcAddr, srcPort, destAddr, destPort) {
	        
        var server = net.createServer(function (c) {
        });
        
        server.on('error', function(ex) {
            console.log('server.error');
        });
        
        server.on('connection', function(inSocket) {
            console.log('Connected');

            inSocket.pause();
            
            inSocket.on('error', function(ex) {
                console.log('inSocket.error');
            });
        
            inSocket.on('connect', function() {
                console.log('connect');

                var outSocket = net.createConnection(destPort, destAddr);
                outSocket.pause();
    
                outSocket.on('error', function(ex) {
                    console.log('outSocket.error');
                    inSocket.end();
                    outSocket.destroy();
                });

                outSocket.on('connect', function() {
                    console.log('outSocket.connect');
        
                    inSocket.on('drain', function() {
                        console.log('inSocket.drain');
                        outSocket.resume();
                    });
                    
                    inSocket.on('end', function() {
                        console.log('inSocket.end');
                        outSocket.end();
                    });
            
                    outSocket.on('end', function() {
                        console.log('outSocket.end');
                        inSocket.end();
                    });
                    
                    outSocket.on('drain', function() {
                        console.log('outSocket.drain');
                        inSocket.resume();
                    });
                    
                    outSocket.on('close', function(hadError) {
                        console.log('outSocket.close');
                        if (hadError) {
                            inSocket.destroy();
                        }
                    });
            
                    outSocket.on('data', function(chunk) {
                        try {
                            if (!inSocket.write(chunk)) {
                                consol.log('outStock.pause');
                                outSocket.pause();
                            }
                        } catch (ex) {
                            outSocket.emit('error',ex);
                        }
                    });
                    
                    inSocket.on('data', function(chunk) {
                        try {
                            if (!outSocket.write(chunk)) {
                                consol.log('inStock.pause');
                                inSocket.pause();
                            }
                        } catch (ex) {
                            outSocket.emit('error',ex);
                        }
                    });    
                    
                });

            });

        });
        
        server.listen(srcPort, srcAddr);

        self.emit('connected', self);

    });
                
}
sys.inherits(ProxyServer, events.EventEmitter);


var proxyServer = new ProxyServer();

proxyServer.emit("connect",null,8222,'10.0.0.3',22, function(server) {
        console.log('Created server');
});


