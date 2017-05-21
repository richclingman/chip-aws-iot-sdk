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

describe('shadowDevice', function () {
    let awsMock;
    let shadowDeviceClass;
    let registerMock;
    let onMock;
    let args;

    beforeEach(function () {

        registerMock = sinon.spy(function (name, config, callback) {
            console.log('called register');
            callback(null, null);
        });
        onMock = sinon.stub();
        awsMock = {
            thingShadow: sinon.spy(function () {
                return {
                    register: registerMock,
                    on: onMock
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

    describe('device creation', function () {
        it('should call thingShadow and register and register events', function () {
            const driver = {
                init: sinon.stub(),
                on: sinon.stub()
            };

            new shadowDeviceClass(args, driver);

            let result = {};
            result.thingShadowCall = awsMock.thingShadow.args;
            result.registerCall = registerMock.args;
            result.registerEvents = onMock.args;

            this.verifyAsJSON(result);
        });
    });

});


