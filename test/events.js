var chai = require('chai'),
    sinonChai = require('sinon-chai'),
    Events = require('../events'),
    expect = require('chai').expect;

chai.should();
chai.use(sinonChai);

describe('#events', function() {
    var events;

    beforeEach(function() {
        events = new Events();
    });

    afterEach(function() {
    });

    it('register function', function() {
        var event = events.registerEvent('test', events.EVENT_TYPE_VOTER);

        expect(event.type).to.be.eql(events.EVENT_TYPE_VOTER);
        expect(event.name).to.be.eql('test');
    });

    it('register', function() {
        events.registerEvent('test', events.EVENT_TYPE_VOTER);

        var eventList = events.getEvents();

        expect(Object.keys(eventList).length).to.be.equal(1);
        expect(eventList).to.have.property('test');
        expect(eventList['test'].type).to.be.eql(events.EVENT_TYPE_VOTER);
    });

    it('get-event', function() {
        events.registerEvent('test', events.EVENT_TYPE_VOTER);

        var event = events.getEvent('test');

        expect(event.name).to.be.eql('test');
        expect(event.type).to.be.eql(events.EVENT_TYPE_VOTER);
    });

    it('register multiple', function() {
        events.registerEvent('test-1', events.EVENT_TYPE_VOTER);
        events.registerEvent('test-2', events.EVENT_TYPE_INFORM);

        var eventList = events.getEvents();

        expect(Object.keys(eventList).length).to.be.equal(2);
        expect(eventList).to.have.property('test-1');
        expect(eventList).to.have.property('test-2');
        expect(eventList['test-1'].type).to.be.eql(events.EVENT_TYPE_VOTER);
        expect(eventList['test-2'].type).to.be.eql(events.EVENT_TYPE_INFORM);
    });

    it('get-multiple-event', function() {
        events.registerEvent('test-1', events.EVENT_TYPE_VOTER);
        events.registerEvent('test-2', events.EVENT_TYPE_INFORM);

        var event1 = events.getEvent('test-1'),
            event2 = events.getEvent('test-2');

        expect(event1.name).to.be.eql('test-1');
        expect(event1.type).to.be.eql(events.EVENT_TYPE_VOTER);
        expect(event2.name).to.be.eql('test-2');
        expect(event2.type).to.be.eql(events.EVENT_TYPE_INFORM);
    });
});

describe('#handler', function() {
    var events, testEvent;


    beforeEach(function() {
        events = new Events();
        testEvent = events.registerEvent('test', events.EVENT_TYPE_VOTER);
    });

    afterEach(function() {
    });

    it('register', function() {
        var eventHandler = function() {
            return 'test';
        }, handlerList;

        testEvent.register(eventHandler);

        handlerList = testEvent.getHandler();

        expect(handlerList.length).to.be.equal(1);
        expect(handlerList[0]).to.be.eql(eventHandler);
    });

    it('register-multiple', function() {
        var eventHandler1 = function() {
            return 'test-1';
        }, eventHandler2 = function() {
            return 'test-2';
        }, handlerList;

        testEvent.register(eventHandler1);
        testEvent.register(eventHandler2);

        handlerList = testEvent.getHandler();

        expect(handlerList.length).to.be.equal(2);
        expect(handlerList[0]).to.be.eql(eventHandler1);
        expect(handlerList[1]).to.be.eql(eventHandler2);
    });
});
