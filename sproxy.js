/*
   Copyright 2011 John Bien

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

/** node-sproxy
    node-sproxy is a Socket Proxy for node.js(tm). 
    It will allow you to port forward incomming ports to a specified host and port.
**/


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


