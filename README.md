# websocket-wrapper


Wrapper for node.js websocket library [https://github.com/einaros/ws](https://github.com/einaros/ws).

It capsules following application:

* Protocoll: Structure and validation
* Delegation: Delegates to listener function with the informations of the protocoll

## Open Tasks

* Security: wss and token authentication
* Votersystem: called foreach message and can decide if message is valid or user is allowed to do this
* Validator & converter: function that converts or validates data before listener is called

## Installation
This package is not published in NPM by now. But you can install it as a private Package.

```bash
npm install git@github.com:swank-rats/websocket-wrapper.git
```

## Start Server
Just instantiate a new instance of the require package.

```javascript
var WebsocketServer = require('websocket-wrapper'),
    websocketServer = new Websocket({port: 8080}); // or {server : http}
```

## Echoserver Example

__SERVER:__

```javascript
var echoListener = {
    echo: function(socket, params, data) {
    	if (!!params.toUpper) {
    	    data = data.toUpperCase();
    	}
        socket.send(data);
    }
};
websocketServer('test', echoListener);
```

__CLIENT (wscat):__
```bash
wscat --connection localhost:8080
> {"to":"test", "cmd":"echo", "params":{"toUpper":true}, "data":"testdata"}
```

__CLIENT (Browser):__

```javascript
var connection = new WebSocket('ws://localhost:8080');

// When the connection is open, send some data to the server
connection.onopen = function () {
	connection.send(JSON.stringify({to: 'echo', data: 'testdata'}));
};

// Log messages from the server
connection.onmessage = function (e) {
  console.log('Server: ' + e.data);
};
```

## Protocol
The library defines a protocol which is used to delegate messages to lestener on the server.

__Example Message:__

```javascript
{
    to: 'test',
    cmd: 'echo',
    params: {
        toUpper: true
    },
    data: 'testdata'
}
```

The example decribes how the messages should be structured.

__Properties:__

* to: used to find listener on the server
* cmd: command name to find function name in listener
* params & data: will be passed to the function

__Remark:__ If no `cmd` is defined a `default` callback on the listener is called.


## API

### Server

* `server.registerListener(name, listener)`: registers new listener
  * name: name des listener
  * listener: object which includes command functions
* `server.stop()`: stop websocket server
* `server.getListener()`: get registered listener

### Listener

* `listener.<cmd-name>(socket, params, data)`: called for message with `cmd:"<cmd-name>"`, the `params` and `data` are passed to the function

### Socket

* `socket.id`: unique identifier

## Running the tests

```bash
npm test
```

## License
The MIT License (MIT)

Copyright (c) 2014 Swank Rats

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

