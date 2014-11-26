(function() {

    'use strict';

    var chai = require('chai'),
        sinonChai = require('sinon-chai'),
        Events = require('../events').EventSystem,
        expect = require('chai').expect;

    chai.should();
    chai.use(sinonChai);

    describe('#voter event', function() {

        'use strict';

        var events, event;

        beforeEach(function() {
            events = new Events();
            event = events.registerEvent('test', events.EVENT_TYPE_VOTER);
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
            events.registerHandler('test', function(e, p1, p2) {
                expect(e).to.be.eql(event);
                expect(p1).to.be.eql('test-1');
                expect(p2).to.be.eql('test-2');

                done();
            });

            events.fire('test', ['test-1', 'test-2']);
        });

        it('fire event with parameter system', function(done) {
            events.registerHandler('test', function(e, p1, p2) {
                expect(e).to.be.eql(event);
                expect(p1).to.be.eql('test-1');
                expect(p2).to.be.eql('test-2');

                done();
            });

            events.fire('test', ['test-1', 'test-2']);
        });

        it('multiple handler', function() {
            var event1Called = false, event2Called = false;

            events.registerHandler('test', function(e, p1, p2) {
                expect(e).to.be.eql(event);
                expect(p1).to.be.eql('test-1');
                expect(p2).to.be.eql('test-2');

                event1Called = true;
            });
            event.registerHandler(function(e, p1, p2) {
                expect(e).to.be.eql(event);
                expect(p1).to.be.eql('test-1');
                expect(p2).to.be.eql('test-2');

                event2Called = true;
            });

            events.fire('test', ['test-1', 'test-2']);

            expect(event1Called).to.be.eql(true);
            expect(event2Called).to.be.eql(true);
        });

        it('no voter', function() {
            var result = events.fire('test');

            expect(result).to.be.eql(event.ABSTAIN);
        });

        it('vote granted', function() {
            events.registerHandler('test', function() {
                return events.EVENT_RESULT_GRANTED;
            });

            var result = events.fire('test');

            expect(result).to.be.eql(events.EVENT_RESULT_GRANTED);
        });

        it('vote abstain', function() {
            events.registerHandler('test', function() {
                return events.EVENT_RESULT_ABSTAIN;
            });

            var result = events.fire('test');

            expect(result).to.be.eql(events.EVENT_RESULT_ABSTAIN);
        });

        it('vote denied', function() {
            events.registerHandler('test', function(e) {
                return e.DENIED;
            });

            var result = events.fire('test');

            expect(result).to.be.eql(event.DENIED);
        });

        it('vote granted/denied', function() {
            events.registerHandler('test', function(e) {
                return events.EVENT_RESULT_GRANTED;
            });
            events.registerHandler('test', function(e) {
                return events.EVENT_RESULT_DENIED;
            });

            var result = events.fire('test');

            expect(result).to.be.eql(events.EVENT_RESULT_DENIED);
        });

        it('vote granted/granted', function() {
            events.registerHandler('test', function(e) {
                return events.EVENT_RESULT_GRANTED;
            });
            events.registerHandler('test', function(e) {
                return events.EVENT_RESULT_GRANTED;
            });

            var result = events.fire('test');

            expect(result).to.be.eql(events.EVENT_RESULT_GRANTED);
        });

        it('vote granted/abstain', function() {
            events.registerHandler('test', function(e) {
                return events.EVENT_RESULT_GRANTED;
            });
            events.registerHandler('test', function(e) {
                return events.EVENT_RESULT_ABSTAIN;
            });

            var result = events.fire('test');

            expect(result).to.be.eql(events.EVENT_RESULT_GRANTED);
        });

        it('vote abstain/granted', function() {
            events.registerHandler('test', function(e) {
                return events.EVENT_RESULT_ABSTAIN;
            });
            events.registerHandler('test', function(e) {
                return events.EVENT_RESULT_GRANTED;
            });

            var result = events.fire('test');

            expect(result).to.be.eql(events.EVENT_RESULT_GRANTED);
        });

        it('vote abstain/denied', function() {
            events.registerHandler('test', function(e) {
                return events.EVENT_RESULT_ABSTAIN;
            });
            events.registerHandler('test', function(e) {
                return events.EVENT_RESULT_DENIED;
            });

            var result = events.fire('test');

            expect(result).to.be.eql(events.EVENT_RESULT_DENIED);
        });

        it('vote abstain/abstain', function() {
            events.registerHandler('test', function(e) {
                return events.EVENT_RESULT_ABSTAIN;
            });
            events.registerHandler('test', function(e) {
                return events.EVENT_RESULT_ABSTAIN;
            });

            var result = events.fire('test');

            expect(result).to.be.eql(events.EVENT_RESULT_ABSTAIN);
        });
    });
})();
