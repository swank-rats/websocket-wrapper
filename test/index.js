var chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    ws = require('ws'),
    http= require('http'),
    Websocket = require('../app'),
    should = chai.should();

chai.should();
chai.use(sinonChai);

describe('#start', function() {
    it('config with port', function(done) {
        Websocket({port: 8080});

        var wsInstance = new ws('ws://localhost:8080');

        wsInstance.on('open', function() {
            done();
        });

        setTimeout(function() {
            done('connection not called');
        }, 100);
    });

    it('config with server', function(done) {
       var httpServer = http.createServer().listen(8080, '127.0.0.1');

        Websocket({server: httpServer});

        var wsInstance = new ws('ws://localhost:8080');

        wsInstance.on('open', function() {
            done();
        });

        setTimeout(function() {
            done('connection not called');
        }, 100);
    });
});
