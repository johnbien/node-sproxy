

var ProxyLogger = exports.ProxyLogger = function ProxyLogger(proxyManager) {
  
    var self = this;
    
    this.logData = new Object();

    proxyManager.on('connect', function(proxyServer) {
        var ldata = self.logData[proxyServer.srcPort];
        if (ldata == null || ldata == undefined) {
            ldata = new Object();
            ldata.log = new Array();
            ldata.startTime = new Date();
            self.logData[proxyServer.srcPort] = ldata;
        };
        
        ldata.log.push('Connected');
    });
    
    proxyManager.on('PROXYCLOSED', function (srcPort) {
        var ldata = self.logData[srcPort];
        debugger;
        if (ldata != null && ldata != undefined) {
            ldata.log.push('Disconnected');
        }            
    });
    
    proxyManager.on('SHOWLOG', function(args, callback) {
        try {
            callback(JSON.stringify(self.logData));
        } catch (err) {
            proxyManager.emit('error', err);
        }
    });

    
};
