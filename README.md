# log4js-node-mssql
A log4js-node appender for Microsoft Sql Server

This library is still heavily in development.

## Usage

```javascript
var log4js = require('log4js');
var msSqlAppender = require('./log4js-mssql.js');

log4js.addAppender(msSqlAppender.appender({
	connSettings: {
		user: '<username>',
		password: '<password>',
		server: '<server address>',
		database: '<database>'
	},
	// Replace with your insert statement
commandText: 'INSERT INTO Log ([Date],[Message],[Level],[Logger], [Exception]) VALUES (@startTime, @message, @log_level, @categoryName, @exception)',
    parameters: [
        {
            name: '@startTime',
            dbType: 'DateTime'
        },
        {
            name: '@message',
            dbType: 'String'
        },
        {
            name: '@log_level',
            dbType: 'String'
        },
        {
            name: '@categoryName',
            dbType: 'String'
        },
        {
            name: '@exception',
            dbType: 'String'
        }
	]
}));

var logger = log4js.getLogger();

logger.debug('Testing');
```
## Depencies
log4js-node
mssql

## Author

Tomi Niemenmaa

## License

The MIT License (MIT)

Copyright (c) 2016 Tomi Niemenmaa

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.