var chai = require('chai'),
    sinonChai = require('sinon-chai'),
    ws = require('ws'),
    http = require('http'),
    Websocket = require('../app').WebsocketWrapper,
    expect = require('chai').expect;

chai.should();
chai.use(sinonChai);

describe('#call listener', function() {
    var websocket, wsInstance;

    beforeEach(function() {
        websocket = new Websocket({port: 8080});
    });

    afterEach(function() {
        websocket.stop();
    });

    it('register', function() {
        var echoListener = {
                default: function() {
                }
            },
            listener;

        websocket.addListener('echo', echoListener);

        listener = websocket.getListener();

        expect(listener).not.to.be.null;
        expect(listener).to.have.property('echo');
        expect(listener.echo).to.be.equal(echoListener);
    });

    it('default callback', function(done) {
        var echoListener = {
                default: function() {
                    wsInstance.close();
                    done();
                }
            },
            listener;

        websocket.addListener('test', echoListener);

        listener = websocket.getListener();
        expect(listener).not.to.be.null;
        expect(listener).to.have.property('test');
        expect(listener.test).to.be.equal(echoListener);

        wsInstance = new ws('ws://localhost:8080');
        wsInstance.on('open', function() {
            wsInstance.send(JSON.stringify({to: 'test'}));
        });

        setTimeout(function() {
            done('default not called');
        }, 100);
    });

    it('command callback', function(done) {
        var echoListener = {
            default: function() {
                wsInstance.close();
                done('wrong callback called');
            },

            test: function() {
                wsInstance.close();
                done();
            }
        };

        websocket.addListener('test', echoListener);

        wsInstance = new ws('ws://localhost:8080');
        wsInstance.on('open', function() {
            wsInstance.send(JSON.stringify({to: 'test', cmd: 'test'}));
        });

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

        websocket.addListener('test', echoListener);

        wsInstance = new ws('ws://localhost:8080');
        wsInstance.on('open', function() {
            wsInstance.send(JSON.stringify({to: 'test', params: [1, 2, 3], data: 'testdata'}));
        });

        setTimeout(function() {
            done('test not called');
        }, 100);
    });

    it('send back', function(done) {
        var echoListener = {
            default: function(socket, params, data) {
                socket.send(data);
            }
        };

        websocket.addListener('test', echoListener);

        wsInstance = new ws('ws://localhost:8080');
        wsInstance.on('open', function() {
            wsInstance.send(JSON.stringify({to: 'test', data: 'testdata'}));
        });

        wsInstance.on('message', function(message) {
            expect(message).to.be.eql('testdata');

            wsInstance.close();
            done();
        });

        setTimeout(function() {
            done('callback not called');
        }, 100);
    });
});
