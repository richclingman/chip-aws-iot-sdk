'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const mockery = require('mockery');

const approvals = require('approvals').mocha('./test/approvals');

const approvalsConfig = {
    failOnLineEndingDifferences: false,
    errorOnStaleApprovedFiles: false,
    normalizeLineEndingsTo: '\r\n',
    appendEOL: true
};
approvals.configure(approvalsConfig);

describe.only('chipProDevGpio', function () {
    let chipProDevGpio;
    let gpioMock;
    let promptCallback;
    let writeMock;
    let unexportMock;

    beforeEach(function () {
        writeMock = sinon.stub();
        unexportMock = sinon.stub();
        gpioMock = {
            Gpio: sinon.spy(function (pin, direction, trigger, callback) {
                this.pin = pin;

                this.write = writeMock;
                this.unexport = function() {unexportMock('unexporting', this.pin)};
            })
        };

        mockery.enable({
            warnOnUnregistered: false
        });
        mockery.registerMock('chip-gpio', gpioMock);

        const chipProDevGpioClass = require('../driver/chipProDevGpio');
        chipProDevGpio = new chipProDevGpioClass();

        // sinon.stub(chipProDevGpio, 'writeOutput');
    });

    afterEach(function () {
        // chipProDevGpio.writeOutput.restore();

        mockery.deregisterAll();
        mockery.disable()
    });

    describe('init', function () {
        it('should initialize ports', function () {
            chipProDevGpio.init();

            this.verifyAsJSON({
                Gpio: gpioMock.Gpio.args,
                write: writeMock.args
            });
        });
    });

    describe('teardown', function () {
        it('should unexport all ports', function () {
            // init to have pin objects
            chipProDevGpio.init();

            chipProDevGpio.teardown();

            this.verifyAsJSON(unexportMock.args);
        });
    });
});
