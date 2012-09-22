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
    ProxyServer = require('./sproxy').ProxyServer,
    events = require('events');

    var ProxyManager = exports.ProxyManager = function ProxyManager( ) {    
    
        var self = this; 
        
        if(false === (this instanceof ProxyManager)) {
            return new ProxyManager( );
        };
        
        this.active = true;
        
        this.proxyCache = new Object();
        
        events.EventEmitter.call(this);        
        
        /**
            Add a new proxy, forwarding incomming socket requests 
            on a specified port to a destination address and port.
        **/
        this.on("ADDPROXY", function(args, callback) {
        
            var newProxy = new ProxyServer();

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
                
                if (self.proxyCache[newProxy.srcPort]) {
                    self.emit('error', 'Proxy with port already defined');
                    return;
                }
                
                newProxy.on('connected', function(server) {
                        console.log('Created server');
                        self.proxyCache[newProxy.srcPort] = newProxy;
                        callback('OK');
                });
                
                newProxy.connect();

                self.emit("connect", newProxy);
            
        });
        
        /**
            Returns a list of all proxies registered.
        **/
        this.on("LISTALL", function(args, callback) {
                var proxies = new Array();
                for (var p in self.proxyCache) {
                    var proxyServer = self.proxyCache[p];
                    proxies.push("{srcAddr:'" + proxyServer.srcAddr + 
                        "',srcPort:'" + proxyServer.srcPort + 
                        "',dstAddr:'" + proxyServer.dstAddr +
                        "',dstPort:'" + proxyServer.dstPort + "'}");
                };
                callback("{proxies:[" + String(proxies) + "]}");
        });
        
        /**
            Remove a registered proxy by specifying the incomming port number.
        **/
        this.on("RMPROXY", function(args, callback) {
                var srcPort = args[1];
                
                var proxyServer = self.proxyCache[srcPort];
                if (proxyServer != null) {
                    proxyServer.emit('close',function(result){
                            console.log('PROXYCLOSED: ' + srcPort);
                            self.emit('PROXYCLOSED', proxyServer);
                    });
                }
                delete self.proxyCache[srcPort];

                callback('OK');
        });
        
        this.on("HELP", function(args, callback) {
                
                commands = new Array();
                for (cmd in self._events) {
                    commands.push(cmd);
                }
                
                callback("{commands:[" + String(commands) + "]}");
        });
        
    };
    
    sys.inherits(ProxyManager, events.EventEmitter);
    
 
