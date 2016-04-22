var log4js = require('log4js');
var mssql = require('mssql');

var cfg;

function msSqlAppender(config) {
    if (!config) {
        throw new Error('configuration is missing.');
    }
    cfg = config;
    
    // Return method that does the actual logging
    return function (loggingEvent) {
        console.log('logging');
        try {
            mssql.connect(cfg.connSettings).then(function () {
            
                var query = cfg.commandText;
                
                for (var i = 0; i < cfg.parameters.length; ++i) {
                    var param = cfg.parameters[i];
                    
                    var key = param.name.replace('@', '');

                    var value = loggingEvent[key];

                    if (param.dbType.toLowerCase() == 'datetime') {
                        value = new Date(value).toISOString();
                    }

                    query = query.replace(param.name, "'" + value + "'");
                }

                new mssql.Request().query(query).then(function (recordset) {
                }).catch(function (err) {
                    console.log('request failed: ' + err);
                })
            }).catch(function (err) { 
                console.log('connect failed: ' + err);
            })  
        }
        catch (ex) {
            // Failing of logging should not crash the system
            console.log('failed to log event');
            console.log(ex);
        }
    }
};

exports.name = 'msSqlAppender';
exports.appender = msSqlAppender;

