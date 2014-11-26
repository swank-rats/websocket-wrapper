var chai = require('chai'),
    sinonChai = require('sinon-chai'),
    ws = require('ws'),
    http = require('http'),
    Websocket = require('../app').WebsocketWrapper,
    expect = require('chai').expect;

chai.should();
chai.use(sinonChai);

describe('#listener', function() {
    var websocket, wsInstance1, wsInstance2,
        echoListener = {
            name: 'echo',
            default: function(socket, params, data) {
                socket.broadcast(this.name, 'default', params, data);
            }
        };

    beforeEach(function(done) {
        websocket = new Websocket({port: 8080});
        websocket.addListener(echoListener.name, echoListener);

        wsInstance1 = new ws('ws://localhost:8080');

        wsInstance1.on('open', function() {
            wsInstance2 = new ws('ws://localhost:8080');

            wsInstance2.on('open', function() {
                done();
            });
        });
    });

    afterEach(function() {
        websocket.stop();
    });

    it('multiple clients', function(done) {
        var i = 0;

        wsInstance1.on('message', function(message) {
            message = JSON.parse(message);
            expect(message.data).to.be.eql('testdata');

            i++;
            if (i === 2) {
                done();
            }
        });

        wsInstance2.on('message', function(message) {
            message = JSON.parse(message);
            expect(message.data).to.be.eql('testdata');

            i++;
            if (i === 2) {
                done();
            }
        });

        wsInstance1.send(JSON.stringify({to: 'echo', data: 'testdata'}));

        setTimeout(function() {
            done('callback not called');
        }, 100);
    });
});
