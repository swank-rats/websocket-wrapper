(function() {

    'use strict';

    var chai = require('chai'),
        sinonChai = require('sinon-chai'),
        Events = require('../events').EventSystem,
        expect = require('chai').expect;

    chai.should();
    chai.use(sinonChai);

    describe('#inform event', function() {
        var events, event;

        beforeEach(function() {
            events = new Events();
            event = events.registerEvent('test', events.EVENT_TYPE_INFORM);
        });

        afterEach(function() {
        });

        it('register handler', function() {
            // over events system
            events.registerHandler('test', function() {
            });
            // over event directly
            event.registerHandler(function() {
            });
        });

        it('fire event directly', function(done) {
            events.registerHandler('test', function() {
                done();
            });

            event.fire();
        });

        it('fire event system', function(done) {
            events.registerHandler('test', function() {
                done();
            });

            events.fire('test', ['test-1', 'test-2']);
        });

        it('fire event with parameter directly', function(done) {
            events.registerHandler('test', function(event, p1, p2) {
                expect(event).to.be.eql(event);
                expect(p1).to.be.eql('test-1');
                expect(p2).to.be.eql('test-2');

                done();
            });

            events.fire('test', ['test-1', 'test-2']);
        });

        it('fire event with parameter system', function(done) {
            events.registerHandler('test', function(event, p1, p2) {
                expect(event).to.be.eql(event);
                expect(p1).to.be.eql('test-1');
                expect(p2).to.be.eql('test-2');

                done();
            });

            events.fire('test', ['test-1', 'test-2']);
        });

        it('multiple handler', function() {
            var event1Called = false, event2Called = false;

            events.registerHandler('test', function(event, p1, p2) {
                expect(event).to.be.eql(event);
                expect(p1).to.be.eql('test-1');
                expect(p2).to.be.eql('test-2');

                event1Called = true;
            });
            event.registerHandler(function(event, p1, p2) {
                expect(event).to.be.eql(event);
                expect(p1).to.be.eql('test-1');
                expect(p2).to.be.eql('test-2');

                event2Called = true;
            });

            events.fire('test', ['test-1', 'test-2']);

            expect(event1Called).to.be.eql(true);
            expect(event2Called).to.be.eql(true);
        });
    });
})();
