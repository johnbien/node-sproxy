

var ProxyLogger = exports.ProxyLogger = function ProxyLogger(proxyManager) {
  
    var self = this;
    
    this.logData = new Object();
    
    proxyManager.on('connect', function(proxyServer) {
        console.log('Adding proxy to logger');
        var ldata = self.logData[proxyServer.srcPort];
        if (ldata == null || ldata == undefined) {
            ldata = new Object();
            ldata.log = new Array();
            ldata.startTime = new Date();
            self.logData[proxyServer.srcPort] = ldata;
        };
        
        ldata.log.push('Connected');
    });
    
    proxyManager.on('SHOWLOG', function(args, callback) {
        console.log(self.logData);
        callback('OK');
    });
    
};
