var log4js = require('log4js');
var mssql = require('mssql');

var cfg;

// Allow usage of parameterNames from log4net
var parameterMappings = {
    log_date: function(loggingEvent) { return loggingEvent.startDate },
    startDate: function (loggingEvent) { return loggingEvent.startDate },
    thread: function(loggingEvent) { return null }, 
    log_level: function(loggingEvent) { return loggingEvent.level },
    level: function(loggingEvent) { return loggingEvent.level },
    logger: function (loggingEvent) { return loggingEvent.categoryName },
    message: function (loggingEvent) { return loggingEvent.data[0] },
    exception: function (loggingEvent) { return loggingEvent.data[1] }
};

// Format the parameter value according to its type
var formatParamValue = function(param, loggingEvent) {
    var key = param.name.replace('@', '');
    var value = loggingEvent[key];

    // If value not found try parameterMappings
    if (!value) {
        var getValue = parameterMappings[key];
        if (getValue) {
            value = getValue(loggingEvent);
        }
    }
    // Handle different datatypes
    if (value) {
        switch (param.dbType.toUpperCase()) {
            // Date and Time
            case 'DATETIME':
            case 'DATE':
            case 'DATETIME2':
            case 'SMALLDATETIME':
            case 'TIME':
                value = "'" + new Date(value).toISOString() + "'";
                break;
            // Numerics
            case 'BIGINT':
            case 'NUMERIC':
            case 'BIT':
            case 'SMALLINT':
            case 'SMALLMONEY':
            case 'INT':
            case 'TINYINT':
            case 'MONEY':
            case 'FLOAT':
            case 'REAL':
                value = value;
                break;
            // Strings
            case 'CHAR':
            case 'VARCHAR':
            case 'TEXT':
            case 'NCHAR':
            case 'NVARCHAR':
            case 'NTEXT':
            case 'STRING':
                // Replace all single quotation marks 
                // from the string with double quatation marks
                value = value.toString().replace(new RegExp('\'', 'g'), '"');
                value = '\'' + value + '\'';
                break;
            default:
                console.log('dbType "' + param.dbType + '" not supported');
                break;
        }   
    }

    return value;
}

function msSqlAppender(config) {
    if (!config) {
        throw new Error('configuration is missing.');
    }
    cfg = config;

    // Return method that does the actual logging
    return function (loggingEvent) {

        try {

            mssql.connect(cfg.connSettings).then(function () {

                // Construct the query based on configuration
                var query = cfg.commandText;

                for (var i = 0; i < cfg.parameters.length; ++i) {
                    var param = cfg.parameters[i];
                    var value = formatParamValue(param, loggingEvent);
                    query = query.replace(param.name, value);
                }
                // Fire up the request and log possible errors
                new mssql.Request().query(query).then(function (recordset) {
                }).catch(function (err) {
                    console.log('request failed asd: ' + err);
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

