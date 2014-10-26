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

    it('register', function() {
        events.registerEvent('test', events.EVENT_TYPE_VOTER);

        var eventList = events.getEvents();

        expect(Object.keys(eventList).length).to.be.equal(1);
        expect(eventList).to.have.property('test');
        expect(eventList['test'].type).to.be.eql(events.EVENT_TYPE_VOTER);
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
});
