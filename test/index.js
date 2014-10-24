var chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    ws = require('ws'),
    http= require('http'),
    Websocket = require('../app'),
    expect = require('chai').expect;

chai.should();
chai.use(sinonChai);

describe('#start', function() {
    var websocket;

    afterEach(function() {
        websocket.stop();
    });

    it('config with port', function(done) {
        websocket = new Websocket({port: 8080});

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

        websocket = new Websocket({server: httpServer});

        var wsInstance = new ws('ws://localhost:8080');

        wsInstance.on('open', function() {
            done();
        });

        setTimeout(function() {
            done('connection not called');
        }, 100);
    });
});

describe('#registerListener', function() {
    var websocket;

    beforeEach(function(done) {
        var wsInstance = new ws('ws://localhost:8080');
        websocket = new Websocket({port: 8080});

        wsInstance.on('open', function() {
            done();
        });
    });

    afterEach(function() {
        websocket.stop();
    });

    it('register listener', function() {
        var echoListener = {
            default: function(socket, params, data) {
                socket.send(socket.id + ':' + data);
            }
        };

        websocket.registerListener('echo', echoListener);

        var listener = websocket.getListener();

        expect(listener).not.to.be.null;
        expect(listener).to.have.property('echo');
        expect(listener.echo).to.be.equal(echoListener);
    });
});
