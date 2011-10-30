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

/** 
    node-sproxy
    node-sproxy is a Socket Proxy for node.js(tm). 
    It will allow you to port forward incomming ports to a specified host and port.
**/


var sys = require('sys'),
    zmq = require('zmq'),
    ProxyServer = require('./sproxy').ProxyServer,
    events = require('events');
    
    var ProxyManager = exports.ProxyManager = function ProxyManager(port) {    
    
        var self = this; 
        
        if(false === (this instanceof ProxyManager)) {
            return new ProxyManager( );
        };
        
        this.active = true;
        
        events.EventEmitter.call(this);        
        
        this.cmdRequest = zmq.createSocket('rep');
        
        this.cmdRequest.bind('tcp://*:' + port, function(err) {
                
                self.cmdRequest.on('message', function(cmd) {
                         
                        console.log('Got> ' + cmd);
                        
                        var args = Array.prototype.slice.call(arguments);

                        self.emit(cmd, args, function(result) {
                                
                                console.log('Callback result: ' + result);
                                
                                if (result != 'OK') {
                                    self.cmRequest.send('ERR',result);
                                }
                    
                                self.cmdRequest.send('OK');
                        });

                });

        });

        this.on("ADDPROXY", function(args, callback) {
        
            newProxy = new ProxyServer();

                if (args.length === 4) {
                    newProxy.srcAddr = null; 
                    newProxy.srcPort = args[1];
                    newProxy.dstAddr = args[2];
                    newProxy.dstPort = args[3];
                } else if (args.length === 5) {
                    newProxy.srcAddr = args[1]; 
                    newProxy.srcPort = args[2];
                    newProxy.dstAddr = args[3];
                    newProxy.dstPort = args[4];
                } else {
                    callback('ERR');
                    return;
                }
                
                newProxy.on('connected', function(server) {
                        console.log('Created server');
                        callback('OK');
                });

                newProxy.emit("connect");
            
        });
        
    };
    
    sys.inherits(ProxyManager, events.EventEmitter);
    
 
