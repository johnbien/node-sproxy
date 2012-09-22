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
	
	this.srcAddr = null;
	this.srcPort = null;
	this.dstAddr = null;
	this.dstPort = null;
	
	events.EventEmitter.call(this);

	this.connect = function( ) {
	        
	    var self = this;    
	        
	    console.log('srcAddr: ' + self.srcAddr);
	    console.log('srcPort: ' + self.srcPort);
	    console.log('dstAddr: ' + self.dstAddr);
	    console.log('dstPort: ' + self.dstPort);
	        
        var server = net.createServer(function (c) {
        });
        
        server.on('error', function(ex) {
            console.log('server.error; ' + ex);
            self.emit('error', ex);
        });
        
        server.on('connection', function(inSocket) {
            
            inSocket.on('error', function(ex) {
                console.log('inSocket.error');
                self.emit('error', ex);
            });
        
            var outSocket = net.createConnection(self.dstPort, self.dstAddr);

            outSocket.on('error', function(ex) {
                console.log('outSocket.error; ' + ex);
                inSocket.end();
                outSocket.destroy();
                self.emit('error', ex);
            });

            inSocket.on('connect', function() {

                inSocket.on('drain', function() {
                    outSocket.resume();
                });
                
                inSocket.on('end', function() {
                    outSocket.end();
                });
        
                
                inSocket.on('data', function(chunk) {
                    try {
                        if (!outSocket.write(chunk)) {
                            inSocket.pause();
                        }
                    } catch (ex) {
                        outSocket.emit('error',ex);
                    }
                });    
                
            });

            outSocket.on('connect', function() {
    
                outSocket.on('end', function() {
                    inSocket.end();
                });
                
                outSocket.on('drain', function() {
                    inSocket.resume();
                });
                
                outSocket.on('close', function(hadError) {
                    if (hadError) {
                        inSocket.destroy();
                    }
                });
        
                outSocket.on('data', function(chunk) {
                    try {
                        if (!inSocket.write(chunk)) {
                            outSocket.pause();
                        }
                    } catch (ex) {
                        outSocket.emit('error',ex);
                    }
                });
                
            });

        });
        
        self.on('close', function(callback) {
                server.on('close', function() {
                        callback('closed');
                });
                server.close();
        });
                
        server.listen(self.srcPort, self.srcAddr);

        self.emit('connected', self);

    };

    this.toJSON = function() {
        var obj = new Object();
        obj.srcAddr = self.srcAddr;
        obj.srcPort = self.srcPort;
        obj.dstAddr = self.dstAddr;
        obj.dstPort = self.dstPort;
        return obj;
    };
};
sys.inherits(ProxyServer, events.EventEmitter);

