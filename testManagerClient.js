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
    zmq = require('zmq'),
    events = require('events');
    
var socket = zmq.createSocket('req');

socket.on('message', function(reply) {
        console.log('Reply> '+ reply);
});

socket.connect('tcp://localhost:10101')

socket.send('ADDPROXY',"127.0.0.1","8222","10.0.0.1","22");
socket.send('ADDPROXY',"8223","10.0.0.1","22");
socket.send('LIST_ALL');
socket.send('RMPROXY','8222');
socket.send('LIST_ALL');

