this.title = "node-sproxy!";
this.name = "message processing module";
this.version = "0.1.0";
this.endpoint = "http://localhost:10102";

exports.request = function(options, callback) {

    console.log(options.proxyManager._events);
    
    var args = options.message == null ? new Array() : options.message.split(',');
    args.unshift(options.command);

    console.log('Got> ' + args[0]);
    console.log('Args [' + args + ']');
    
    options.proxyManager.emit(options.command, args, function(result) {
            
            console.log('Callback result: ' + result);
            callback(result);

    });
	
};

exports.request.schema = {
	command: {
		type: 'string',
		optional: false,
		description: 'Specifies the type of operation that is requested. Use HELP to get a list of all available commands'
	},
	message: {
		type: 'string',
		optional: true,
		description: 'The message'
	}
};
exports.request.description = "Generic message request";

