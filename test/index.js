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

describe('#listener', function() {
    var websocket, wsInstance;

    beforeEach(function(done) {
        wsInstance = new ws('ws://localhost:8080');
        websocket = new Websocket({port: 8080});

        wsInstance.on('open', function() {
            done();
        });
    });

    afterEach(function() {
        websocket.stop();
    });

    it('register', function() {
        var echoListener = {
                default: function(socket, params, data) {
                }
            },
            listener;

        websocket.registerListener('echo', echoListener);
        listener = websocket.getListener();

        expect(listener).not.to.be.null;
        expect(listener).to.have.property('echo');
        expect(listener.echo).to.be.equal(echoListener);
    });

    it('default callback', function(done) {
        var echoListener = {
            default: function() {
                done();
            }
        };

        websocket.registerListener('test', echoListener);

        wsInstance.send(JSON.stringify({to: 'test'}));

        setTimeout(function() {
            done('default not called');
        }, 100);
    });

    it('command callback', function(done) {
        var echoListener = {
            default: function(socket, params, data) {
                done('wrong callback called');
            },

            test: function() {
                done();
            }
        };

        websocket.registerListener('test', echoListener);

        wsInstance.send(JSON.stringify({to: 'test', cmd: 'test'}));

        setTimeout(function() {
            done('test not called');
        }, 100);
    });

    it('parameter', function(done) {
        var echoListener = {
            default: function(socket, params, data) {

                expect(socket).not.to.be.null;

                expect(params).not.to.be.null;
                expect(params).to.be.eql([1, 2, 3]);

                expect(data).not.to.be.null;
                expect(data).to.be.eql('testdata');

                done();
            }
        };

        websocket.registerListener('test', echoListener);

        wsInstance.send(JSON.stringify({to: 'test', params: [1, 2, 3], data: 'testdata'}));

        setTimeout(function() {
            done('test not called');
        }, 100);
    });
});
