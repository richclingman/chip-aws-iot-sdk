'use strict';

const sinon = require('sinon');
const mockery = require('mockery');

const approvals = require('approvals').mocha('./test/approvals');

const approvalsConfig = {
    failOnLineEndingDifferences: false,
    errorOnStaleApprovedFiles: false,
    normalizeLineEndingsTo: '\r\n',
    appendEOL: true
};
approvals.configure(approvalsConfig);

// const config = require('../config.json');

describe('shadowDevice', function () {
    let awsMock;
    let shadowDeviceClass;
    let register;
    let args;

    beforeEach(function () {

        register = sinon.spy(function (name, config, callback) {
            console.log('called register');
            callback(null, null);
        });
        awsMock = {
            thingShadow: sinon.spy(function () {
                return {
                    register: register
                };
            })
        };

        mockery.enable({
            warnOnUnregistered: false
        });
        mockery.registerMock('aws-iot-device-sdk', awsMock);
        shadowDeviceClass = require('../shadowDevice');
        
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


    it('should call thingShadow and register', function () {
        let shadowDevice = new shadowDeviceClass(args);

        let result = {};
        result.thingShadowCall = awsMock.thingShadow.args;
        result.registerCall = register.args;

        this.verifyAsJSON(result);
    });

});


