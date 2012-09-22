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
    ProxyLogger     = require('./logger').ProxyLogger,
    ProxyManager     = require('./pmanager').ProxyManager,
    events          = require('events'),
    webservice      = require('webservice'),
    httpMsgModule   = require('./httpMsgRequest'),
    colors          = require('webservice/node_modules/colors'),
    connect         = require('connect'),
    server          = connect.createServer();

    
var HttpMsgHandler = exports.HttpMsgHandler = function HttpMsgHandler() {

};

var proxyManager = new ProxyManager();

var proxyLogger = new ProxyLogger(proxyManager);

server.use(connect.logger('dev'));

server.use(webservice.createHandler(httpMsgModule,{userName:'user',proxyManager:proxyManager}));

server.listen(10102);

console.log('Msg server running on port 10102 with webservice.js'.cyan);

