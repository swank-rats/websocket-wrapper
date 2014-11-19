var chai = require('chai'),
    sinonChai = require('sinon-chai'),
    ws = require('ws'),
    http= require('http'),
    Websocket = require('../app').WebsocketWrapper,
    expect = require('chai').expect;

chai.should();
chai.use(sinonChai);

describe('#app-events', function() {
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

    it('...', function() {
    });
});
