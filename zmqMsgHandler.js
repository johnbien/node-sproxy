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

var cmdRequest = zmq.createSocket('rep');

var ZMQMsgHandler = exports.ZMQMsgHandler = function ZMQMsgHandler(listenOnUrl, proxyManager) {
    
        var self = this; 
        
        if(false === (this instanceof ZMQMsgHandler)) {
            return new ZMQMsgHandler( );
        };
        
        this.active = true;
        
        events.EventEmitter.call(this);        
        
        
        cmdRequest.bind(listenOnUrl, function(err) {
                
                cmdRequest.on('message', function(cmd) {
                         
                        console.log('Got> ' + cmd);
                        
                        var args = Array.prototype.slice.call(arguments);

                        proxyManager.emit(cmd, args, function(result) {
                                
                                console.log('Callback result: ' + result);
                                cmdRequest.send(result);

                        });

                });

        });
    
};

sys.inherits(ZMQMsgHandler, events.EventEmitter);

