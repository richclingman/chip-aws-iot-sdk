'use strict';

const approvals = require('approvals').mocha('./test/approvals');

const approvalsConfig = {
    failOnLineEndingDifferences: false,
    errorOnStaleApprovedFiles: false,
    normalizeLineEndingsTo: '\r\n',
    appendEOL: true
};
approvals.configure(approvalsConfig);

const sinon = require('sinon');

describe('chipProDev', function () {
    let chipProDev;
    let executeSet;
    let executeGet;

    beforeEach(function () {
        const chipProDevClass = require('../driver/chipProDev');
        chipProDev = new chipProDevClass();
        executeSet = sinon.stub(chipProDev, 'executeSet');
        executeGet = sinon.stub(chipProDev, 'executeGet').returns(0);
    });

    afterEach(function () {
        executeSet.restore();
        executeGet.restore();
    });

    describe('init', function () {
        it('should initialize ports', function () {
            chipProDev.init();

            this.verifyAsJSON(executeSet.args);
        });
    });

    describe('teardown', function () {
        it('should unexport all ports', function () {
            chipProDev.teardown();

            this.verifyAsJSON(executeSet.args);
        });

    });

    describe('getPinList', function () {
        it('should return name to pin list', function () {
            const pinList = chipProDev.getPinList();

            this.verifyAsJSON(pinList);
        });

    });

    describe('getState', function () {
        it('should return current state of each pin', function () {
            const currentState = chipProDev.getState();

            this.verifyAsJSON(currentState);
        });

    });

    describe('isValidOutput', function() {
        it('should reject invalid values', function () {
            const outputValues = [
                {type: "IO", value: "on"},
                {type: "IO", value: "off"},
                {type: "IO", value: 1},
                {type: "IO", value: "2"},
                {type: "IO", value: "string"},
                {type: "IO", value: null},
            ];

            const result = outputValues.map(function ({type, value}) {
                return {[type]: value, "isValid": chipProDev.isValidOutput(type, value)};
            }.bind(this));

            this.verifyAsJSON(result);
        });

    });

    describe('updateState', function () {
        it('should merge deltas and write json to console', function () {

            const messages = [
                {
                    state: {
                            D0: 'on',
                            D1: 'off',
                    }
                },
                {
                    state: {
                            D3: 'on',
                            D4: 'invalid',
                            PWM0: 123,
                            PWM1: 456
                    }
                },
                {
                    state: {
                            D0: 'off',
                            D2: 'off',
                            D3: 'off',
                            D4: null,
                            PWM0: null,
                    }
                },
            ];

            messages.map(function (message) {
                chipProDev.updateState(message);
            });

            const result = chipProDev.executeSet.args;
            this.verifyAsJSON(result);
        });

    });
});
