'use strict';

const expect = require("chai").expect;
const sinon = require('sinon');
const mockery = require('mockery');

// const config = require('../config.json');

describe('shadowDevice', function () {
    let awsMock;
    let shadowDevice;
    let register;
    let args;

    beforeEach(function () {

        register = sinon.spy(function (name, config, callback) {
            console.log('called register');
            callback(null, null);
        });
        awsMock = {
            thingShadow: sinon.spy(function () {

                console.log('* * * called thingShadow');


                return {
                    register: register
                };
            })
        };

        mockery.enable();
        mockery.registerMock('aws-iot-device-sdk', awsMock);
        shadowDevice = require('../shadowDevice');
        
        args = {
            privateKey: 'privateKey',
            clientCert: 'clientCert',
            caCert: 'caCert',
            clientId: 'clientId',
            region: 'region',
            baseReconnectTimeMs: 'baseReconnectTimeMs',
            keepAlive: 'keepAlive',
            Protocol: 'Protocol',
            Port: 'Port',
            Host: 'Host',
            Debug: false,

            thingName: 'testThing'
        };
    });

    afterEach(function () {
        mockery.deregisterAll();
        mockery.disable()
    });


    it('should call thingShadow() and register', function () {
        shadowDevice(args);
        expect(awsMock.thingShadow.callCount).to.equal(1);
        expect(register.callCount).to.equal(1);
    });

});


